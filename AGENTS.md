# AGENTS.md

## Что это

Playwright-фреймворк автотестов (TypeScript, Node ≥ 22, Playwright 1.65): API-тесты против публичного JSONPlaceholder и UI-тесты против живого rabota.by (hh-платформа). Не продуктовый код — только тестовая инфраструктура.

## Команды

```bash
npm run typecheck        # tsc --noEmit — всегда перед сдачей
npm run lint             # eslint (конфиг eslint.config.mjs); npm run lint:fix для автофикса
npm run test:api:no_oauth  # проект noOAuth (API)
npm run test:ui          # проект ui (живой сайт — медленно)
npm run test:smoke       # только тесты с @smoke, API + UI
npx playwright test <файл> --project=noOAuth   # один файл — так
make help                # docker-обёртки: make test-no_oauth, test-ui, test-smoke
```

Гейт перед сдачей изменений: `npm run typecheck && npm run lint` + `npm run test:all` (для быстрой итерации — прогон затронутых спеков, перед сдачей полный `test:all`).

## Правила работы агента

- Используй существующие компоненты и соглашения TypeScript.
- Не добавляй зависимости без согласования.
- Для исправления бага добавляй регрессионный тест.
- После изменений запускай `npm run test:all` и `npm run lint`.
- В финале перечисли изменённые файлы и результаты проверок.
- Не меняй несвязанный с задачей код.

## Структура

- `api/` — клиенты (`clients/`, наследники `BaseApiClient`), фикстуры (`fixtures/fixtures.ts` — множественное число), ассерты (`assertions/RequestAssertions.ts`), маршруты (`data/urls.ts`), билдеры тел запросов (`data/builders/`), Zod-схемы (`types/response/.../zod/`, строго `z.strictObject`), утилиты (`utils/`)
- `ui/` — Page Objects (`pages/`, наследники `BasePage`), Component Objects (`components/`), иерархия степов (`steps/`), фикстуры (`fixtures/fixture.ts` — единственное число), aria-снапшоты (`data/snapshots/blocks.ts`)
- `.agents/skills/write-autotests/` — **главный справочник конвенций. Читать SKILL.md перед любой правкой файлов в `api/` или `ui/`.** Там же `references/` по темам и правило порядка добавления теста.

## Жёсткие конвенции

- Спек тонкий: только вызовы клиентов (API) или степов (UI) и `check*`-ассерты. Сырой `expect` в спеках запрещён.
- `test` в спеках импортируется только из фикстур проекта (`@@/api/fixtures/fixtures`, `@@/ui/fixtures/fixture`), не из `@playwright/test`.
- Всё оборачивается в `test.step` внутри клиентов/степов; в спеке `test.step` вручную не добавляется.
- Статусы — только enum `HttpStatusCode`; id — branded-конструкторы (`PostId(1)`); без магических чисел.
- Новые `check*`-методы ассертов регистрируются в `eslint.config.mjs` → `playwright/expect-expect` → `assertFunctionPatterns`, иначе lint упадёт.
- Стиль: `import type` для типов, явные типы возврата, двойные кавычки, длина строки ≤ 120, имена тестов/степов на английском, комментарии «почему» можно на русском. Импорты не расставлять руками — `npm run lint:fix` (алиас `@@/`, порядок задаёт `import-x/order` с pathGroups).
- Фикстуры и документация env: переменные через `optionalEnv`/`requireEnv` из `api/utils/envUtils.ts`; `API_KEY` нужен только для роли `UserRole.AUTHORIZED`. `.env` не коммитится (см. `.env.example`).

## Готчи

- Playwright ≥ 1.65: локаторы PO/CO **нельзя** инициализировать field-initializer'ом (`readonly x = this.page.getByRole(...)`) — падает в рантайме. Только присваивание в теле конструктора.
- UI-проект гоняет живой сайт: `fullyParallel: false` внутри файла, тесты по одному; JS/HTTP-ошибки ловит фикстура `pageWithMonitoring` (allowlist шума — через `test.use({ jsErrorAllowlist: [...] })`).
- Аттачи HTTP request/response в Allure/HTML-отчёт делаются автоматически в `BaseApiClient` (через `api/utils/allureAttachments.ts`) и цепляются к степу, а не к тесту верхнего уровня.
- `BASE_URL_AUTH` в `.env` — легаси от удалённого hockey-клиента, не используется.
- Аria-снапшоты вместо пиксель-диффов — осознанное решение (живой сайт, динамический контент).

## Документы репозитория

- `README.md` — архитектура и запуск; `ui/Readme.md` — правила иерархии UI.
