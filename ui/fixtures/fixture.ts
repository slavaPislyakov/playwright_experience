import type { Page } from "@playwright/test";
import { test as base } from "@playwright/test";

import { MainPageSteps } from "@@/ui/steps/pages/mainPage.steps";
import { SearchResultsPageSteps } from "@@/ui/steps/pages/searchResultsPage.steps";
import { VacancyPageSteps } from "@@/ui/steps/pages/vacancyPage.steps";

type TFixtures = {
  failOnJSError: boolean;
  jsErrorAllowlist: readonly RegExp[];
  pageWithMonitoring: Page;
  page: Page;
  mainPageSteps: MainPageSteps;
  searchResultsPageSteps: SearchResultsPageSteps;
  vacancyPageSteps: VacancyPageSteps;
};

type ErrorRequest = {
  status: number;
  url: string;
};

export const test = base.extend<TFixtures >({
  failOnJSError: [true, { option: true }],
  jsErrorAllowlist: [[], { option: true }],
  pageWithMonitoring: [async ({ page }, use, testInfo): Promise<void> => {
    const failedRequests: ErrorRequest[] = [];

    // Слушатель `response`, а не page.requests(): у того буфер — 100 последних запросов, а rabota.by
    // делает ~90–100 запросов за тест (замер 2026-11-12) — ранние ответы ≥ 400 вытеснялись бы.
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

      throw new Error(`HTTP responses with status >= 400 detected (${failedRequests.length}). See "failed-requests.json" attachment for details`);

    }
  },
  { auto: true }],

  page: async({ page, failOnJSError, jsErrorAllowlist }, use, testInfo) => {
    await use(page);

    const isAllowedError = (message: string): boolean =>
      jsErrorAllowlist.some((pattern) => pattern.test(message));

    // pageErrors()/consoleMessages() отдают до 200 последних записей за жизнь страницы;
    // страница создаётся на каждый тест, поэтому буфер содержит только события этого теста.
    const uncaughtErrors: string[] = (await page.pageErrors())
      .map((error) => error.message);

    const consoleErrors: string[] = (await page.consoleMessages())
      .filter((message) => message.type() === "error")
      .map((message) => message.text());

    const errors: string[] = [...uncaughtErrors, ...consoleErrors];

    const failedErrors = errors.filter((message) => !isAllowedError(message));
    const allowedErrors = errors.filter(isAllowedError);

    if(allowedErrors.length > 0) {
      await testInfo.attach("allowed-console-errors.json", {
        body: JSON.stringify(allowedErrors, null, 2),
        contentType: "application/json",
      });
    }

    if(failOnJSError && failedErrors.length > 0){
      await testInfo.attach("failOnConsole.json", {
        body: JSON.stringify(failedErrors, null, 2),
        contentType: "application/json",
      });

      throw new Error(`Browser console errors detected (${failedErrors.length}). See "failOnConsole.json" attachment for details`);
    }
  },

  mainPageSteps: async ({ page }, use) => {
    await use(new MainPageSteps(page));
  },

  searchResultsPageSteps: async ({ page }, use) => {
    await use(new SearchResultsPageSteps(page));
  },

  vacancyPageSteps: async ({ page }, use) => {
    await use(new VacancyPageSteps(page));
  },
});

export { expect } from "@playwright/test";
