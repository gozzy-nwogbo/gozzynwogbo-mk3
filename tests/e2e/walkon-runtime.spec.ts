import { test, expect, type Page } from "@playwright/test";
import { DESKTOP, PHONE, countBytes, countMediaRequests, setTheme, throttle } from "./helpers";

const root = (page: Page) => page.locator("[data-walkon]");
const video = (page: Page) => page.locator("video[data-walkon-video]");
const toggle = (page: Page) => page.locator("button[data-walkon-toggle]");
const paused = (page: Page) => video(page).evaluate((v: HTMLVideoElement) => v.paused);

async function startPlaying(page: Page) {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  await expect(root(page)).toHaveClass(/is-playing/, { timeout: 10_000 });
}

async function scrollHeroAway(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(400);
}

async function scrollHeroBack(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

async function settleCount(page: Page, read: () => number) {
  await page.waitForLoadState("load");
  await page.waitForTimeout(4000);
  return read();
}

test("desktop light loads video", async ({ page }) => {
  const media = countMediaRequests(page);
  await startPlaying(page);
  expect(media()).toBeGreaterThan(0);
});

test("phone downloads nothing", async ({ page }) => {
  const media = countMediaRequests(page);
  await page.setViewportSize(PHONE);
  await page.goto("/");
  expect(await settleCount(page, media)).toBe(0);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("reduced motion downloads nothing", async ({ page }) => {
    const media = countMediaRequests(page);
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    expect(await settleCount(page, media)).toBe(0);
  });
});

test("stored dark theme loads only the dark set", async ({ page }) => {
  const urls: string[] = [];
  page.on("request", (r) => /\/hero\/.*\.mp4/.test(r.url()) && urls.push(r.url()));
  await setTheme(page, "dark");
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  await expect(root(page)).toHaveClass(/is-playing/, { timeout: 10_000 });
  expect(urls.length).toBeGreaterThan(0);
  expect(urls.every((u) => u.includes("-dark."))).toBe(true);
});

test("data saver downloads nothing", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "navigator.connection is Chromium-only");
  const media = countMediaRequests(page);
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "connection", { get: () => ({ saveData: true }) });
  });
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  expect(await settleCount(page, media)).toBe(0);
});

test("label follows the video clock", async ({ page }) => {
  await startPlaying(page);
  const walks = JSON.parse((await root(page).getAttribute("data-walks"))!);
  const seek = (t: number) =>
    video(page).evaluate(
      (v: HTMLVideoElement, t) =>
        new Promise<void>((res) => {
          v.pause();
          v.addEventListener("seeked", () => res(), { once: true });
          v.currentTime = t;
        }),
      t,
    );
  await seek(walks[1].turnAt + 0.5);
  const active = page.locator("[data-walkon-label].is-active");
  await expect(active).toHaveCount(1);
  await expect(active).toHaveText("02 · BUILDER");
  await seek(walks[1].holdEnd + 0.5);
  await expect(active).toHaveCount(0);
});

test("pause button toggles", async ({ page }) => {
  await startPlaying(page);
  await expect(toggle(page)).toBeVisible();
  await expect(toggle(page)).toHaveAttribute("aria-label", "Pause background video");
  await toggle(page).focus();
  await page.keyboard.press("Enter");
  await expect.poll(() => paused(page)).toBe(true);
  await expect(toggle(page)).toHaveAttribute("aria-label", "Play background video");
  await page.keyboard.press("Enter");
  await expect.poll(() => paused(page)).toBe(false);
  await expect(toggle(page)).toHaveAttribute("aria-label", "Pause background video");
});

test("manual pause survives scroll and tab hide", async ({ page }) => {
  await startPlaying(page);
  await toggle(page).click();
  await expect.poll(() => paused(page)).toBe(true);
  await scrollHeroAway(page);
  await scrollHeroBack(page);
  await page.evaluate(() => {
    const set = (s: string) => {
      Object.defineProperty(document, "visibilityState", { value: s, configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    };
    set("hidden");
    set("visible");
  });
  await page.waitForTimeout(500);
  expect(await paused(page)).toBe(true);
});

test("auto pause off screen", async ({ page }) => {
  await startPlaying(page);
  await scrollHeroAway(page);
  await expect.poll(() => paused(page)).toBe(true);
  await scrollHeroBack(page);
  await expect.poll(() => paused(page)).toBe(false);
});

test("theme flip mid-playback swaps to the other set", async ({ page }) => {
  await startPlaying(page);
  const src = () => video(page).evaluate((v: HTMLVideoElement) => v.currentSrc);
  expect(await src()).not.toContain("-dark.");
  await page.evaluate(() => (document.documentElement.dataset.theme = "dark"));
  await expect(root(page)).toHaveClass(/is-playing/, { timeout: 10_000 });
  await expect.poll(src).toContain("-dark.");
  await page.evaluate(() => (document.documentElement.dataset.theme = "light"));
  await expect.poll(src).not.toContain("-dark.");
});

test("manual pause survives a theme flip", async ({ page }) => {
  await startPlaying(page);
  await toggle(page).click();
  await page.evaluate(() => (document.documentElement.dataset.theme = "dark"));
  await page.waitForTimeout(2500);
  expect(await paused(page)).toBe(true);
});

test("shrink below breakpoint", async ({ page }) => {
  await startPlaying(page);
  await page.setViewportSize(PHONE);
  await expect.poll(() => paused(page)).toBe(true);
  await expect(root(page)).toBeHidden();
  await page.setViewportSize(DESKTOP);
  await expect.poll(() => paused(page)).toBe(false);
});

test("broken source keeps poster", async ({ page }) => {
  await page.route("**/hero/*.mp4", (r) => r.abort());
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  await page.waitForTimeout(3000);
  await expect(page.locator("img[data-walkon-poster]")).toBeVisible();
  await expect(root(page)).not.toHaveClass(/is-playing/);
  await expect(page.locator("[data-walkon-label].is-active")).toHaveCount(0);
  await expect(toggle(page)).toBeHidden();
});

test("theme flip mid-download stops the old transfer", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "CDP byte counting");
  const lightBytes = await countBytes(page, /\/hero\/walkon-(av1|h264)\.mp4/);
  await throttle(page, 2000);
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  await expect.poll(() => lightBytes(), { timeout: 15_000 }).toBeGreaterThan(20_000);
  await page.evaluate(() => (document.documentElement.dataset.theme = "dark"));
  await page.waitForTimeout(800);
  const after = lightBytes();
  await page.waitForTimeout(4000);
  expect(lightBytes() - after).toBeLessThan(64 * 1024);
});
