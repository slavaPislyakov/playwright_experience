# Playwright Test Framework

Фреймворк для автоматизации тестирования API и UI на базе Playwright с поддержкой валидации схем через Zod и AJV.

## Содержание

- [Требования](#требования)
- [Установка](#установка)
- [Настройка окружения](#настройка-окружения)
- [Структура проекта](#структура-проекта)
- [Запуск тестов](#запуск-тестов)
  - [Локальный запуск](#локальный-запуск)
  - [Запуск через Docker](#запуск-через-docker)
- [Команды Makefile](#команды-makefile)
- [Архитектура](#архитектура)
  - [API тесты](#api-тесты)
  - [UI тесты](#ui-тесты)
- [Валидация схем](#валидация-схем)
  - [Zod](#zod)
  - [AJV](#ajv)
- [Отчеты](#отчеты)

## Требования

- Node.js 18+
- npm 9+
- Docker и Docker Compose (опционально, для контейнеризированного запуска)

## Установка

```bash
# Клонирование репозитория
git clone <repository-url>
cd playwright_experience

# Установка зависимостей
npm install

# Установка браузеров Playwright
npx playwright install
```

## Настройка окружения

Создайте файл `.env` в корне проекта с необходимыми переменными:

```env
# URL для API тестов без авторизации
BASE_URL_NO_AUTH=https://jsonplaceholder.typicode.com

# URL для API тестов с авторизацией
BASE_URL_AUTH=https://v1.api.isports.staging.srv41880.seosmart.ru

# URL для UI тестов
BASE_URL_UI=https://belmeta.com

# Токен авторизации для API тестов (если требуется)
AUTH_TOKEN=your_token_here
```

## Структура проекта

```
├── api/                           # API тесты и утилиты
│   ├── assertions/                # Классы для assertions
│   ├── clients/                   # API клиенты
│   ├── fixtures/                  # Кастомные фикстуры
│   ├── tests/                     # Тест-кейсы
│   │   ├── apiOAuth/             # Тесты с авторизацией
│   │   └── noAuth/               # Тесты без авторизации
│   ├── types/                     # TypeScript типы и схемы
│   │   ├── common/               # Общие типы
│   │   └── response/             # Схемы ответов
│   │       ├── apiSportsIO/      # Схемы для apiSportsIO API
│   │       └── jsonplaceholder/  # Схемы для jsonplaceholder API
│   └── utils/                     # Утилиты и хелперы
├── ui/                            # UI тесты
│   ├── components/               # Компоненты страниц
│   ├── data/                     # Тестовые данные
│   ├── fixtures/                 # Кастомные фикстуры
│   ├── pages/                    # Page Objects
│   ├── steps/                    # Step Objects
│   └── tests/                    # Тест-кейсы
├── playwright.config.ts          # Конфигурация Playwright
├── docker-compose.yml            # Docker Compose конфигурация
├── Dockerfile                    # Docker образ для тестов
└── Makefile                      # Команды для автоматизации
```

## Запуск тестов

### Локальный запуск

```bash
# Запуск всех тестов
npm run test:all

# Запуск только UI тестов
npm run test:ui

# Запуск API тестов с авторизацией
npm run test:api:oauth

# Запуск API тестов без авторизации
npm run test:api:no_oauth

# Запуск конкретного тестового файла
npx playwright test api/tests/noAuth/albums.spec.ts

# Запуск в headed режиме (виден браузер)
npx playwright test ui/tests/main/mainPage.spec.ts --headed

# Запуск в debug режиме
npx playwright test ui/tests/main/mainPage.spec.ts --debug

# Запуск с UI интерфейсом
npm run ui:mode

# Запуск на конкретном браузере
npx playwright test --project=chromium
```

### Запуск через Docker

```bash
# Запуск всех тестов через Docker Compose
make test

# Запуск API тестов с авторизацией
make test-oauth

# Запуск API тестов без авторизации
make test-no_oauth

# Запуск UI тестов
make test-ui

# Остановка контейнеров
make clean

# Просмотр логов
make logs

# Вход в контейнер для отладки
make debug
```

## Команды Makefile

| Команда | Описание |
|---------|----------|
| `make test` | Запуск всех тестов через Docker Compose |
| `make test-oauth` | Запуск API тестов с авторизацией |
| `make test-no_oauth` | Запуск API тестов без авторизации |
| `make test-ui` | Запуск UI тестов |
| `make build` | Сборка Docker образа |
| `make rebuild` | Пересборка Docker образа без кэша |
| `make test-report` | Открытие HTML отчета Playwright |
| `make clean` | Остановка контейнеров и очистка |
| `make logs` | Просмотр логов Docker Compose |
| `make debug` | Вход в контейнер (shell) |
| `make help` | Список всех команд |

## Архитектура

### API тесты

Фреймворк использует паттерн **API Client** для инкапсуляции логики работы с API:

**Структура:**
- `BaseApiClient` — базовый класс с HTTP методами и логированием
- `AlbumsApiClient`, `HockeyApiClient` — специализированные клиенты для конкретных API
- `RequestAssertions` — assertions для проверки ответов
- `ApiResponseValidator` — валидация ответов через Zod/AJV схемы

**Пример теста:**

```typescript
import { test } from "@@/api/fixtures/fixtures";
import { AlbumsArraySchema, AlbumSchema } from "@@/api/types/response/jsonplaceholder/albums/zod/albumsSchemas";
import { AlbumId } from "@@/api/types/common";

test.describe("Check 'ALBUMS' endpoint", () => {
  test("Get all albums", async ({ albumsApiClient, responseValidator }) => {
    const response = await albumsApiClient.getAllAlbums();
    await responseValidator.validateResponse(response, { schema: AlbumsArraySchema });
  });

  test("Get album by ID", async ({ albumsApiClient, responseValidator }) => {
    const response = await albumsApiClient.getAlbumByNumber(AlbumId(1));
    await responseValidator.validateResponse(response, { schema: AlbumSchema });
  });
});
```

### UI тесты

Используется комбинация паттернов **Page Object** и **Step Object**:

**Структура:**
- `pages/` — Page Objects представляют страницы приложения
- `components/` — Component Objects для переиспользуемых элементов
- `steps/` — Step Objects содержат бизнес-логику шагов тестов
- `fixtures/` — кастомные фикстуры Playwright

**Пример теста:**

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

**Доступные фикстуры:**

| Фикстура | Описание |
|----------|----------|
| `page` | Страница с автоматическим отловом JS ошибок |
| `pageWithMonitoring` | Страница с мониторингом HTTP запросов (тест падает при запросах >= 400) |
| `failOnJSError` | Опция для включения/отключения проверки JS ошибок |
| `mainPageSteps` | Step Object для главной страницы |

## Валидация схем

### Zod

Рекомендуемый способ валидации с автоматическим выводом TypeScript типов:

```typescript
import { z } from "zod";

export const AlbumSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
});

export type Album = z.infer<typeof AlbumSchema>;
export const AlbumsArraySchema = z.array(AlbumSchema);
```

Использование в тесте:

```typescript
await responseValidator.validateResponse(response, { schema: AlbumsArraySchema });
```

### AJV

Валидация через JSON Schema (для legacy API или специфических требований):

```typescript
import { JSONSchemaType } from "ajv";

interface League {
  league: {
    id: number;
    name: string;
  };
}

const LeagueSchema: JSONSchemaType<League> = {
  type: "object",
  properties: {
    league: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
      },
      required: ["id", "name"],
    },
  },
  required: ["league"],
};
```

## Отчеты

```bash
# HTML отчет Playwright
npm run html:report

# Allure отчет
npm run allure:report

# Открытие последнего отчета через Makefile
make test-report
```

Отчеты сохраняются в:
- `playwright-report/` — HTML отчет Playwright
- `allure-results/` — результаты для Allure
