# UI: Page Objects и Component Objects

В `ui/pages/` и `ui/components/` живут только селекторы и простые методы. Никаких ассертов, `expect` и `test.step` — это территория степов ([steps.md](steps.md)).

## Page Object — `ui/pages/<страница>.ts`

Наследует `BasePage` (навигация `navigateToPage(url)`, `reload()`). Локаторы объявляются `readonly`-полями **без инициализатора** и присваиваются только в теле конструктора. Field-initializer вида `readonly x = this.page.getByRole(...)` запрещён: Playwright ≥ 1.65 учитывает `useDefineForClassFields` из tsconfig (в проекте `target: ESNext` → define-семантика), инициализаторы выполняются до присвоения `this.page` и падают в рантайме с `TypeError` — линт этого не ловит. Методы — простые: `get*` (прочитать текст/элемент), `select*` (клик), `typeTextIn*` (заполнить), `wait*` (дождаться). Нормализация текста (`replace(/(&nbsp;|\s+)/g, " ")`) — в PO, чтобы степ получал чистую строку.

```typescript
export class MainPage extends BasePage {
  readonly mainPageAnonymousHeader: Locator;
  readonly searchField: Locator;

  constructor(page: Page) {
    super(page);

    this.mainPageAnonymousHeader = this.page.locator("[data-qa='main-page-anonymous-header']");
    this.searchField = this.page.locator("[data-hh-tab-id='searchVacancy'] [data-qa='search-input']");
  }

  async getMainPageAnonymousHeaderText(): Promise<string> {
    return (await this.mainPageAnonymousHeader.innerText()).replace(/(&nbsp;|\s+)/g, " ");
  }

  async typeTextInSearchField(text: string): Promise<void> {
    await this.searchField.fill(text);
  }
}
```

## Приоритет локаторов

1. `[data-qa='...']` — главный способ (стиль кавычек: строка в двойных кавычках, значение атрибута в одинарных).
2. `getByRole` / `getByText` — для семантических элементов (заголовки, ссылки).
3. CSS-по другим стабильным атрибутам.
4. XPath — последний резорт, только для сложной навигации по DOM (пример — `xpath=ancestor::*[...]` у блока городов; известно, что хрупко).

## Контентные блоки — `BlockName` / `PageBlocks`

Группы локаторов блоков собираются в поле `blocks: PageBlocks` с типом-ключом `BlockName`; оба типа экспортируются из PO и переиспользуются в степах и снапшотах:

```typescript
export type BlockName = "jobInOtherCitiesBlock";

export interface PageBlocks {
  jobInOtherCitiesBlock: Locator;
}
```

Проверка блока — aria-снапшотом, данные в `ui/data/snapshots/blocks.ts`: [snapshots.md](snapshots.md).

## Component Object — `ui/components/...`

Переиспользуемый блок UI (навигация, модалка): класс с локаторами и простыми методами, без степов и ассертов. Инстанцируется внутри соответствующего Steps, а не в спеке:

```typescript
export class Navigation {
  readonly navigationElement: Locator;

  constructor(readonly page: Page) {
    this.navigationElement = this.page.locator("[data-qa='supernova-navi-dashboard']");
  }

  getNavigationElement(): Locator {
    return this.navigationElement;
  }
}
```

Куда кладутся степы для компонента (общие/страничные/PO напрямую) — правила в [steps.md](steps.md).
