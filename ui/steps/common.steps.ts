import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { NavigationSteps } from "@@/ui/steps/components/navigation.steps";

import { BasePage } from "@@/ui/pages/basePage";

import { CookieBannerSteps } from "./components/cookieBanner.steps";
import { RegistrationModalSteps } from "./components/registrationModal.steps";

export abstract class CommonSteps {
  abstract readonly url: string;

  readonly basePage: BasePage;
  readonly navigationSteps: NavigationSteps;
  readonly registrationModalSteps: RegistrationModalSteps;
  readonly cookieBannerSteps: CookieBannerSteps;

  constructor(readonly page: Page) {
    this.basePage = new BasePage(this.page);
    this.navigationSteps = new NavigationSteps(this.page);
    this.registrationModalSteps = new RegistrationModalSteps(this.page);
    this.cookieBannerSteps = new CookieBannerSteps(this.page);
  }

  async navigateToPage(): Promise<void> {
    await test.step(`Navigate to ${this.url} page`, async () => {
      await this.basePage.navigateToPage(this.url);
    });
  }

  async checkCurrentUrl(url: string): Promise<void> {
    await test.step(`Check url contains value ${url}`, async () => {

      await expect(this.page).toHaveURL(new RegExp(url));
    }, { params: { url } });
  }
}
