import { liveSiteConsoleNoise } from "@@/ui/data/consoleNoise";

import { test } from "@@/ui/fixtures/fixture";

test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] });

const searchQuery = "Javascript";

test.describe("Search filters:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
    await mainPageSteps.typeTextInSearchField(searchQuery);
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();
  });

  test("Check search filters block is visible on vacancy search results", async ({ searchResultsPageSteps }) => {
    await searchResultsPageSteps.checkResultsHeaderContains(searchQuery);
    await searchResultsPageSteps.checkSearchFiltersAreVisible();
  });
});
