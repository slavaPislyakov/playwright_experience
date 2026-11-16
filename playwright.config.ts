import type { ReporterDescription } from "@playwright/test";
import { defineConfig, devices } from "@playwright/test";

import { initEnv, optionalEnv } from "./api/utils/envUtils";

initEnv();

const isCI = !!process.env["CI"];

/* (1.65) На CI HTML-отчёт только с неожиданными исходами (полный список — в Allure),
   а в логи docker run идёт отдельный failures-репортер: падения по мере появления + сводка. */
const reporters: ReporterDescription[] = [
  ["html",
    {
      outputFolder: "playwright-report",
      open: "never",
      title: "playwright_experience — API/UI tests",
      ...(isCI ? { onlyFailures: true } : {}),
    }],
  ["allure-playwright", { outputFolder: "allure-results" }],
];

if (isCI) {
  reporters.push(["failures"]);
}

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * Playwright evaluates the whole `projects[]` array eagerly at config-load time,
 * even when only a single project is selected via `--project=...`. Using
 * `requireEnv` here would force every env var of every project to be present
 * for any single-project run. Instead we read env vars softly here and let each
 * project fail on its own at usage time (BaseApiClient/headerUtils already throw
 * a clear error when a required value turns out to be missing at runtime).
 */
export default defineConfig({
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* (1.51) На CI — git commit/diff в metadata HTML-отчёта: видно, на каком коммите гонялось */
  ...(isCI ? { captureGitInfo: { commit: true, diff: true } } : {}),
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* (1.62) Ретраи — в конце прогона, по одному, одним воркером: флаки-тесты (живой сайт)
     не мешают остальным. Значимо на CI, где retries > 0; локально retries = 0. */
  retryStrategy: "isolated",
  /* Opt out of parallel tests on CI. Omitted locally so Playwright uses its default. */
  ...(isCI ? { workers: 1 } : {}),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: reporters,

  /* Явная фиксация дефолта web-first ассертов; точечно поднимается через expect.configure(...) */
  expect: { timeout: 5_000 },

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* (1.59) Trace пишется на каждый ран теста и сохраняется, если упала хотя бы одна попытка:
       у флаки-теста в артефактах остаются и упавший, и прошедший трейсы — можно сравнивать. */
    trace: "retain-on-failure-and-retries",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "noOAuth",
      use: {
        baseURL: optionalEnv("BASE_URL_NO_AUTH"),
      },
      testDir: "./api/tests/noAuth",
    },
    {
      name: "ui",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: optionalEnv("BASE_URL_UI"),
      },
      testDir: "./ui/tests",
      // Тесты внутри файла — строго последовательно: живой сайт, риск троттлинга
      // и межтестовых помех при параллельном заходе из одного контекста
      fullyParallel: false,
    },
  ],
});
