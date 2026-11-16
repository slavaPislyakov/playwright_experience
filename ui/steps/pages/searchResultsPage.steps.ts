import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { searchResultBlocks } from "@@/ui/data/snapshots/searchResultBlocks";

import { CommonSteps } from "@@/ui/steps/common.steps";

import { SearchResultsPage, type SearchResultBlockName } from "@@/ui/pages/searchResultsPage";

export class SearchResultsPageSteps extends CommonSteps {
  readonly searchResultsPage: SearchResultsPage;
  readonly url: string;

  constructor(page: Page) {
    super(page);
    this.searchResultsPage = new SearchResultsPage(this.page);
    this.url = "/search/vacancy";
  }

  async checkResultsHeaderContains(text: string): Promise<void> {
    await test.step(`Check search results header contains "${text}"`, async () => {
      const headerText = await this.searchResultsPage.getSearchResultsHeaderText();

      expect(headerText).toContain(text);
    }, { params: { text } });
  }

  async checkVacancyItemsArePresent(): Promise<void> {
    await test.step("Check vacancy items with title links are present in search results", async () => {
      const itemsCount = await this.searchResultsPage.getVacancyItemsCount();
      const titlesCount = await this.searchResultsPage.getVacancyItemTitlesCount();

      // У части карточек (например, брендированных) больше одной ссылки-заголовка,
      // поэтому проверяем инвариант "ссылок не меньше, чем карточек"
      expect(itemsCount).toBeGreaterThan(0);
      expect(titlesCount).toBeGreaterThanOrEqual(itemsCount);
    });
  }

  async checkEmptySearchBlockIsVisible(): Promise<void> {
    await test.step("Check empty search results block is visible", async () => {
      await expect(this.searchResultsPage.getBlock("emptySearchBlock")).toBeVisible();
    });
  }

  async checkBlockOnPage(blockName: SearchResultBlockName): Promise<void> {
    await test.step(`Check block ${blockName} using snapshots`, async () => {
      const block = this.searchResultsPage.getBlock(blockName);

      await expect(block).toMatchAriaSnapshot(searchResultBlocks[blockName]);
    }, { params: { blockName } });
  }

  async getFirstVacancyTitleHref(): Promise<string> {
    return test.step("Get first vacancy title href from search results", async () => {
      // Ссылки вакансий открываются в новой вкладке (target="_blank"), поэтому
      // переход к карточке делаем по href из выдачи, а не кликом.
      // Здесь нужно ЗНАЧЕНИЕ href для перехода, а не assertion —
      // web-first assertion (prefer-web-first-assertions) семантически не подходит
      const href = await this.searchResultsPage.vacancyItemTitles.first().getAttribute("href");

      // eslint-disable-next-line playwright/prefer-web-first-assertions
      expect(href).toBeTruthy();

      return href ?? "";
    });
  }
}
