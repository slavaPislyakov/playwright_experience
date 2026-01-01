import { expect, Page } from "@playwright/test";

import { test } from "@@/ui/fixtures/fixture";

import { CommonSteps } from "@@/ui/steps/pages/common.steps";

import { MainPage } from "@@/ui/pages/mainPage";

import { blocks } from "@@/ui/data/snapshots/blocks";

export class MainPageSteps extends CommonSteps {
  private readonly mainPage: MainPage;

  readonly url: string;

  constructor(page: Page) {
    super(page);
    this.mainPage = new MainPage(this.page);

    this.url = "/";
  }

  async checkAnonymousHeaderText(text: string): Promise<void> {
    await test.step(`Check anonymous header should be equal to ${text}`, async () => {
      const elementText = await this.mainPage.getMainPageAnonymousHeaderText();

      expect(elementText).toStrictEqual(text);
    });
  }

  async typeTextInSearchField(text: string): Promise<void> {
    await test.step(`Type ${text} in search field`, async () => {
      await this.mainPage.typeTextInSearchField(text);
    });
  }

  async selectFindButton(): Promise<void> {
    await test.step("Select 'find' button", async () => {
      await this.mainPage.selectFindButton();
    });
  }

  async checkBlockOnPage(blockName: keyof typeof blocks): Promise<void> {
    await test.step(`Check block ${blockName} using snapshots`, async () => {
      const block = await this.mainPage.getJobInAnotherCitiesBlock(blockName);

      await expect(block).toMatchAriaSnapshot(blocks[blockName]);
    });
  }
}
