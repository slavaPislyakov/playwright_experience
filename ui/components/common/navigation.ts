import type { Locator, Page } from "@playwright/test";

export class Navigation {
  readonly navigationElement: Locator;
  readonly userTypeSegmented: Locator;
  readonly employerModeLabel: Locator;

  constructor(readonly page: Page) {
    this.navigationElement = this.page.locator("[data-qa='supernova-navi-dashboard']");
    // Текст сегментов содержит &nbsp;, поэтому ищем label по data-qa вложенного радио, а не по тексту
    this.userTypeSegmented = this.page.locator("[data-qa='userTypeSegmented']");
    this.employerModeLabel = this.userTypeSegmented.locator("label").filter({
      has: this.page.locator("[data-qa='userTypeSegmentedEmployer']"),
    });
  }

  getNavigationElement(): Locator {
    return this.navigationElement;
  }
}
