import { test, expect, type Page } from "@playwright/test";
import { DESKTOP, PHONE, setTheme } from "./helpers";

function countPoster(page: Page): () => number {
  let n = 0;
  page.on("request", (r) => {
    if (/walkon-poster\./.test(r.url())) n++;
  });
  return () => n;
}

const settle = (page: Page) => page.waitForLoadState("load").then(() => page.waitForTimeout(1500));

test("phone downloads no poster", async ({ page }) => {
  const posters = countPoster(page);
  await page.setViewportSize(PHONE);
  await page.goto("/");
  await settle(page);
  expect(posters()).toBe(0);
});

test("dark theme downloads no poster", async ({ page }) => {
  const posters = countPoster(page);
  await setTheme(page, "dark");
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  await settle(page);
  expect(posters()).toBe(0);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("reduced motion still shows the poster", async ({ page }) => {
    const posters = countPoster(page);
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    await settle(page);
    expect(posters()).toBe(1);
    await expect(page.locator("img[data-walkon-poster]")).toBeVisible();
  });
});

test("desktop poster is fetched at high priority", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  await expect(page.locator("img[data-walkon-poster]")).toHaveAttribute("fetchpriority", "high");
  await expect.poll(() => page.locator("img[data-walkon-poster]").evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
});
