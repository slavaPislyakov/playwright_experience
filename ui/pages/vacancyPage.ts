import type { Locator, Page } from "@playwright/test";

import { BasePage } from "@@/ui/pages/basePage";

export class VacancyPage extends BasePage {
  readonly vacancyTitle: Locator;
  readonly vacancyCompanyName: Locator;
  readonly vacancyDescription: Locator;
  readonly vacancyExperience: Locator;
  readonly vacancySkills: Locator;

  constructor(page: Page) {
    super(page);

    this.vacancyTitle = this.page.locator("[data-qa='vacancy-title']");
    this.vacancyCompanyName = this.page.locator("[data-qa='vacancy-company-name']");
    this.vacancyDescription = this.page.locator("[data-qa='vacancy-description']");
    this.vacancyExperience = this.page.locator("[data-qa='vacancy-experience']");
    this.vacancySkills = this.page.locator("[data-qa='skills-element']");
  }

  async getVacancyDescriptionText(): Promise<string> {
    return this.vacancyDescription.innerText();
  }

  async getVacancySkillsCount(): Promise<number> {
    return this.vacancySkills.count();
  }
}
