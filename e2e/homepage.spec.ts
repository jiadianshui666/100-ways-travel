import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/100 Ways Travel/i);
});

test("homepage has dark background", async ({ page }) => {
  await page.goto("/");
  const body = page.locator("body");
  const bgColor = await body.evaluate((el) =>
    window.getComputedStyle(el).backgroundColor
  );
  // Should be dark (low RGB values)
  expect(bgColor).toBeTruthy();
});
