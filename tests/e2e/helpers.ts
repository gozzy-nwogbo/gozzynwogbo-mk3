import type { Page } from "@playwright/test";

export const DESKTOP = { width: 1440, height: 900 };
export const PHONE = { width: 390, height: 844 };

/** Start counting video requests; call before navigating. Returns a reader. */
export function countMediaRequests(page: Page): () => number {
  let n = 0;
  page.on("request", (req) => {
    const url = req.url().split("?")[0];
    if (req.resourceType() === "media" || url.endsWith(".mp4") || url.endsWith(".webm")) n++;
  });
  return () => n;
}

/** Persist a theme choice so BaseLayout's inline script applies it on load. */
export async function setTheme(page: Page, theme: "light" | "dark"): Promise<void> {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, theme);
}
