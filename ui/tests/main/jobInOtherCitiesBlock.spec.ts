import { test } from "@@/ui/fixtures/fixture";

test.use({ failOnJSError: false });

test.describe("Check block 'job in another cities':", () => {
  test.beforeEach(async ({ mainPageStep }) => {
    await mainPageStep.navigateToPage();
  });

  test("Check elements in block 'job in another cities'", async ({ mainPageStep }) => {
    await mainPageStep.checkBlockOnPage("jobInAnotherCities");
  });
});
