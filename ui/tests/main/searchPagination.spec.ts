import { liveSiteConsoleNoise } from "@@/ui/data/consoleNoise";

import { test } from "@@/ui/fixtures/fixture";

test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] });

// Выдача с большим числом вакансий — у pager есть следующие страницы
const searchQuery = "менеджер";

test.describe("Search pagination:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
    await mainPageSteps.typeTextInSearchField(searchQuery);
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();
  });

  test("Pager next button opens next search results page", async ({ searchResultsPageSteps }) => {
    await searchResultsPageSteps.checkResultsHeaderContains(searchQuery);
    await searchResultsPageSteps.selectNextVacanciesPageButton();
    await searchResultsPageSteps.checkCurrentUrl("page=1");

    // Заголовок второй страницы ждёт рендер выдачи, после чего проверка карточек безопасна
    await searchResultsPageSteps.checkResultsHeaderContains(searchQuery);
    await searchResultsPageSteps.checkVacancyItemsArePresent();
  });
});
