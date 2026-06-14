import { test } from "@@/ui/fixtures/fixture";

test.use({ failOnJSError: false });

test.describe("Main page:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
  });

  test("Navigate to main page test", async ({ mainPageSteps }) => {
    await mainPageSteps.checkAnonymousHeaderText("Поиск работы в Минске");
    await mainPageSteps.navigationSteps.checkNavigationElementIsVisible();
  });
});
