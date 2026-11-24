import type { Locator, Page } from "@playwright/test";

export class RegistrationModal {
  readonly modalContainer: Locator;
  readonly title: Locator;
  readonly closeButton: Locator;

  constructor(readonly page: Page) {
    // data-qa на корне модалки в живом DOM нет: устойчивейший локатель — роль dialog (второй приоритет pages.md)
    this.modalContainer = this.page.getByRole("dialog");
    this.title = this.modalContainer.locator("[data-qa='title']");
    this.closeButton = this.page.locator('[data-qa="signup-modal-close"]');
  }

  async selectCloseButton(): Promise<void> {
    await this.closeButton.click();
  }
}
