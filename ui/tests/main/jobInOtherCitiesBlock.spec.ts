import { test } from "@@/ui/fixtures/fixture";

test.use({ failOnJSError: false });

test.describe("Check header block using snapshot testing:", () => {
  test.beforeEach(async ({ mainPageStep }) => {
    await mainPageStep.navigateToPage();
  });

  test("Check elements in header block", async ({ mainPageStep }) => {
    await mainPageStep.checkBlockOnPage("navigationBlock");
  });
});
