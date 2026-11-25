---
name: write-autotests
description: Как писать API- и UI-автотесты в этом Playwright-фреймворке строго по существующим конвенциям — клиенты, фикстуры, схемы Zod, Page/Step/Component Objects, стиль кода и проверки качества. Использовать всегда, когда задача касается файлов в api/ или ui/ — добавление или изменение тестов, API-клиентов, схем, фикстур, Page Objects, степов, локаторов. Срабатывать на просьбы вида «добавь тест», «покрой эндпоинт», «напиши проверку для страницы», даже если конвенции явно не упомянуты.
---

# Автотесты по конвенциям этого фреймворка

Правило номер один: **новый код пишется так же, как существующий**. Прежде чем писать тест, найди похожий (`api/tests/`, `ui/tests/`) и повтори его структуру. Этот документ объясняет, что именно повторять и почему. Дополнительные источники истины в репозитории: `README.md` (раздел «Архитектура»), `ui/Readme.md` (правила иерархии UI), `eslint.config.mjs` (стиль).

## Карта проектов Playwright

| Проект | testDir | Сервис | Валидация ответов |
|---|---|---|---|
| `noOAuth` | `api/tests/noAuth` | JSONPlaceholder (публичный) | Zod (`z.strictObject`) |
| `ui` | `ui/tests` | rabota.by (живой сайт, hh-платформа) | `expect` + aria-снапшоты |

Запуск: `npm run test:api:no_oauth` / `test:ui`; один файл — `npx playwright test <путь> --project=<имя>`; отладка UI — `--headed`, `--debug`, `npm run ui:mode`.

## Золотые правила (для API и UI)

1. **Спек тонкий.** Тело теста — только вызовы API-клиента или степов и вызовы ассертов. Сырой `expect` в спеках не используется: ассерты живут в `RequestAssertions` (API) или в `check*`-методах степов (UI).
2. **Всё обёрнуто в `test.step`.** Клиенты оборачивают запросы, степы — действия и проверки, `RequestAssertions` — ассерты. В спеке вручную `test.step` не добавляй — получится вложенный дубль.
3. **`test` импортируется только из фикстур проекта:** API — `@@/api/fixtures/fixtures` (множественное число), UI — `@@/ui/fixtures/fixture` (единственное). Никогда не из `@playwright/test` напрямую в спеке.
4. **Никаких магических чисел и строк.** HTTP-статусы — только enum `HttpStatusCode`; идентификаторы и коды — branded-конструкторы (`AlbumId(1)`).
5. **Схемы строгие.** Zod — `z.strictObject` (лишние поля отклоняются). Слабые `z.object` без причины не появляются.
6. **Типы импортируются через `import type`** (`verbatimModuleSyntax`), у каждой функции явный тип возврата (`explicit-function-return-type`), `await` только у thenable, «висящих» промисов нет.
7. **Двойные кавычки, точки с запятой, отступ 2, trailing commas в многострочных конструкциях, длина строки ≤ 120.** Порядок импортов задаёт `import-x/order` c `pathGroups` под структуру проекта и пустыми строками между ними — не расставляй вручную, после написания запусти `npm run lint:fix`.
8. **Названия тестов, степов и сообщений — на английском** (`Check 'GET /albums' endpoint`, `Select 'find' button`). Комментарии-объяснения «почему» — можно по-русски.
9. **Новые ассерт-методы `check*` регистрируются в `eslint.config.mjs`** → `playwright/expect-expect` → `assertFunctionPatterns`, иначе линт потребует `expect` в спеке.
10. **`test.only`/`test.skip` запрещены** (`playwright/no-focused-test: error`, `no-skipped-test: warn`). Если skip неизбежен — с Playwright 1.65 указывай причину: `test.skip("Not implemented yet")` — она попадает в аннотации теста в отчёте.

## Порядок добавления API-теста

Читай только те справочники, которые относятся к текущему шагу, — не все подряд:

1. Маршрут — `api/data/urls.ts` (функция-билдер с branded-параметром, объект `as const`) → [references/api/urls.md](references/api/urls.md).
2. Типы запроса (для POST/PUT/PATCH) и схемы ответа (`CreateXRequest` / `UpdateXRequest` / `PatchXRequest`; валидатор — Zod) → [references/api/schemas.md](references/api/schemas.md).
3. Метод клиента — в существующий `api/clients/*ApiClient.ts` или новый от `BaseApiClient`; внутри — `test.step` → [references/api/clients.md](references/api/clients.md).
4. Новый клиент регистрируется в `api/fixtures/fixtures.ts` через фабрику `createApiClient`; роль авторизации — `test.use({ role: UserRole.AUTHORIZED })` на уровне describe → [references/api/fixtures.md](references/api/fixtures.md).
5. Спек — `api/tests/noAuth/<ресурс>.spec.ts`: запрос через клиента → `checkStatusCode` → `checkJSONResponseSchemaZod` → [references/api/spec.md](references/api/spec.md) (+ [references/api/assertions.md](references/api/assertions.md) для новых ассертов).
6. Проверка: `npm run typecheck && npm run lint && npx playwright test <файл> --project=<проект>`.

