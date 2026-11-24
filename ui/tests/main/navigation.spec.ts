import { liveSiteConsoleNoise } from "@@/ui/data/consoleNoise";

import { test } from "@@/ui/fixtures/fixture";

test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] });

test.describe("Navigation menu:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
  });

  test("Navigation menu items are visible on main page", async ({ mainPageSteps }) => {
    await mainPageSteps.navigationSteps.checkNavigationMenuItemsAreVisible();
  });
});
