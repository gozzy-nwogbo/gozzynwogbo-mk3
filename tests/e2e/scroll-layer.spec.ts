import { test, expect, type Page } from "@playwright/test";
import { DESKTOP, PHONE } from "./helpers";

const RISE = [".span-title", ".pc-card", ".comp-card", ".feature"];

const timeline = (page: Page, sel: string) =>
  page.locator(sel).first().evaluate((el) => getComputedStyle(el).animationTimeline);

test("desktop gets scroll timelines", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  for (const sel of [...RISE, ".hero-atmo"]) {
    expect(await timeline(page, sel), sel).not.toMatch(/^(auto|none)$/);
  }
});

test("phone unchanged", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto("/");
  for (const sel of [...RISE, ".hero-atmo"]) expect(await timeline(page, sel), sel).toBe("auto");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("reduced motion unchanged", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    for (const sel of [...RISE, ".hero-atmo"]) expect(await timeline(page, sel), sel).toBe("auto");
  });
});

test("other pages unchanged", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/about");
  const scrolled = await page.evaluate(
    () => [...document.querySelectorAll("*")].filter((el) => getComputedStyle(el).animationTimeline !== "auto").length,
  );
  expect(scrolled).toBe(0);
});

test("no double animation", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const wrapper = page.locator(".comp-grid [data-reveal]").last();
  await expect(wrapper).toHaveClass(/is-armed/);
  expect(await wrapper.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  expect(await wrapper.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
});

test("bench items untouched", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  expect(await timeline(page, ".bench-item")).toBe("auto");
});

test("final state is visible", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  for (const sel of RISE) {
    const n = await page.locator(sel).count();
    for (let i = 0; i < n; i++) {
      const el = page.locator(sel).nth(i);
      await el.evaluate((e) => e.scrollIntoView({ block: "start" }));
      await page.waitForTimeout(150);
      expect(Number(await el.evaluate((e) => getComputedStyle(e).opacity)), `${sel}[${i}]`).toBe(1);
    }
  }
});
