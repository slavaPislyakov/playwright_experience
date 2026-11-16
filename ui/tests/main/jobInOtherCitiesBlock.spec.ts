import { test } from "@@/ui/fixtures/fixture";

// Шум фингерпринт-скриптов сайта: попытки загрузить chrome-extension://-ресурсы
// для детекта установленных расширений браузера, а не ошибка самого сайта
const extensionProbeError: RegExp = /Fetch API cannot load chrome-extension:/;

test.use({ jsErrorAllowlist: [extensionProbeError] });

test.describe("Check jobs in other cities block using snapshot testing:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
  });

  test("Check elements in jobs in other cities block", async ({ mainPageSteps }) => {
    await mainPageSteps.checkBlockOnPage("jobInOtherCitiesBlock");
  });
});
