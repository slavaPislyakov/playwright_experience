# Playwright Test Framework

Фреймворк для API- и UI-тестов на Playwright. Валидация ответов — через Zod и AJV.

## Содержание

- [Быстрый старт](#быстрый-старт)
- [Требования](#требования)
- [Переменные окружения](#переменные-окружения)
- [Запуск тестов](#запуск-тестов)
- [Docker и Makefile](#docker-и-makefile)
- [Playwright-проекты](#playwright-проекты)
- [Структура проекта](#структура-проекта)
- [Архитектура](#архитектура)
- [Валидация схем](#валидация-схем)
- [Отчёты](#отчёты)
- [Качество кода](#качество-кода)

## Быстрый старт

Минимальный путь «клонировал → запустил» без ключей и UI-браузеров — suite `noOAuth` (публичный [JSONPlaceholder](https://jsonplaceholder.typicode.com)).

```bash
git clone https://github.com/slavaPislyakov/playwright_experience.git
cd playwright_experience

npm install

# Минимальный .env — достаточно для API без авторизации
cat > .env << 'EOF'
BASE_URL_NO_AUTH=https://jsonplaceholder.typicode.com
EOF

# Запуск первого набора тестов
npm run test:api:no_oauth
```

Если тесты прошли — окружение настроено. Дальше можно добавить UI и OAuth-suite (см. [Переменные окружения](#переменные-окружения)).

| Что хотите запустить | Нужно в `.env` | Команда |
|----------------------|----------------|---------|
| API без авторизации | `BASE_URL_NO_AUTH` | `npm run test:api:no_oauth` |
| UI | `BASE_URL_UI` + браузеры Playwright | `npx playwright install chromium` → `npm run test:ui` |
| API с авторизацией | `BASE_URL_AUTH` + `API_KEY` | `npm run test:api:oauth` |
| Всё сразу | все переменные выше | `npm run test:all` |

## Требования

- Node.js **20+** (в CI используется 20)
- npm 9+
- Docker и Docker Compose — опционально, для запуска через контейнер

## Переменные окружения

Создайте файл `.env` в корне проекта. Файл в git не коммитится.

```env
# Обязательно для npm run test:api:no_oauth
BASE_URL_NO_AUTH=https://jsonplaceholder.typicode.com

# Обязательно для npm run test:ui
BASE_URL_UI=https://belmeta.com

# Обязательно для npm run test:api:oauth
# Пример публичного хоста API-Sports Hockey; в CI может быть другой URL из secrets
BASE_URL_AUTH=https://v1.hockey.api-sports.io
API_KEY=your_api_sports_key
```

Как читаются переменные:

- в `playwright.config.ts` — через `optionalEnv(...)`, поэтому можно запускать один `--project` без остальных переменных;
- при реальном запросе клиент требует свой `baseURL`; для `UserRole.AUTHORIZED` дополнительно нужен `API_KEY` (заголовок `x-rapidapi-key`).

> `API_KEY` — ключ [API-Sports](https://www.api-sports.io/). Без него suite `apiOAuth` не запустится. Значения для CI хранятся в GitHub Secrets (`BASE_URL_*`, `API_KEY`).

## Запуск тестов

### Локально

```bash
# API без авторизации (самый простой старт)
npm run test:api:no_oauth

# UI (нужен Chromium)
npx playwright install chromium
npm run test:ui

# API с авторизацией
npm run test:api:oauth

# Все проекты
npm run test:all

# Конкретный файл / проект
npx playwright test api/tests/noAuth/albums.spec.ts
npx playwright test --project=ui

# Headed / debug / UI Mode
npx playwright test --project=ui --headed
npx playwright test ui/tests/main/mainPage.spec.ts --debug
npm run ui:mode
```

### Через Docker

Нужен Docker. Переменные берутся из `.env` (файл опционален для compose, но тесты без нужных env упадут).

```bash
make test-no_oauth   # API без авторизации
make test-ui         # UI
make test-oauth      # API с авторизацией
make test            # все тесты
```

## Docker и Makefile

| Команда | Описание |
|---------|----------|
| `make test` | Все тесты через Docker Compose |
| `make test-oauth` | API с авторизацией |
| `make test-no_oauth` | API без авторизации |
| `make test-ui` | UI-тесты |
| `make build` | Сборка образа |
| `make rebuild` | Пересборка без кэша |
| `make test-report` | Открыть HTML-отчёт Playwright |
| `make clean` | Остановить контейнеры и удалить отчёт |
| `make logs` | Логи docker compose |
| `make debug` | Shell внутри контейнера |
| `make help` | Список команд |

Образ: `mcr.microsoft.com/playwright:v1.60.0-noble`. В compose используется анонимный volume `/app/node_modules`, чтобы хостовые `node_modules` не перекрывали зависимости из образа.

## Playwright-проекты

| Проект | `testDir` | `baseURL` | Авторизация |
|--------|-----------|-----------|-------------|
| `noOAuth` | `api/tests/noAuth` | `BASE_URL_NO_AUTH` | нет |
| `apiOAuth` | `api/tests/apiOAuth` | `BASE_URL_AUTH` | да (`API_KEY` при `UserRole.AUTHORIZED`) |
| `ui` | `ui/tests` | `BASE_URL_UI` | нет |

Проекты независимы: нет `setup`-проекта и нет `dependencies` между ними. Каждый можно запускать отдельно через `--project=...`.

## Структура проекта

```
├── api/
│   ├── assertions/          # RequestAssertions
│   ├── clients/             # BaseApiClient, AlbumsApiClient, HockeyApiClient
│   ├── data/                # URL-билдеры
│   ├── fixtures/            # Playwright fixtures для API
│   ├── tests/
│   │   ├── apiOAuth/        # тесты с авторизацией
│   │   └── noAuth/          # тесты без авторизации
│   ├── types/
│   │   ├── common/          # branded types, HttpStatusCode, ValidationResult
│   │   └── response/        # Zod- и AJV-схемы ответов
│   └── utils/               # env, logger, валидаторы
├── ui/
│   ├── components/          # Component Objects
│   ├── data/                # тестовые данные / snapshots
│   ├── fixtures/            # Playwright fixtures для UI
│   ├── pages/               # Page Objects
│   ├── steps/               # Step Objects
│   └── tests/               # UI тест-кейсы
├── playwright.config.ts
├── docker-compose.yml
├── Dockerfile
└── Makefile
```

## Архитектура

### API

Паттерн **API Client**:

- `BaseApiClient` — HTTP-методы и логирование;
- `AlbumsApiClient` / `HockeyApiClient` — клиенты конкретных API;
- `RequestAssertions` — проверки статуса и схемы (Zod / AJV);
- branded types (`AlbumId`, `CountryCode`) и enum `HttpStatusCode` — типобезопасные параметры.

Пример (актуальный стиль тестов):

```typescript
import { test } from "@@/api/fixtures/fixtures";
import { AlbumsArraySchema } from "@@/api/types/response/jsonplaceholder/albums/zod/albumsSchemas";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

test.describe("Check 'ALBUMS' endpoint", () => {
  test("Get all albums", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAllAlbums();
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumsArraySchema, response);
  });
});
```

### UI

Комбинация **Page Object** + **Step Object**:

- `pages/` — страницы и селекторы;
- `components/` — переиспользуемые блоки UI;
- `steps/` — бизнес-шаги тестов;
- `fixtures/` — кастомные фикстуры Playwright.

Пример:

```typescript
import { test } from "@@/ui/fixtures/fixture";

test.describe("Main page:", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
  });

  test("Navigate to main page", async ({ mainPageSteps }) => {
    await mainPageSteps.checkAnonymousHeaderText("Поиск работы в Минске");
    await mainPageSteps.navigationSteps.checkNavigationElementIsVisible();
  });
});
```

| Фикстура | Описание |
|----------|----------|
| `page` | Страница с отловом JS/console ошибок |
| `pageWithMonitoring` | Падает при HTTP-ответах со статусом ≥ 400 |
| `failOnJSError` | Вкл/выкл проверку JS-ошибок (`test.use({ failOnJSError: false })`) |
| `mainPageSteps` | Step Object главной страницы |

Подробнее про иерархию UI: [`ui/Readme.md`](ui/Readme.md).

## Валидация схем

### Zod

Используется для JSONPlaceholder (albums). Схемы объявляются через `z.strictObject` (лишние поля в ответе отклоняются):

```typescript
import { z } from "zod";

export const AlbumSchema = z.strictObject({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
});

export type Album = z.infer<typeof AlbumSchema>;
```

В тесте:

```typescript
await requestAssertions.checkJSONResponseSchemaZod(AlbumSchema, response);
```

### AJV

Используется для apiSportsIO (hockey). JSON Schema с `additionalProperties: false` — строгая проверка лишних полей:

```typescript
await requestAssertions.checkJSONResponseSchemaAjv(CountryInfoArraySchemaAjv, response);
```

Оба валидатора живут осознанно: Zod — для публичного API, AJV — где нужна строгая JSON Schema.

## Отчёты

```bash
npm run html:report      # HTML-отчёт Playwright
npm run allure:report    # Allure (нужен Java для allure-commandline)
make test-report         # то же, что html:report, через Makefile
```

Каталоги:

- `playwright-report/` — HTML-отчёт Playwright
- `allure-results/` — сырые результаты Allure

## Качество кода

```bash
npm run lint          # ESLint
npm run lint:fix     # ESLint с автофиксом
npm run typecheck     # tsc --noEmit
```

Перед коммитом husky запускает `lint-staged` (см. `package.json` → `lint-staged`). В CI job `static-checks` дополнительно гоняет `typecheck` и `lint` до тестовых jobs.