## Порядок добавления UI-теста

1. Локаторы — в Page Object `ui/pages/<страница>.ts` (наследник `BasePage`) или Component Object `ui/components/...` → [references/ui/pages.md](references/ui/pages.md).
2. Где живут степы (компонент на всех страницах → `CommonSteps`; на нескольких → точечно; на одной → напрямую PO) и сами степы `ui/steps/...` → [references/ui/steps.md](references/ui/steps.md).
3. Фикстура степов новой страницы — в `ui/fixtures/fixture.ts`; опции `jsErrorAllowlist` / `failOnJSError` → [references/ui/fixtures.md](references/ui/fixtures.md).
4. Aria-снапшот контентного блока — `BlockName`/`PageBlocks` в PO, текст в `ui/data/snapshots/blocks.ts` → [references/ui/snapshots.md](references/ui/snapshots.md).
5. Спек — `ui/tests/<страница>/<фича>.spec.ts`: `test.beforeEach` с навигацией, тело — только степы → [references/ui/spec.md](references/ui/spec.md).
6. Проверка: `npm run typecheck && npm run lint && npx playwright test <файл> --project=ui`.

## Карта справочников

| Файл | Тема |
|---|---|
| `references/api/urls.md` | Маршруты `URLS` и branded-типы |
| `references/api/schemas.md` | Типы запросов, схемы Zod, strict-валидация |
| `references/api/clients.md` | Клиенты от `BaseApiClient`, паттерн метода |
| `references/api/fixtures.md` | API-фикстуры, фабрика `createApiClient`, роли |
| `references/api/assertions.md` | `RequestAssertions`, расширение, ESLint-регистрация |
| `references/api/spec.md` | Анатомия API-спека, именование, env, чек-лист |
| `references/ui/pages.md` | Page/Component Objects, приоритет локаторов |
| `references/ui/steps.md` | Иерархия степов, `CommonSteps`, именование |
| `references/ui/fixtures.md` | UI-фикстуры, мониторинг JS/HTTP ошибок |
| `references/ui/snapshots.md` | Тестовые данные, aria-снапшоты |
| `references/ui/spec.md` | Анатомия UI-спека, именование, чек-лист |

## Эталонные примеры

API (`api/tests/noAuth/albums.spec.ts`):

```typescript
import { test } from "@@/api/fixtures/fixtures";

import { AlbumSchema } from "@@/api/types/response/jsonplaceholder/albums/zod/albumsSchemas";

import { AlbumId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

test.describe("Check 'ALBUMS' endpoint (Zod validation)", () => {
  test("Check 'GET /albums/{number}' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAlbumByNumber(AlbumId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumSchema, response);
  });
});
```

UI (`ui/tests/main/searchJob.spec.ts`):

```typescript
import { liveSiteConsoleNoise } from "@@/ui/data/consoleNoise";

import { test } from "@@/ui/fixtures/fixture";

test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] });

test.describe("Search jobs and check browser console", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
  });

  test("Search 'Javascript' jobs", async ({ mainPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();
    await mainPageSteps.checkCurrentUrl("Javascript");
  });
});
```

## Чего не делать

- Не вызывай `request.get/post` или `page.locator` из спека — только через клиент/степы/PO.
- Не инициализируй локаторы PO/CO field-initializer'ом (`readonly x = this.page.getByRole(...)`) — только присваиванием в теле конструктора (подробности в [references/ui/pages.md](references/ui/pages.md)): с Playwright ≥ 1.65 initializer падает в рантайме.
- Не пиши статус числом (`response.status()).toBe(200`) — только `HttpStatusCode.OK`.
- Не ослабляй схемы без причины (`z.object`, `additionalProperties: true`) — строгая валидация ловит «протечку» лишних полей, это осознанное решение проекта.
- Не логируй секреты вручную — `ApiLogger` уже маскирует чувствительные заголовки.
- Не коммить `.env` и не выноси URL в спеки — только `urls.ts` и переменные окружения (`optionalEnv`/`requireEnv`).
- Не оставляй `test.fail`/`test.skip` как «документацию бага» — фиксируй проблему allowlist'ом или отдельной проверкой негативного сценария.

## Финальные гейты перед сдачей

```bash
npm run typecheck
npm run lint
npx playwright test <изменённые файлы> --project=<проект>   # живая проверка
```

Если менялся только API-клиент/схемы без нового теста — достаточно typecheck + lint + прогона затронутого спека.
