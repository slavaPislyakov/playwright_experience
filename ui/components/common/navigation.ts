import type { Locator, Page } from "@playwright/test";

export class Navigation {
  readonly navigationElement: Locator;

  constructor(readonly page: Page) {
    this.navigationElement = this.page.locator("[data-qa='supernova-navi-dashboard']");
  }

  getNavigationElement(): Locator {
    return this.navigationElement;
  }
}
