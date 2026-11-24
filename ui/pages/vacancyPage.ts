import type { Locator, Page } from "@playwright/test";

import { BasePage } from "@@/ui/pages/basePage";

export class VacancyPage extends BasePage {
  readonly vacancyTitle: Locator;
  readonly vacancyCompanyName: Locator;
  readonly vacancyDescription: Locator;
  readonly vacancyExperience: Locator;
  readonly vacancySkills: Locator;
  readonly similarVacanciesBlock: Locator;

  constructor(page: Page) {
    super(page);

    this.vacancyTitle = this.page.locator("[data-qa='vacancy-title']");
    this.vacancyCompanyName = this.page.locator("[data-qa='vacancy-company-name']");
    this.vacancyDescription = this.page.locator("[data-qa='vacancy-description']");
    this.vacancyExperience = this.page.locator("[data-qa='vacancy-experience']");
    this.vacancySkills = this.page.locator("[data-qa='skills-element']");
    this.similarVacanciesBlock = this.page.locator("[data-qa='vacancy-view-vacancies-from-search']");
  }

  async scrollToSimilarVacanciesBlock(): Promise<void> {
    // Блок похожих вакансий — lazy-секция hh (vacancy-section_lazy): монтируется в DOM
    // только при попадании в зону наблюдения. Быстрый jump к низу страницы монтирует её
    // и при этом не будит ленивые сторонние виджеты ниже по странице: медленный
    // прогрессивный проскролл провоцирует загрузку яндекс-виджетов (403/net-шум),
    // который падает в мониторинге ошибок страницы
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.similarVacanciesBlock.scrollIntoViewIfNeeded();
  }

  async getVacancyDescriptionText(): Promise<string> {
    return this.vacancyDescription.innerText();
  }

  async getVacancySkillsCount(): Promise<number> {
    return this.vacancySkills.count();
  }
}
