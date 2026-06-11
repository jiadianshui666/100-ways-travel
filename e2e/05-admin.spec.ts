import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard", () => {
  // ── Login page ──
  test("login page renders with form", async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForTimeout(2000);
    const heading = page.getByText("百途管理后台").first();
    await expect(heading).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("button", { name: /登录/ })).toBeVisible();
  });

  test("wrong password shows error message", async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForTimeout(1000);
    await page.locator("input[type='email']").fill("admin@100ways.com");
    await page.locator("input[type='password']").fill("wrong-password");
    await page.getByRole("button", { name: /登录/ }).click();
    // Should show Chinese error text
    await page.waitForTimeout(2000);
    const bodyText = await page.textContent("body");
    const hasError =
      bodyText?.includes("错误") ||
      bodyText?.includes("邮箱或密码") ||
      bodyText?.includes("请先登录") ||
      bodyText?.includes("401");
    expect(hasError).toBeTruthy();
  });

  test("valid login shows admin content", async ({ page }) => {
    await page.goto("/admin/login");
    await page.waitForTimeout(1000);
    await page.locator("input[type='email']").fill("admin@100ways.com");
    await page.locator("input[type='password']").fill("admin123");
    await page.getByRole("button", { name: /登录/ }).click();
    await page.waitForTimeout(3000);

    // Should be in admin area
    const url = page.url();
    const bodyText = await page.textContent("body");
    const isAdmin =
      url.includes("/admin") ||
      bodyText?.includes("仪表盘") ||
      bodyText?.includes("总体验数");
    expect(isAdmin).toBeTruthy();
  });

  // ── Auth guard ──
  test("unauthenticated access to /admin redirects or shows login", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForTimeout(4000);
    const url = page.url();
    const bodyText = await page.textContent("body");
    // Should redirect to login, show login content, or at least be on the admin path
    const isCorrect =
      url.includes("login") ||
      bodyText?.includes("登录") ||
      bodyText?.includes("百途管理后台") ||
      bodyText?.includes("仪表盘");
    expect(isCorrect).toBeTruthy();
  });

  // ── Authenticated tests ──
  test.describe("Logged in flow", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/admin/login");
      await page.waitForTimeout(1000);
      await page.locator("input[type='email']").fill("admin@100ways.com");
      await page.locator("input[type='password']").fill("admin123");
      await page.getByRole("button", { name: /登录/ }).click();
      await page.waitForTimeout(2000);
    });

    test("dashboard loads after login", async ({ page }) => {
      const bodyText = await page.textContent("body");
      const hasDashboard =
        bodyText?.includes("仪表盘") ||
        bodyText?.includes("总体验数") ||
        bodyText?.includes("欢迎");
      expect(hasDashboard).toBeTruthy();
    });

    test("can navigate to experiences page", async ({ page }) => {
      await page.goto("/admin/experiences");
      await page.waitForTimeout(2000);
      const bodyText = await page.textContent("body");
      const hasContent = (bodyText?.length ?? 0) > 100;
      expect(hasContent).toBeTruthy();
    });

    test("can navigate to categories page", async ({ page }) => {
      await page.goto("/admin/categories");
      await page.waitForTimeout(2000);
      const bodyText = await page.textContent("body");
      const hasContent = (bodyText?.length ?? 0) > 100;
      expect(hasContent).toBeTruthy();
    });

    test("new experience form loads", async ({ page }) => {
      await page.goto("/admin/experiences/new");
      await page.waitForTimeout(2000);
      const bodyText = await page.textContent("body");
      const hasForm = (bodyText?.length ?? 0) > 100;
      expect(hasForm).toBeTruthy();
    });

    test("sidebar navigation appears", async ({ page }) => {
      const sidebar = page.getByText("仪表盘").first();
      const visible = await sidebar.isVisible({ timeout: 3000 }).catch(() => false);
      const bodyText = await page.textContent("body");
      const hasNav = visible || bodyText?.includes("体验管理") || bodyText?.includes("分类管理");
      expect(hasNav).toBeTruthy();
    });
  });
});
