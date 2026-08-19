import { test } from "@@/ui/fixtures/fixture";

test.use({ failOnJSError: false });

test.describe("Check jobs in other cities block using snapshot testing:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
  });

  test("Check elements in jobs in other cities block", async ({ mainPageSteps }) => {
    await mainPageSteps.checkBlockOnPage("jobInOtherCitiesBlock");
  });
});
