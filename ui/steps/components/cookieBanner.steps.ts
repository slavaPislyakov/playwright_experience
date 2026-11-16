import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { CookieBanner } from "@@/ui/components/common/cookieBanner";

export class CookieBannerSteps {
  readonly cookieBanner: CookieBanner;

  constructor(readonly page: Page) {
    this.cookieBanner = new CookieBanner(this.page);
  }

  async acceptCookiesPolicyIfVisible(): Promise<void> {
    await test.step("Accept cookies policy banner if visible", async () => {
      // Баннер опционален: на части визитов его нет, поэтому клик условный — это не забытый assert
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (await this.cookieBanner.acceptButton.isVisible()) {
        await this.cookieBanner.selectAcceptButton();
      }
    });
  }

  async acceptCookiesPolicy(): Promise<void> {
    await test.step("Accept cookies policy banner", async () => {
      await this.cookieBanner.selectAcceptButton();
    });
  }

  async checkCookiePolicyBannerIsVisible(): Promise<void> {
    await test.step("Check cookies policy banner is visible", async () => {
      await expect(this.cookieBanner.acceptButton).toBeVisible();
    });
  }

  async checkCookiePolicyBannerIsHidden(): Promise<void> {
    await test.step("Check cookies policy banner is hidden", async () => {
      await expect(this.cookieBanner.acceptButton).toBeHidden();
    });
  }
}
