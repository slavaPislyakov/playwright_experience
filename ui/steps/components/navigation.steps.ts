import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { Navigation } from "@@/ui/components/common/navigation";

export class NavigationSteps {
  readonly navigation: Navigation;

  constructor(readonly page: Page) {
    this.navigation = new Navigation(this.page);
  }

  async checkNavigationElementIsVisible(): Promise<void> {
    await test.step("Check header element is visible", async () => {
      await expect(this.navigation.getNavigationElement()).toBeVisible();
    });
  }
}
