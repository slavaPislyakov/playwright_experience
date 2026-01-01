import { ConsoleMessage, Page, test as base } from "@playwright/test";

import { MainPageSteps } from "@@/ui/steps/pages/mainPage.steps";

type TFixtures = {
  failOnJSError: boolean
  pageWithMonitoring: Page;
  page: Page;
  mainPageStep: MainPageSteps;
};

type ErrorRequest = {
  status: number;
  url: string;
};

export const test = base.extend<TFixtures >({
  failOnJSError: [true, { option: true }],
  pageWithMonitoring: [async ({ page }, use, testInfo): Promise<void> => {
    const failedRequests: ErrorRequest[] = [];

    page.on("response", (response) => {
      const url = response.url();
      const status = response.status();

      if(status >= 400) {
        failedRequests.push({
          status,
          url,
        });
      }

    });

    await use(page);

    if(failedRequests.length > 0) {
      await testInfo.attach("failed-requests.json", {
        body: JSON.stringify(failedRequests, null, 2),
        contentType: "application/json",
      });

      throw new Error("Hey there were failed requests");

    }
  },
  { auto: true }],

  page: async({ page, failOnJSError }, use, testInfo) => {
    const errors: Array<Error| string> = [];

    page.on("pageerror", (error) => {
      errors.push(error);
    });

    page.on("console", (msg: ConsoleMessage) => {
      if(msg.type() === "error"){
        errors.push(msg.text());
      }

    });

    await use(page);

    if(failOnJSError && errors.length > 0){
      await testInfo.attach("failOnConsole.json", {
        body: JSON.stringify(errors, null, 2),
        contentType: "application/json",
      });

      throw new Error("Hey there were fails in console");
    }
  },

  mainPageStep: async ({ page }, use) => {
    await use(new MainPageSteps(page));
  },
});

export { expect } from "@playwright/test";
