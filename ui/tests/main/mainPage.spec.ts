import { test } from "@@/ui/fixtures/fixture";

test.describe("Main page:", () => {
  test.beforeEach(async ({ mainPageStep }) => {
    await mainPageStep.navigateToPage();
  });

  test("Navigate to main page test", async ({ mainPageStep }) => {
    await mainPageStep.checkAnonymousHeaderText("Работа найдётся для каждого");
    await mainPageStep.navigationSteps.checkNavigationElementIsVisible();
  });
});
