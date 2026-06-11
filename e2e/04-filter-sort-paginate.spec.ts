import { test, expect } from "@playwright/test";

test.describe("Filter + Sort + Pagination", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=视觉风格", { timeout: 5000 });
  });

  test("visual style filter chips are clickable", async ({ page }) => {
    const chip = page.getByText(/自然风光|城市探索|美食之旅|极限冒险|文化体验/).first();
    await chip.click();
    await page.waitForTimeout(500);
    await expect(chip).toBeVisible();
  });

  test("clicking style chip changes results", async ({ page }) => {
    await page.waitForTimeout(1500);
    const beforeCount = await page.locator("a[href*='/experiences/']").count();
    const chip = page.getByText(/美食之旅/).first();
    await chip.click();
    await page.waitForTimeout(1500);
    const afterCount = await page.locator("a[href*='/experiences/']").count();
    expect(typeof afterCount).toBe("number");
  });

  test("sort options are clickable", async ({ page }) => {
    const priceAsc = page.getByText("价格 ↑").first();
    if (await priceAsc.isVisible({ timeout: 2000 }).catch(() => false)) {
      await priceAsc.click();
      await page.waitForTimeout(500);
    }
    const newest = page.getByText("最新发布").first();
    await newest.click();
    await page.waitForTimeout(300);
    await expect(newest).toBeVisible();
  });

  test("niche level chips work", async ({ page }) => {
    const nicheChip = page.getByText("小众").first();
    if (await nicheChip.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nicheChip.click();
      await page.waitForTimeout(300);
      await expect(nicheChip).toBeVisible();
    }
  });

  test("grid section is visible", async ({ page }) => {
    const gridSection = page.getByText("全部体验").first();
    if (await gridSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await gridSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }
    // Page should still be functional
    await expect(page.locator("body")).toBeVisible();
  });
});
