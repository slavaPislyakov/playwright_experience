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
  readonly vacancyItemTitlesOnSite: Locator;
  readonly searchFiltersPanel: Locator;
  readonly searchFiltersChips: Locator;
  readonly searchFiltersButton: Locator;
  readonly nextResultsButton: Locator;
  readonly blocks: SearchResultPageBlocks;

  constructor(page: Page) {
    super(page);

    this.searchResultsHeader = this.page.locator("[data-qa='vacancies-search-header']");
    this.vacancyItems = this.page.locator("[data-qa='vacancy-serp__vacancy']");
    this.vacancyItemTitles = this.page.locator("[data-qa='serp-item__title']");
    // Выдача содержит рекламные карточки, ведущие на внешний hh.ru: их страницы вне
    // скоупа тестов rabota.by (другой домен, другой рендер ленивых секций), поэтому
    // для переходов на тестируемый сайт ссылки фильтруются по домену в href
    this.vacancyItemTitlesOnSite = this.page.locator("[data-qa='serp-item__title'][href*='rabota.by']");
    this.searchFiltersPanel = this.page.locator("[data-qa='header-search-filters-container']");
    this.searchFiltersChips = this.page.locator("[data-qa='header-search-chips-container']");
    this.searchFiltersButton = this.page.locator("[data-qa='header-search-filters-button']");
    this.nextResultsButton = this.page.locator("[data-qa='pager-next']");
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

  async selectNextResultsButton(): Promise<void> {
    await this.nextResultsButton.click();
  }

  getBlock(blockName: SearchResultBlockName): Locator {
    return this.blocks[blockName];
  }
}
