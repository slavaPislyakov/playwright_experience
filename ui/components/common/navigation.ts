import type { Locator, Page } from "@playwright/test";

export class Navigation {
  readonly navigationElement: Locator;
  readonly userTypeSegmented: Locator;
  readonly employerModeLabel: Locator;
  readonly navigationMenuItems: Locator;

  constructor(readonly page: Page) {
    this.navigationElement = this.page.locator("[data-qa='supernova-navi-dashboard']");
    // Текст сегментов содержит &nbsp;, поэтому ищем label по data-qa вложенного радио, а не по тексту
    this.userTypeSegmented = this.page.locator("[data-qa='userTypeSegmented']");
    this.employerModeLabel = this.userTypeSegmented.locator("label").filter({
      has: this.page.locator("[data-qa='userTypeSegmentedEmployer']"),
    });
    // Пункты меню внутри навигации: "Сервисы", "Ещё", "Помощь" — data-qa с живого rabota.by
    this.navigationMenuItems = this.navigationElement.locator("[data-qa='allServices-button'], [data-qa='moreItems-button'], [data-qa='supernova-help-feedback-link']");
  }

  getNavigationElement(): Locator {
    return this.navigationElement;
  }

  getNavigationMenuItems(): Locator {
    return this.navigationMenuItems;
  }
}
