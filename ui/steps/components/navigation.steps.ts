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

  async checkNavigationMenuItemsAreVisible(): Promise<void> {
    await test.step("Check navigation menu items are visible", async () => {
      const menuItems = this.navigation.getNavigationMenuItems();
      const itemsCount = await menuItems.count();

      expect(itemsCount).toBeGreaterThan(0);
      await expect(menuItems.first()).toBeVisible();
    });
  }

  async selectEmployerMode(): Promise<void> {
    await test.step("Select employer mode in user type switcher", async () => {
      // Радио-инпут перекрыт визуальным лейблом magritte — кликаем по label
      await this.navigation.employerModeLabel.click();
    });
  }
}
