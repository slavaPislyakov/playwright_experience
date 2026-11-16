# UI: Step Objects

Степы — `ui/steps/` — бизнес-шаги теста: обёртка `test.step` + вызов PO/компонента ([pages.md](pages.md)) + `expect` для проверок. Спек вызывает только степы.

## Иерархия «что куда класть» (канон из `ui/Readme.md`)

- Верхняя иерархия — тесты; из тестов вызываются **степы страницы**.
- Степы страницы наследуются от `CommonSteps`.
- Компонент есть на **всех** страницах → степы компонента в `CommonSteps` (пример: `navigationSteps`, `registrationModalSteps`).
- Компонент на **2+ страницах, но не на всех** → степы компонента точечно в степах нужных страниц.
- Компонент **только на этой странице** → степы страницы работают напрямую с PO страницы.

## Степы страницы — `ui/steps/pages/<страница>.steps.ts`

Наследует `CommonSteps`, объявляет `readonly url: string` (путь относительно `baseURL`, например `"/"`), инстанцирует свой PO. `CommonSteps` уже даёт `navigateToPage()` и `checkCurrentUrl(url)` (через `toHaveURL(new RegExp(url))`):

```typescript
export class MainPageSteps extends CommonSteps {
  readonly mainPage: MainPage;
  readonly url: string;

  constructor(page: Page) {
    super(page);
    this.mainPage = new MainPage(this.page);
    this.url = "/";
  }

  async checkAnonymousHeaderText(text: string): Promise<void> {
    await test.step(`Check anonymous header should be equal to ${text}`, async () => {
      const elementText = await this.mainPage.getMainPageAnonymousHeaderText();

      expect(elementText).toStrictEqual(text);
    }, { params: { text } });
  }

  async typeTextInSearchField(text: string): Promise<void> {
    await test.step(`Type ${text} in search field`, async () => {
      await this.mainPage.typeTextInSearchField(text);
    }, { params: { text } });
  }
}
```

## Степы компонента — `ui/steps/components/<компонент>.steps.ts`

Отдельный класс для компонента, который используется несколькими страницами; инстанцируется в `CommonSteps` (если сквозной) или в конкретных страничных степах. Пример — `NavigationSteps`:

```typescript
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
```

## Правила именования

- Методы: `check*` — проверка, `select*` — клик, `typeTextIn*` — ввод, `navigateToPage` — навигация.
- Сообщение `test.step` — что происходит, с подстановкой данных: `Type ${text} in search field`, `Check anonymous header should be equal to ${text}`.
- Новые `check*`-степы добавляй в `eslint.config.mjs` → `playwright/expect-expect` → `assertFunctionPatterns`, иначе линт потребует сырой `expect` в спеке.

## Метаданные шага (1.63)

Шаги со скалярными аргументами (строки, числа, boolean, строковые литералы/enum вроде `BlockName`) передают их в отчёт через options `params` — третий аргумент `test.step`. Ключи `params` — имена аргументов метода. Заголовки шагов не меняются, `subtitle` в UI не используется. Шаги без аргументов — без options-объекта вовсе. Нескалярные аргументы (Locator, Page, RegExp, функция) в `params` не передаются:

```typescript
async typeTextInSearchField(text: string): Promise<void> {
  await test.step(`Type ${text} in search field`, async () => {
    await this.mainPage.typeTextInSearchField(text);
  }, { params: { text } });
}
```

Фикстура для степов новой страницы — [fixtures.md](fixtures.md). Ариа-снапшот-проверка блока — [snapshots.md](snapshots.md).
