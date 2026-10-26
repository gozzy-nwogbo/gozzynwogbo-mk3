import { test, expect } from "@playwright/test";

test("homepage renders headline", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("I build the version that runs");
});
