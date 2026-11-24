import { liveSiteConsoleNoise } from "@@/ui/data/consoleNoise";

import { test } from "@@/ui/fixtures/fixture";

test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] });

test.describe("Registration modal:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
    // Модалка не появляется при простом анонимном заходе (проверено на живом сайте):
    // она открывается после перехода к результатам поиска, поэтому триггерим её тем же
    // потоком, что и остальные спеки. Закрывать модалку в beforeEach нельзя — её тестируем.
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
  });

  test("Registration modal is visible with title", async ({ mainPageSteps }) => {
    await mainPageSteps.registrationModalSteps.checkRegistrationModalIsVisible();
    await mainPageSteps.registrationModalSteps.checkRegistrationModalTitleIsVisible();
  });

  test("Close registration modal hides it", async ({ mainPageSteps }) => {
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();
    await mainPageSteps.registrationModalSteps.checkRegistrationModalIsHidden();
  });
});
