import type { Locator, Page } from "@playwright/test";

export class CookieBanner {
  readonly acceptButton: Locator;

  constructor(readonly page: Page) {
    this.acceptButton = this.page.locator("[data-qa='cookies-policy-informer-accept']");
  }

  async selectAcceptButton(): Promise<void> {
    await this.acceptButton.click();
  }
}
