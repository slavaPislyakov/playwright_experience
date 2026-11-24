import { liveSiteConsoleNoise } from "@@/ui/data/consoleNoise";

import { test } from "@@/ui/fixtures/fixture";

test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] });

test.describe("Main page:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
  });

  test("Navigate to main page test @smoke", async ({ mainPageSteps }) => {
    await mainPageSteps.checkAnonymousHeaderText("Поиск работы в Минске");
    await mainPageSteps.navigationSteps.checkNavigationElementIsVisible();
  });
});

test.describe("Cookie banner:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
  });

  test("Accept cookies banner hides the banner", async ({ mainPageSteps }) => {
    await mainPageSteps.cookieBannerSteps.checkCookiePolicyBannerIsVisible();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicy();
    await mainPageSteps.cookieBannerSteps.checkCookiePolicyBannerIsHidden();
  });
});

test.describe("User type switcher:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
  });

  test("Switch to employer mode navigates to employer page", async ({ mainPageSteps }) => {
    await mainPageSteps.navigationSteps.selectEmployerMode();
    await mainPageSteps.checkCurrentUrl("/employer");
  });
});
