import { test } from "@@/ui/fixtures/fixture";

test.use({ failOnJSError: false });

test.describe("Main page:", () => {
  test.beforeEach(async ({ mainPageStep }) => {
    await mainPageStep.navigateToPage();
  });

  test("Navigate to main page test", async ({ mainPageStep }) => {
    await mainPageStep.checkAnonymousHeaderText("Поиск работы в Минске");
    await mainPageStep.navigationSteps.checkNavigationElementIsVisible();
  });
});
