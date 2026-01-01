import { Page } from "@playwright/test";

export class BasePage {
  constructor(readonly page: Page) {}

  async navigateToPage(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }
}
