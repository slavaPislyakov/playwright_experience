import { test } from "@@/ui/fixtures/fixture";

test.describe("Search jobs", () => {
  test.beforeEach(async ({ mainPageStep }) => {
    await mainPageStep.navigateToPage();
  });

  test("Search 'Javascript' jobs", async ({ mainPageStep }) => {
    await mainPageStep.typeTextInSearchField("Javascript");
    await mainPageStep.selectFindButton();
    await mainPageStep.registrationModalSteps.selectModalCloseButton();
    await mainPageStep.checkCurrentUrl("Javascript");
  });
});
