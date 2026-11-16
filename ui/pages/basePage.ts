import type { Page } from "@playwright/test";

type WaitUntil = "load" | "domcontentloaded";

export class BasePage {
  constructor(readonly page: Page) {}

  async navigateToPage(url: string, waitUntil: WaitUntil = "load"): Promise<void> {
    await this.page.goto(url, { waitUntil });
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }
}
