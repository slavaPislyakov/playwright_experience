import { Locator, Page } from "@playwright/test";

export class Navigation {
  private readonly navigationElement: Locator;

  constructor(private readonly page: Page) {
    this.navigationElement = this.page.locator(".supernova-overlay__navi");
  }

  getNavigationElement(): Locator {
    return this.navigationElement;
  }
}
