import { test } from "@@/ui/fixtures/fixture";

// Шум фингерпринт-скриптов сайта: попытки загрузить chrome-extension://-ресурсы
// для детекта установленных расширений браузера, а не ошибка самого сайта
const extensionProbeError: RegExp = /Fetch API cannot load chrome-extension:/;

test.use({ jsErrorAllowlist: [extensionProbeError] });

test.describe("Search jobs and check browser console", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
  });

  test("Search 'Javascript' jobs", async ({ mainPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();
    await mainPageSteps.checkCurrentUrl("Javascript");
  });
});
