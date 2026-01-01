import { Locator, Page } from "@playwright/test";

import { BasePage } from "@@/ui/pages/basePage";

export class MainPage extends BasePage {
  private readonly mainPageAnonymousHeader: Locator;
  private readonly searchField: Locator;
  private readonly findButton: Locator;
  private readonly blocks: { jobInAnotherCities: Locator };

  constructor(page: Page) {
    super(page);

    this.mainPageAnonymousHeader = this.page.locator("[data-qa='main-page-anonymous-header']");
    this.searchField = this.page.locator("[data-hh-tab-id='searchVacancy'] [data-qa='search-input']");
    this.findButton = this.page.locator("[data-qa='search-button']");
    this.blocks = {
      jobInAnotherCities: this.page.locator(".work-in-other-cities"),
    };

    // TODO: автометически заменять ковычки на другие в стилистике посикать в ии
  }

  async getMainPageAnonymousHeaderText(): Promise<string> {
    return (await this.mainPageAnonymousHeader.innerText()).replace(/(&nbsp;|\s+)/g, " ");
  }

  async typeTextInSearchField(text: string): Promise<void> {
    await this.searchField.fill(text);
  }

  async selectFindButton(): Promise<void> {
    await this.findButton.click();
  }

  async getJobInAnotherCitiesBlock(blockName: keyof typeof this.blocks): Promise<Locator> {
    return this.blocks[blockName];
  }

}
