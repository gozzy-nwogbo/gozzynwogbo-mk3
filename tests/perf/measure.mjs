// Shared LCP/CLS measurement: median of N loads of "/" per viewport (Chromium).
import { chromium } from "@playwright/test";

const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

async function once(browser, viewport, url) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(3000);
  const r = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }));
  await ctx.close();
  return r;
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

export async function measure(url = "http://localhost:4329/", runs = 3) {
  const browser = await chromium.launch();
  const out = { lcpMs: {}, cls: {} };
  for (const [name, vp] of Object.entries(VIEWPORTS)) {
    const rs = [];
    for (let i = 0; i < runs; i++) rs.push(await once(browser, vp, url));
    out.lcpMs[name] = Math.round(median(rs.map((r) => r.lcp)));
    out.cls[name] = Number(median(rs.map((r) => r.cls)).toFixed(4));
  }
  await browser.close();
  return out;
}
