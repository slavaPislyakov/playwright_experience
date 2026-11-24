import { liveSiteConsoleNoise } from "@@/ui/data/consoleNoise";

import { test } from "@@/ui/fixtures/fixture";

test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] });

test.describe("Vacancy page similar vacancies:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
  });

  test("Open vacancy from search results and check similar vacancies block", async ({ mainPageSteps, searchResultsPageSteps, vacancyPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();

    const vacancyHref = await searchResultsPageSteps.getFirstVacancyTitleHrefOnSite();
    await vacancyPageSteps.navigateToVacancy(vacancyHref);

    await vacancyPageSteps.checkSimilarVacanciesBlockIsVisible();
  });

  test("Open vacancy from search results and check meta title", async ({ mainPageSteps, searchResultsPageSteps, vacancyPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();

    const vacancyHref = await searchResultsPageSteps.getFirstVacancyTitleHrefOnSite();
    await vacancyPageSteps.navigateToVacancy(vacancyHref);

    // У вакансий hh-платформы title всегда начинается со слова "Вакансия ..."
    await vacancyPageSteps.checkPageTitleContains("вакансия");
  });
});
