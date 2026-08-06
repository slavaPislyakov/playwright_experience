import { defineConfig, devices } from "@playwright/test";

import { initEnv, optionalEnv } from "./api/utils/envUtils";

initEnv();

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
  forbidOnly: !!process.env["CI"],
  /* Retry on CI only */
  retries: process.env["CI"] ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env["CI"] ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never", title: "My Report" }],
    ["allure-playwright", { outputFolder: "allure-results" }],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "apiOAuth",
      use: {
        baseURL: optionalEnv("BASE_URL_AUTH"),
      },
      testDir: "./api/tests/apiOAuth",
    },
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
    },
  ],
});
