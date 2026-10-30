// V4 perf harness: measure URLs under a fixed mid-range profile, write
// results.json, and check the spec's budgets (V4 design 10.2).
// Usage: pnpm perf -- --urls <u1,u2> --runs 3 --out tests/perf/results/<name>.json [--browser webkit]
import { chromium, webkit } from "@playwright/test";
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { VIEWPORTS } from "./measure.mjs";

export const DEFAULT_BUDGETS = { clsMax: 0.02, lcpMaxMs: { desktop: 548, phone: 528 }, phoneImgFontKbMax: 400 };
const PROFILES = { desktop: VIEWPORTS.desktop, phone: VIEWPORTS.mobile };
const BYTE_TYPES = ["image", "font", "script", "media", "document", "stylesheet"];

/** Median (upper middle, as measure.mjs) and nearest-rank p95; values kept in input order. */
export function stat(xs) {
  const s = [...xs].sort((a, b) => a - b);
  return { median: s[Math.floor(s.length / 2)], p95: s[Math.ceil(0.95 * s.length) - 1], values: [...xs] };
}

/** Load `url` in `page` and return LCP, CLS, long frames and transfer bytes by type. */
export async function measurePage(page, url, { cpuRate, scrollPx = 2500 }) {
  let loaf = true;
  if (cpuRate > 1 && page.context().browser()?.browserType().name() === "chromium") {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuRate });
  }
  const bytes = Object.fromEntries([...BYTE_TYPES, "other"].map((t) => [t, 0]));
  const pending = [];
  page.on("requestfinished", (req) =>
    pending.push(
      req.sizes().then((sz) => {
        const t = BYTE_TYPES.includes(req.resourceType()) ? req.resourceType() : "other";
        bytes[t] += sz.responseBodySize + sz.responseHeadersSize;
      }),
    ),
  );
  await page.addInitScript(() => {
    window.__m = { lcp: 0, cls: 0, loaf: [], loafOk: true };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; })
      .observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; })
      .observe({ type: "layout-shift", buffered: true });
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.loaf.push(e.duration); })
        .observe({ type: "long-animation-frame", buffered: true });
    } catch {
      window.__m.loafOk = false;
    }
  });
  await page.goto(url, { waitUntil: "load" });
  await page.mouse.wheel(0, scrollPx);
  await page.waitForTimeout(3000);
  const m = await page.evaluate(() => window.__m);
  await Promise.allSettled(pending);
  loaf = m.loafOk;
  return { lcpMs: m.lcp, cls: m.cls, longFrames: m.loaf, bytes, loaf };
}

/** Measure every URL x profile `runs` times; refuses fewer than 3 runs. */
export async function runHarness({ urls, runs, profiles, cpuRate, browser: name }) {
  if (!(runs >= 3)) throw new Error(`runHarness needs at least 3 runs, got ${runs}`);
  const browser = await (name === "webkit" ? webkit : chromium).launch();
  const effectiveCpu = name === "webkit" ? 1 : cpuRate;
  const out = { meta: { commit: commit(), date: new Date().toISOString(), browser: name, browserVersion: browser.version(), cpuRate: effectiveCpu, runs, loaf: true }, pages: {} };
  try {
    for (const url of urls) {
      out.pages[url] = {};
      for (const profile of profiles) {
        const samples = [];
        for (let i = 0; i < runs; i++) {
          const ctx = await browser.newContext({ viewport: PROFILES[profile], isMobile: profile === "phone" && name === "chromium", hasTouch: profile === "phone" });
          const page = await ctx.newPage();
          samples.push(await measurePage(page, url, { cpuRate: effectiveCpu }));
          await ctx.close();
        }
        out.meta.loaf &&= samples.every((s) => s.loaf);
        out.pages[url][profile] = {
          lcpMs: stat(samples.map((s) => Math.round(s.lcpMs))),
          cls: stat(samples.map((s) => Number(s.cls.toFixed(4)))),
          worstFrameMs: stat(samples.map((s) => Math.round(Math.max(0, ...s.longFrames)))),
          bytesKb: Object.fromEntries(Object.keys(samples[0].bytes).map((t) => [t, Math.round(stat(samples.map((s) => s.bytes[t])).median / 1024)])),
        };
      }
    }
  } finally {
    await browser.close();
  }
  return out;
}

/** Compare medians against budgets; failure strings name the page, profile, metric and value. */
export function checkBudgets(r, budgets = DEFAULT_BUDGETS) {
  const failures = [];
  for (const [url, profiles] of Object.entries(r.pages)) {
    for (const [profile, p] of Object.entries(profiles)) {
      if (p.cls.median > budgets.clsMax) failures.push(`${url} ${profile} cls ${p.cls.median} > ${budgets.clsMax}`);
      const lcpMax = budgets.lcpMaxMs[profile];
      if (lcpMax !== undefined && p.lcpMs.median > lcpMax) failures.push(`${url} ${profile} lcp ${p.lcpMs.median} ms > ${lcpMax} ms`);
      if (profile === "phone") {
        const kb = p.bytesKb.image + p.bytesKb.font;
        if (kb > budgets.phoneImgFontKbMax) failures.push(`${url} phone images+fonts ${kb} KB > ${budgets.phoneImgFontKbMax} KB`);
      }
    }
  }
  return { pass: failures.length === 0, failures };
}

function commit() {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "unknown";
  }
}

function parseArgs(argv) {
  const a = {};
  const args = argv.filter((x) => x !== "--");
  for (let i = 0; i < args.length; i += 2) a[args[i].replace(/^--/, "")] = args[i + 1];
  return a;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const a = parseArgs(process.argv.slice(2));
  const r = await runHarness({
    urls: (a.urls ?? "").split(",").filter(Boolean),
    runs: Number(a.runs ?? 3),
    profiles: (a.profiles ?? "desktop,phone").split(","),
    cpuRate: Number(a.cpu ?? 4),
    browser: a.browser ?? "chromium",
  });
  const verdict = checkBudgets(r);
  r.budgets = { ...DEFAULT_BUDGETS, ...verdict };
  if (a.out) {
    mkdirSync(dirname(a.out), { recursive: true });
    writeFileSync(a.out, JSON.stringify(r, null, 2));
  }
  for (const [url, ps] of Object.entries(r.pages))
    for (const [p, m] of Object.entries(ps))
      console.log(`${url} ${p}: LCP ${m.lcpMs.median} ms (p95 ${m.lcpMs.p95}), CLS ${m.cls.median} (p95 ${m.cls.p95}), worst frame ${m.worstFrameMs.median} ms, KB ${JSON.stringify(m.bytesKb)}`);
  console.log(verdict.pass ? "BUDGETS: pass" : `BUDGETS: FAIL\n  ${verdict.failures.join("\n  ")}`);
  process.exit(verdict.pass ? 0 : 1);
}
