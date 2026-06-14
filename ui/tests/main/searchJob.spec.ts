import { test } from "@@/ui/fixtures/fixture";

test.describe("Search jobs and check error in browser console: expected failed", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
  });

  test("Search 'Javascript' jobs", async ({ mainPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();
    await mainPageSteps.checkCurrentUrl("Javascript");
  });
});
