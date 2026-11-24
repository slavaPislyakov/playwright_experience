import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { CommonSteps } from "@@/ui/steps/common.steps";

import { VacancyPage } from "@@/ui/pages/vacancyPage";

export class VacancyPageSteps extends CommonSteps {
  readonly vacancyPage: VacancyPage;
  readonly url: string;

  constructor(page: Page) {
    super(page);
    this.vacancyPage = new VacancyPage(this.page);
    this.url = "/vacancy";
  }

  async navigateToVacancy(href: string): Promise<void> {
    await test.step(`Navigate to vacancy page by href ${href}`, async () => {
      // Страницы вакансий hh обвешаны сторонними скриптами: событие "load" может
      // не наступить в пределах таймаута теста, поэтому ждём только "domcontentloaded"
      // (локаторы доматят появление элементов сами)
      await this.basePage.navigateToPage(href, "domcontentloaded");
    }, { params: { href } });
  }

  async checkVacancyTitleIsVisible(): Promise<void> {
    await test.step("Check vacancy title is visible", async () => {
      await expect(this.vacancyPage.vacancyTitle).toBeVisible();
    });
  }

  async checkVacancyCompanyNameIsVisible(): Promise<void> {
    await test.step("Check vacancy company name is visible", async () => {
      await expect(this.vacancyPage.vacancyCompanyName).toBeVisible();
    });
  }

  async checkVacancyDescriptionIsNotEmpty(): Promise<void> {
    await test.step("Check vacancy description is not empty", async () => {
      const description = await this.vacancyPage.getVacancyDescriptionText();

      expect(description.trim().length).toBeGreaterThan(0);
    });
  }

  async checkVacancyContentBlocksAreVisible(): Promise<void> {
    await test.step("Check vacancy experience and skills blocks are visible if present", async () => {
      // Опыт работы и навыки — опциональные данные вакансий hh: часть вакансий публикуется
      // без этих блоков, а первая вакансия выдачи ротируется, поэтому блок проверяем
      // только при его фактическом наличии на странице
      const experienceCount = await this.vacancyPage.vacancyExperience.count();

      // Условная проверка осознанная: блок опционален, это не забытый assert
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (experienceCount > 0) {
        await expect(this.vacancyPage.vacancyExperience).toBeVisible();
      }

      const skillsCount = await this.vacancyPage.getVacancySkillsCount();

      // Условная проверка осознанная: блок опционален, это не забытый assert
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (skillsCount > 0) {
        await expect(this.vacancyPage.vacancySkills.first()).toBeVisible();
      }
    });
  }

  async checkSimilarVacanciesBlockIsVisible(): Promise<void> {
    await test.step("Check similar vacancies block is visible", async () => {
      // Блок рендерится только при скролле, поэтому проверке видимости предшествует прокрутка
      await this.vacancyPage.scrollToSimilarVacanciesBlock();
      await expect(this.vacancyPage.similarVacanciesBlock).toBeVisible();
    });
  }

  async checkPageTitleContains(expected: string): Promise<void> {
    await test.step(`Check page title contains value ${expected}`, async () => {
      await expect(this.page).toHaveTitle(new RegExp(expected, "i"));
    }, { params: { expected } });
  }
}
