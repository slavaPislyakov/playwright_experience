import { test } from "@@/ui/fixtures/fixture";

// Шум фингерпринт-скриптов сайта: попытки загрузить chrome-extension://-ресурсы
// для детекта установленных расширений браузера, а не ошибка самого сайта
const extensionProbeError: RegExp = /Fetch API cannot load chrome-extension:/;

test.use({ jsErrorAllowlist: [extensionProbeError] });

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
