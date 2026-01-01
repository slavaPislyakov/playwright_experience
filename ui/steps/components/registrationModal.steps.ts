import test, { Page } from "@playwright/test";

import { RegistrationModal } from "@@/ui/modals/registrationModal";

export class RegistrationModalSteps {
  private readonly registrationModal: RegistrationModal;

  constructor(private readonly page: Page) {
    this.registrationModal = new RegistrationModal(this.page);
  }

  async selectModalCloseButton(): Promise<void> {
    await test.step("Select modal close button", async () => {
      await this.registrationModal.selectCloseButton();
    });
  }
}
