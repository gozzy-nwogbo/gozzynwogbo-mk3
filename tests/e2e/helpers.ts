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

/** Chromium only: total bytes received for URLs matching `pattern`, via CDP. */
export async function countBytes(page: Page, pattern: RegExp): Promise<() => number> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  const urls = new Map<string, string>();
  let bytes = 0;
  cdp.on("Network.requestWillBeSent", (e) => urls.set(e.requestId, e.request.url));
  cdp.on("Network.dataReceived", (e) => {
    if (pattern.test(urls.get(e.requestId) ?? "")) bytes += e.dataLength;
  });
  return () => bytes;
}

/** Chromium only: slow the network so a transfer is still in flight when we act. */
export async function throttle(page: Page, kbps: number): Promise<void> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false, latency: 40, downloadThroughput: (kbps * 1024) / 8, uploadThroughput: (kbps * 1024) / 8,
  });
}
