import type { Locator, Page } from "@playwright/test";

export class Navigation {
  readonly navigationElement: Locator;

  constructor(readonly page: Page) {
    this.navigationElement = this.page.locator(".supernova-overlay__navi");
  }

  getNavigationElement(): Locator {
    return this.navigationElement;
  }
}
