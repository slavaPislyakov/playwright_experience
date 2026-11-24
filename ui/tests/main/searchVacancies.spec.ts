import { liveSiteConsoleNoise } from "@@/ui/data/consoleNoise";

import { test } from "@@/ui/fixtures/fixture";

test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] });

const searchQueries = ["Python", "1С"] as const;

test.describe("Search vacancies:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
  });

  test("Search 'Javascript' jobs and check results page @smoke", async ({ mainPageSteps, searchResultsPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();

    await searchResultsPageSteps.checkResultsHeaderContains("Javascript");
    await searchResultsPageSteps.checkVacancyItemsArePresent();
  });

  test("Search results URL contains query and area params", async ({ mainPageSteps, searchResultsPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();

    await searchResultsPageSteps.checkCurrentUrl("text=Javascript");
    await searchResultsPageSteps.checkCurrentUrl("area=");
  });

  test("Search with non-existing query shows empty results block", async ({ mainPageSteps, searchResultsPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("qwertyxyz12345notexist");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();

    await searchResultsPageSteps.checkResultsHeaderContains("ничего не найдено");
    await searchResultsPageSteps.checkEmptySearchBlockIsVisible();
    await searchResultsPageSteps.checkBlockOnPage("emptySearchBlock");
  });

  for (const query of searchQueries) {
    test(`Search '${query}' jobs and check results`, async ({ mainPageSteps, searchResultsPageSteps }) => {
      await mainPageSteps.typeTextInSearchField(query);
      await mainPageSteps.selectFindButton();
      await mainPageSteps.registrationModalSteps.selectModalCloseButton();

      await searchResultsPageSteps.checkResultsHeaderContains(query);
      await searchResultsPageSteps.checkVacancyItemsArePresent();
    });
  }
});
