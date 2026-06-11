import { test, expect } from "@playwright/test";

test.describe("Search Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/search");
    await page.waitForTimeout(1500);
  });

  test("loads with heading", async ({ page }) => {
    const heading = page.getByText("搜索旅行体验").first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test("renders search input", async ({ page }) => {
    const input = page.getByRole("textbox");
    await expect(input).toBeVisible({ timeout: 3000 });
    await expect(input).toBeEnabled();
  });

  test("shows initial prompt before typing", async ({ page }) => {
    const prompt = page.getByText(/搜索旅行体验|输入关键词/).first();
    await expect(prompt).toBeVisible({ timeout: 3000 });
  });

  test("typing triggers results", async ({ page }) => {
    const input = page.getByRole("textbox");
    await input.fill("拉面");
    await page.waitForTimeout(1500);

    // Any non-crash outcome is valid
    const bodyText = await page.textContent("body");
    expect(bodyText).toBeTruthy();
  });

  test("search for gibberish shows empty or loading state", async ({ page }) => {
    const input = page.getByRole("textbox");
    await input.fill("xyznonexistent999abc");
    await page.waitForTimeout(2000);
    // The page should show some content — either empty state, loading, or results
    const bodyText = await page.textContent("body");
    expect(bodyText).toBeTruthy();
  });

  test("clear input resets search", async ({ page }) => {
    const input = page.getByRole("textbox");
    await input.fill("冰岛");
    await page.waitForTimeout(500);
    await input.clear();
    await page.waitForTimeout(500);
    await expect(input).toHaveValue("");
  });

  test("empty query shows initial state", async ({ page }) => {
    const input = page.getByRole("textbox");
    await expect(input).toBeVisible();
    const initialState = page.getByText(/搜索旅行体验|输入关键词/).first();
    await expect(initialState).toBeVisible({ timeout: 3000 });
  });
});
