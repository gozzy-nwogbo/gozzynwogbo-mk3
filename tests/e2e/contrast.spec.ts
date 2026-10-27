import { test, expect, type Page } from "@playwright/test";
import { setTheme } from "./helpers";

const lum = ([r, g, b]: number[]) => {
  const c = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

// Lightest and darkest background luminance behind the text lines of `sel` (text hidden).
async function bgRange(page: Page, sel: string): Promise<[number, number]> {
  const rects = await page.locator(sel).evaluate((el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    return [...r.getClientRects()].filter((q) => q.width > 4).map((q) => ({ x: q.x, y: q.y, width: q.width, height: q.height }));
  });
  let lo = 1, hi = 0;
  for (const rect of rects) {
    const [l, h] = await sample(page, rect);
    lo = Math.min(lo, l);
    hi = Math.max(hi, h);
  }
  return [lo, hi];
}

async function sample(page: Page, box: { x: number; y: number; width: number; height: number }): Promise<[number, number]> {
  const png = await page.screenshot({ clip: box });
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const x = c.getContext("2d")!;
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    const L = (r: number, g: number, b: number) =>
      [r, g, b]
        .map((v) => v / 255)
        .map((s) => (s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4))
        .reduce((acc, s, i) => acc + s * [0.2126, 0.7152, 0.0722][i], 0);
    let lo = 1, hi = 0;
    for (let i = 0; i < d.length; i += 4) {
      const l = L(d[i], d[i + 1], d[i + 2]);
      lo = Math.min(lo, l);
      hi = Math.max(hi, l);
    }
    return [lo, hi] as [number, number];
  }, png.toString("base64"));
}

for (const theme of ["light", "dark"] as const) for (const width of [1280, 1440]) test(`headline stays readable over every hold and pass at ${width} (${theme})`, async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "pixel sampling runs once");
  await setTheme(page, theme);
  await page.setViewportSize({ width, height: Math.round(width * 0.625) });
  await page.goto("/");
  await expect(page.locator("[data-walkon]")).toHaveClass(/is-playing/, { timeout: 10_000 });
  const walks: { turnAt: number; holdEnd: number }[] = JSON.parse(
    (await page.locator("[data-walkon]").getAttribute("data-walks"))!,
  );
  const textColor = (sel: string) =>
    page.locator(sel).evaluate((el) => getComputedStyle(el).color.match(/\d+/g)!.slice(0, 3).map(Number));
  const title = lum(await textColor(".title-payoff"));
  const setup = lum(await textColor(".title-setup"));
  const support = lum(await textColor(".hero-support"));
  await page.addStyleTag({ content: ".hero-title, .hero-title *, .hero-support { color: transparent !important; } .anchor-dot { visibility: hidden !important; }" });
  const times = walks.flatMap((w) => [w.turnAt + 0.5, (w.turnAt + w.holdEnd) / 2, w.holdEnd - 0.5]);
  for (const t of [...times, 1, 9, 18, 27, 34]) {
    await page.locator("video[data-walkon-video]").evaluate(
      (v: HTMLVideoElement, t) =>
        new Promise<void>((res) => {
          v.pause();
          v.addEventListener("seeked", () => res(), { once: true });
          v.currentTime = t;
        }),
      t,
    );
    await page.waitForTimeout(150);
    for (const [sel, text, min] of [[".title-payoff", title, 3], [".title-setup", setup, 3], [".hero-support", support, 4.5]] as const) {
      const [lo, hi] = await bgRange(page, sel);
      const worst = Math.min(ratio(text, lo), ratio(text, hi));
      console.log(`${sel} @${t.toFixed(2)}s contrast ${worst.toFixed(2)}`);
      expect(worst, `${sel} at ${t}s`).toBeGreaterThanOrEqual(min);
    }
  }
});
