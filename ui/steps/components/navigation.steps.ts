import test, { expect, Page } from "@playwright/test";

import { Navigation } from "@@/ui/components/navigation";

export class NavigationSteps {
  private readonly navigation: Navigation;

  constructor(private readonly page: Page) {
    this.navigation = new Navigation(this.page);
  }

  async checkNavigationElementIsVisible(): Promise<void> {
    await test.step("Check header element is visible", async () => {
      await expect(this.navigation.getNavigationElement()).toBeVisible();
    });
  }
}
