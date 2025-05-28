import { expect, test } from "@playwright/test";

test.describe("Визуальное тестирование - toHaveScreenshot()", () => {
  test("Сравнение всей страницы", async ({ page }, testInfo) => {
    await page.goto("https://playwright.dev/");

    await expect(page).toHaveScreenshot(testInfo.title + ".png", {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test("Сравнение конкретного элемента", async ({ page }, testInfo) => {
    await page.goto("https://playwright.dev/");

    const header = page.locator("header");

    await expect(header).toHaveScreenshot(testInfo.title + ".png", {
      maxDiffPixels: 50,
    });
  });
});
