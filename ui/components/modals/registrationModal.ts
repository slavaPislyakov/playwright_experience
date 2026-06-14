import type { Locator, Page } from "@playwright/test";

export class RegistrationModal {
  readonly closeButton: Locator;

  constructor(readonly page: Page) {
    this.closeButton = this.page.locator('[data-qa="signup-modal-close"]');
  }

  async selectCloseButton(): Promise<void> {
    await this.closeButton.click();
  }
}
