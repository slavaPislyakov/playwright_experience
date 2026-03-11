/* eslint-disable no-console */
import test from "playwright/test";

test.describe("Timezone", () => {
  // eslint-disable-next-line no-empty-pattern
  test.only("Check timezone", async ({ }) => {
    const now = new Date();

    console.log("now===", now.toString());
    console.log("Resolved TZ:", Intl.DateTimeFormat().resolvedOptions().timeZone);  // Europe/Moscow или Minsk
    console.log("Offset minutes:", new Date().getTimezoneOffset());  // -180 = +3
  });
});
