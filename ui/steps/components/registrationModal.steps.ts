import type { Page } from "@playwright/test";
import { test } from "@playwright/test";

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
}
