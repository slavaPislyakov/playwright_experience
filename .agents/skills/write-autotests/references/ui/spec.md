# UI: анатомия спека

Файл: `ui/tests/<страница>/<фича>.spec.ts` (camelCase, по фиче). Спек минимален: импорт `test` из `@@/ui/fixtures/fixture`, при необходимости `test.use(...)`, describe + `beforeEach` с навигацией, тело — только степы. В спеке нет локаторов, `expect` и `page.*`.

## Работающий пример

```typescript
import { test } from "@@/ui/fixtures/fixture";

test.describe("Main page:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
  });

  test("Navigate to main page test", async ({ mainPageSteps }) => {
    await mainPageSteps.checkAnonymousHeaderText("Поиск работы в Минске");
    await mainPageSteps.navigationSteps.checkNavigationElementIsVisible();
  });
});
```

Со сценарием и allowlist (шум глушится на уровне файла — [fixtures.md](fixtures.md)):

```typescript
import { test } from "@@/ui/fixtures/fixture";

// Шум фингерпринт-скриптов сайта, а не ошибка самого сайта
const extensionProbeError: RegExp = /Fetch API cannot load chrome-extension:/;

test.use({ jsErrorAllowlist: [extensionProbeError] });

test.describe("Search jobs and check browser console", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
  });

  test("Search 'Javascript' jobs", async ({ mainPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();
    await mainPageSteps.checkCurrentUrl("Javascript");
  });
});
```

## Именование

- describe — `"Main page:"` (страница) или `"Search jobs and check browser console"` (сценарий).
- Тест — короткая суть: `"Search 'Javascript' jobs"`, `"Check elements in jobs in other cities block"`.
- Названия и шаги — на английском; ожидаемые тексты локализации — как на сайте (`"Поиск работы в Минске"`).

## Тестовые данные

Тексты запросов и ожидаемые заголовки — константы спека; переиспользуемые снапшоты блоков — `ui/data/snapshots/` ([snapshots.md](snapshots.md)).

## Чек-лист перед сдачей

- [ ] В спеке нет локаторов, `expect` и `page.*` — только степы
- [ ] Новые `check*`-степы добавлены в `assertFunctionPatterns`
- [ ] JS-шум заглушен allowlist'ом с комментарием, а не общим выключением
- [ ] `npm run typecheck && npm run lint && npx playwright test <файл> --project=ui` зелёные
