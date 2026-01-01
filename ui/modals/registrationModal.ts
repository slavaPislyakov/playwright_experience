import { Locator, Page } from "@playwright/test";

export class RegistrationModal {
  private readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.closeButton = this.page.locator("[data-qa='bloko-modal-close']");
  }

  async selectCloseButton(): Promise<void> {
    await this.closeButton.click();
  }
}
