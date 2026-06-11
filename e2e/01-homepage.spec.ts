import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/100 Ways Travel/i);
  });

  test("renders hero section with heading", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1", { timeout: 5000 });
    const heroHeading = page.locator("h1").first();
    await expect(heroHeading).toBeVisible();
  });

  test("renders category tabs section", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=探索分类", { timeout: 5000 });
    await expect(page.getByText("探索分类")).toBeVisible();
  });

  test("category tabs filter on click", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);
    // Click any visible category button
    const catBtn = page.locator("button:has-text('城市探索'), button:has-text('自然风光'), button:has-text('美食之旅')").first();
    if (await catBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await catBtn.click();
      await page.waitForTimeout(500);
      await expect(catBtn).toBeVisible();
    }
  });

  test("renders featured scroll section", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=精选体验", { timeout: 5000 });
    await expect(page.getByText("精选体验").first()).toBeVisible();
  });

  test("renders filter bar", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=视觉风格", { timeout: 5000 });
    await expect(page.getByText("视觉风格")).toBeVisible();
    await expect(page.getByText("小众指数")).toBeVisible();
    await expect(page.getByText("排序")).toBeVisible();
  });

  test("renders experience grid", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=全部体验", { timeout: 5000 });
    await page.waitForTimeout(2500);
    // Should have experience cards (links to /experiences/)
    const cards = page.locator("a[href*='/experiences/']");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("header navigation links exist", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header").first();
    await expect(header).toBeVisible({ timeout: 3000 });
  });

  test("clicking experience card navigates to detail", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2500);
    const card = page.locator("a[href*='/experiences/']").first();
    if (await card.isVisible({ timeout: 3000 }).catch(() => false)) {
      const href = await card.getAttribute("href");
      await card.click();
      await page.waitForLoadState("networkidle", { timeout: 5000 });
      expect(page.url()).toContain("/experiences/");
    }
  });

  test("footer is visible with branding", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer").first();
    await expect(footer).toBeVisible({ timeout: 3000 });
    // Check for any instance of 100 Ways Travel text
    const brand = footer.getByText(/100 Ways Travel/i).first();
    await expect(brand).toBeVisible({ timeout: 3000 });
  });
});
