import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { RegistrationModal } from "@@/ui/components/modals/registrationModal";

export class RegistrationModalSteps {
  readonly registrationModal: RegistrationModal;

  constructor(readonly page: Page) {
    this.registrationModal = new RegistrationModal(this.page);
  }

  async selectModalCloseButton(): Promise<void> {
    await test.step("Select modal close button", async () => {
      await this.registrationModal.selectCloseButton();
    });
  }

  async checkRegistrationModalIsVisible(): Promise<void> {
    await test.step("Check registration modal is visible", async () => {
      await expect(this.registrationModal.modalContainer).toBeVisible();
    });
  }

  async checkRegistrationModalTitleIsVisible(): Promise<void> {
    await test.step("Check registration modal title is visible", async () => {
      await expect(this.registrationModal.title).toBeVisible();
    });
  }

  async checkRegistrationModalIsHidden(): Promise<void> {
    await test.step("Check registration modal is hidden", async () => {
      await expect(this.registrationModal.modalContainer).toBeHidden();
    });
  }
}
