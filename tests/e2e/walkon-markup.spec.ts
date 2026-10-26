import { test, expect } from "@playwright/test";
import { DESKTOP, setTheme } from "./helpers";

const LABELS = ["01 · BUSINESS", "02 · BUILDER", "03 · ATHLETE", "04 · DIASPORA"];

test.describe("server HTML (no JS)", () => {
  test.use({ javaScriptEnabled: false, viewport: DESKTOP });

  test("server HTML has no video source", async ({ page }) => {
    await page.goto("/");
    const video = page.locator("video[data-walkon-video]");
    await expect(video).toHaveCount(1);
    expect(await video.getAttribute("src")).toBeNull();
    await expect(video.locator("source")).toHaveCount(0);
  });

  test("labels are real text in order", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator("[data-walkon-label]").allTextContents()).toEqual(LABELS);
  });

  test("pause button hidden without JS", async ({ page }) => {
    await page.goto("/");
    const toggle = page.locator("button[data-walkon-toggle]");
    await expect(toggle).toHaveCount(1);
    await expect(toggle).toBeHidden();
  });

  test("headline stays above media", async ({ page }) => {
    await page.goto("/");
    const box = (await page.locator(".hero-title").boundingBox())!;
    const media = (await page.locator("[data-walkon]").boundingBox())!;
    expect(media.y).toBeLessThanOrEqual(box.y);
    expect(media.y + media.height).toBeGreaterThanOrEqual(box.y + box.height);
    const inTitle = await page.evaluate(
      ([x, y]) => !!document.elementFromPoint(x, y)?.closest(".hero-title"),
      [box.x + box.width / 2, box.y + box.height / 2],
    );
    expect(inTitle).toBe(true);
  });
});

test("walk-on hidden in dark theme", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await setTheme(page, "dark");
  await page.goto("/");
  await expect(page.locator("[data-walkon]")).toHaveCSS("display", "none");
});

test("walk-on never widens the page", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const [scroll, inner] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  expect(scroll).toBeLessThanOrEqual(inner);
});

test("label and toggle sit inside the viewport", async ({ page }) => {
  for (const width of [1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: Math.round(width * 0.625) });
    await page.goto("/");
    for (const sel of ["[data-walkon-label]", "button[data-walkon-toggle]"]) {
      const right = await page.locator(sel).last().evaluate((el) => {
        (el as HTMLElement).hidden = false;
        return el.getBoundingClientRect().right;
      });
      expect(right, `${sel} at ${width}`).toBeLessThanOrEqual(width);
    }
  }
});
