import type { Locator, Page } from "@playwright/test";

import { BasePage } from "@@/ui/pages/basePage";

export type BlockName = "jobInOtherCitiesBlock";

export interface PageBlocks {
  jobInOtherCitiesBlock: Locator;
}

export class MainPage extends BasePage {
  readonly mainPageAnonymousHeader: Locator;
  readonly searchField: Locator;
  readonly findButton: Locator;
  readonly blocks: PageBlocks;

  constructor(page: Page) {
    super(page);

    this.mainPageAnonymousHeader = this.page.locator("[data-qa='main-page-anonymous-header']");
    this.searchField = this.page.locator("[data-hh-tab-id='searchVacancy'] [data-qa='search-input']");
    this.findButton = this.page.locator("[data-qa='search-button']");
    this.blocks = {
      jobInOtherCitiesBlock: this.page
        .getByRole("heading", { name: "Работа в других городах" })
        .locator("xpath=ancestor::*[.//a[contains(., 'Работа в')]][1]"),
    };
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

  getBlock(blockName: BlockName): Locator {
    return this.blocks[blockName];
  }

}
