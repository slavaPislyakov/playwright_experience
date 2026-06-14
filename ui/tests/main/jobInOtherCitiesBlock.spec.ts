import { test } from "@@/ui/fixtures/fixture";

test.use({ failOnJSError: false });

test.describe("Check header block using snapshot testing:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
  });

  test("Check elements in header block", async ({ mainPageSteps }) => {
    await mainPageSteps.checkBlockOnPage("navigationBlock");
  });
});
