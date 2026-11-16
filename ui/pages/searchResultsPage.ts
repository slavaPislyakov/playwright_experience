import type { Locator, Page } from "@playwright/test";

import { BasePage } from "@@/ui/pages/basePage";

export type SearchResultBlockName = "emptySearchBlock";

export interface SearchResultPageBlocks {
  emptySearchBlock: Locator;
}

export class SearchResultsPage extends BasePage {
  readonly searchResultsHeader: Locator;
  readonly vacancyItems: Locator;
  readonly vacancyItemTitles: Locator;
  readonly blocks: SearchResultPageBlocks;

  constructor(page: Page) {
    super(page);

    this.searchResultsHeader = this.page.locator("[data-qa='vacancies-search-header']");
    this.vacancyItems = this.page.locator("[data-qa='vacancy-serp__vacancy']");
    this.vacancyItemTitles = this.page.locator("[data-qa='serp-item__title']");
    this.blocks = {
      emptySearchBlock: this.page.locator("[data-qa='empty-vacancy-search-block']"),
    };
  }

  async getSearchResultsHeaderText(): Promise<string> {
    // hh-платформа использует &nbsp; в заголовках — нормализуем к обычному пробелу (как в MainPage)
    return (await this.searchResultsHeader.innerText()).replace(/(&nbsp;|\s+)/g, " ");
  }

  async getVacancyItemsCount(): Promise<number> {
    return this.vacancyItems.count();
  }

  async getVacancyItemTitlesCount(): Promise<number> {
    return this.vacancyItemTitles.count();
  }

  getBlock(blockName: SearchResultBlockName): Locator {
    return this.blocks[blockName];
  }
}
