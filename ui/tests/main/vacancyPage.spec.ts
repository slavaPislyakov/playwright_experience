import { liveSiteConsoleNoise } from "@@/ui/data/consoleNoise";

import { test } from "@@/ui/fixtures/fixture";

test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] });

test.describe("Vacancy page:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
  });

  test("Open vacancy from search results and check key elements", async ({ mainPageSteps, searchResultsPageSteps, vacancyPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();

    const vacancyHref = await searchResultsPageSteps.getFirstVacancyTitleHref();
    await vacancyPageSteps.navigateToVacancy(vacancyHref);

    await vacancyPageSteps.checkCurrentUrl("/vacancy/");
    await vacancyPageSteps.checkVacancyTitleIsVisible();
    await vacancyPageSteps.checkVacancyCompanyNameIsVisible();
  });

  test("Vacancy page shows key content blocks", async ({ mainPageSteps, searchResultsPageSteps, vacancyPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();

    const vacancyHref = await searchResultsPageSteps.getFirstVacancyTitleHref();
    await vacancyPageSteps.navigateToVacancy(vacancyHref);

    await vacancyPageSteps.checkVacancyDescriptionIsNotEmpty();
    await vacancyPageSteps.checkVacancyContentBlocksAreVisible();
  });
});
