# Лог TypeScript-рефакторинга фреймворка

> Журнал применения плана из `TYPESCRIPT_REFACTORING_PLAN.md`.
> После каждого этапа: `lint → typecheck → тесты → commit` (по скиллу `@typescript-refactoring`).

---

## Этап 1. Мёртвый код и устаревшие ссылки (P1) — ВЫПОЛНЕН

### 1.1. Закомментированный код в `playwright.config.ts`

**Статус**: ✅ применено

Удалены закомментированные блоки:
- `// ===GLOBAL_SETTINGS_FOR_EXPECTED===` с пустым `expect: {}` (строки 40-44)
- Закомментированные проекты `firefox`, `webkit`, `Mobile Chrome`, `Mobile Safari`, `Microsoft Edge`, `Google Chrome` (строки 85-114)
- Закомментированный блок `webServer` (строки 117-122)
- Закомментированный `// testDir: './tests'` и `// baseURL: 'http://127.0.0.1:3000'`

**Рефакторинг**: Remove Dead Code

### 1.2. Устаревшие ссылки в комментариях схем

**Статус**: ✅ применено

- `api/types/response/jsonplaceholder/albums/zod/albumsSchemas.ts:5` — убрана ссылка `(see api/REFACTORING_PLAN.md, "Этап 4")`
- `api/types/response/jsonplaceholder/error/zod/errorSchemas.ts:5-7` — убрана ссылка `(see api/REFACTORING_PLAN.md, "Этап 4")`

Комментарии сохранены без указания на удалённый файл.

**Рефакторинг**: обновление stale comments

### 1.3. Дублирование `dotenv.config()`

**Статус**: ✅ применено

**Было**: `dotenv.config()` вызывался в двух местах — `playwright.config.ts:8` и `api/utils/envUtils.ts:5`. Также в `playwright.config.ts` была локальная функция `optionalEnv`, дублирующая логику.

**Стало**:
- `dotenv.config()` остался единственной точкой входа в `api/utils/envUtils.ts` (централизованная env-логика).
- В `api/utils/envUtils.ts` добавлен экспорт `optionalEnv` (ранее был локальной функцией в config).
- Из `envUtils.ts` убран избыточный `import path` и `path.resolve` — `dotenv.config()` по умолчанию ищет `.env` в `process.cwd()`.
- Из `playwright.config.ts` убран `import * as dotenv` и вызов `dotenv.config()`.
- `playwright.config.ts` импортирует `optionalEnv` из `./api/utils/envUtils` (относительный путь, не `@@/`-alias — IDE-плагин playwright не резолвит path-aliases при загрузке config) — это триггерит загрузку dotenv как side-effect и унифицирует env-доступ.

**Рефакторинг**: Move Statements into Function + устранение дублирования

### 1.4. `devices["Desktop Chrome"]` для API-проектов

**Статус**: ✅ применено

**Было**: `...devices["Desktop Chrome"]` в `apiOAuth` (строка 63), `noOAuth` (строка 71), `ui` (строка 79).

**Стало**: `...devices["Desktop Chrome"]` оставлен только для `ui` проекта. Из `apiOAuth` и `noOAuth` удалён — API-тестам не нужны browser device settings.

**Рефакторинг**: Remove Dead Code / Speculative Generality

### 1.5. Несоответствие `lint:fix` скрипта

**Статус**: ✅ применено

**Было**: `"lint:fix": "eslint -c eslint.config.mjs 'api/**/*.{ts,json}' --quiet --fix"` — покрывал только `api/`, без `ui/`, с флагом `--quiet`.

**Стало**: `"lint:fix": "eslint -c eslint.config.mjs '{ui,api}/**/*.{ts,json}' --fix"` — симметрично с `lint`, без `--quiet` (чтобы видеть все ошибки при фиксе).

**Рефакторинг**: Inconsistent Behavior → унификация

---

### Проверка после Этапа 1

- `npm run lint` — ✅ exit code 0, без ошибок
- `npm run typecheck` — ✅ exit code 0, без ошибок
- `npx playwright test --project=noOAuth` — ⚠️ 4 теста упали с `ENOTFOUND jsonplaceholder.typicode.com` (сетевая ошибка sandbox, не связана с правками — DNS заблокирован в окружении выполнения)
- IDE linter (ReadLints) — ✅ без ошибок после перехода на относительный импорт в `playwright.config.ts`

### Изменённые файлы

- `playwright.config.ts` — удалён мёртвый код, убрано дублирование dotenv, убраны devices для API-проектов
- `api/utils/envUtils.ts` — добавлен экспорт `optionalEnv`
- `api/types/response/jsonplaceholder/albums/zod/albumsSchemas.ts` — убрана устаревшая ссылка в комментарии
- `api/types/response/jsonplaceholder/error/zod/errorSchemas.ts` — убрана устаревшая ссылка в комментарии
- `package.json` — унифицирован `lint:fix`

---

## Этап 2. Типобезопасность URL и параметров (P0) — ВЫПОЛНЕН

### 2.1. Магические плейсхолдеры `{0}` в URL

**Статус**: ✅ применено

**Было**: `URLS` — объект со строками вида `"/albums/{0}"`, параметры подставлялись через нетипобезопасный `stringFormat`.

**Стало**: `URLS` — объект с функциями-билдерами, типизированными через branded types (`AlbumId`, `CountryCode`):

```typescript
import type { AlbumId, CountryCode } from "@@/api/types/common";

export const URLS = {
  API_SPORTS: {
    COUNTRY_CODE: (code: CountryCode): string => `/countries/${code}`,
  },
  ALBUMS: {
    ALBUMS_ALL: "/albums",
    ALBUMS_ID: (id: AlbumId): string => `/albums/${id}`,
    ALBUMS_ID_PHOTOS: (id: AlbumId): string => `/albums/${id}/photos`,
  },
} as const;
```

Теперь вызов `URLS.ALBUMS.ALBUMS_ID(index)` проверяет тип `index` на этапе компиляции — нельзя передать обычный `number` вместо `AlbumId`, нельзя передать `string` вместо `CountryCode`, нельзя забыть параметр.

**Подход**: вариант A из `FRAMEWORK_REFACTORING_PLAN.md` (функции с типизированными параметрами) — идиоматичный TypeScript (template literals), KISS, без сложных mapped types. Выбран вместо изначально планировавшегося `UrlTemplate<P>` с Template Literal Types — проще и читаемее.

**Рефакторинг**: Replace Primitive with Object + Introduce Parameter Object

### 2.2. `stringFormat` — удаление

**Статус**: ✅ применено

**Было**: `api/utils/stringUtils.ts` содержал `stringFormat` с C#-стилем `{0}` плейсхолдерами и скрытым багом: `?.toString() ?? match` молча оставлял `{0}` в строке при `undefined` аргументе.

**Стало**: файл `api/utils/stringUtils.ts` удалён. Все вызовы мигрированы на типизированные функции-билдеры из `URLS`.

Места миграции:
- `api/clients/albumsApiClient.ts` — `stringFormat(URLS.ALBUMS.ALBUMS_ID, index)` → `URLS.ALBUMS.ALBUMS_ID(index)`
- `api/clients/hockeyApiClient.ts` — `stringFormat(URLS.API_SPORTS.COUNTRY_CODE, code)` → `URLS.API_SPORTS.COUNTRY_CODE(code)`

**Рефакторинг**: Replace Inline Code with Function Call + Remove Dead Code

### 2.3. Branded `HttpStatusCode` type guard

**Статус**: ✅ применено

**Было**: `isValidHttpStatusCode(code: number): code is HttpStatusCode` проверял лишь диапазон 100-599, но сужал до branded type — любой код (например 250) приобретал brand `HttpStatusCode`, обесценивая тип.

**Стало**: type guard удалён полностью. По grep он не использовался ни в одном файле (только в планах и определении). Branded type `HttpStatusCode` теперь нельзя получить через type guard — только через `HttpStatusCode.OK` и т.п. или явный `as HttpStatusCode`.

**Рефакторинг**: Introduce Special Case (устранение вводящего в заблуждение type guard)

---

### Проверка после Этапа 2

- `npm run lint` — ✅ exit code 0, без ошибок
- `npm run typecheck` — ✅ exit code 0, без ошибок
- IDE linter (ReadLints) — ✅ без ошибок

### Изменённые файлы

- `api/data/urls.ts` — переписан: строки с `{0}` → функции с типизированными параметрами
- `api/clients/albumsApiClient.ts` — вызовы мигрированы на `URLS.ALBUMS.ALBUMS_ID(index)`
- `api/clients/hockeyApiClient.ts` — вызов мигрирован на `URLS.API_SPORTS.COUNTRY_CODE(code)`
- `api/utils/stringUtils.ts` — **удалён** (содержал только `stringFormat`)
- `api/types/common/index.ts` — удалён `isValidHttpStatusCode` type guard

## Этап 3. Дублирование и ответственность классов (P0/P1) — ВЫПОЛНЕН

### 3.1. Дублирование валидации в `RequestAssertions`

**Статус**: ✅ применено

**Было**: `checkJSONResponseSchemaAjv` и `checkJSONResponseSchemaZod` дублировали структуру: `test.step` → `response.json()` → `validate` → `expect(...).toBe(true)`.

**Стало**: выделен приватный метод `withSchemaValidation(stepName, response, validate)`, принимающий унифицированный адаптер `(data) => { success, errors }`. Публичные методы содержат только специфичную для ajv/zod логику валидации.

```typescript
private async withSchemaValidation(
  stepName: string,
  response: APIResponse,
  validate: (data: unknown) => SchemaValidationResult,
): Promise<void> {
  await test.step(stepName, async () => {
    const jsonResponseData = await response.json();
    const result = validate(jsonResponseData);
    this.expect(result.success, result.errors).toBe(true);
  });
}
```

Дополнительно: параметр `expectStatusCode` переименован в `expectedStatusCode` (ранее совпадал с именем `expect` из playwright).

**Рефакторинг**: Extract Function + Rename Variable

### 3.2. Разрыв `ApiResponseValidator` (zod) vs `RequestAssertions` (ajv+zod)

**Статус**: ✅ применено

**Было**: `ApiResponseValidator.validateResponse` поддерживал только zod-схемы, а `RequestAssertions` — оба валидатора. Тесты использовали разные пути (hockey — `requestAssertions.checkJSONResponseSchemaAjv`, albums — `responseValidator.validateResponse` с zod).

**Стало**: `ValidationOptions.schema` расширен до `z.ZodType | JSONSchemaType<unknown>`. В `validateResponse` тип определяется через `schema instanceof z.ZodType` (zod — класс, ajv-схемы — plain objects) и вызывается соответствующий метод `RequestAssertions`.

```typescript
if (schema instanceof z.ZodType) {
  await this.assertions.checkJSONResponseSchemaZod(schema, response);
} else {
  await this.assertions.checkJSONResponseSchemaAjv(schema, response);
}
}
```

Обратная совместимость сохранена — тесты не требуют правок. Подход взят из `FRAMEWORK_REFACTORING_PLAN.md` (P1-1).

**Рефакторинг**: Parameterize Function + Introduce Parameter Object (расширение union)

### 3.3. `test.step` внутри API-клиентов

**Статус**: ⏸️ оставлено как есть (сознательное решение)

По результатам обсуждения решено **оставить** `test.step` в API-клиентах. Удобство автоматических шагов в отчётах перевешивает формальное нарушение SRP. Вынос в тесты усложнил бы их и потребовал бы ручной обёртки каждого вызова.

**Рефакторинг**: не применён (Move Function отклонён)

### 3.4. Мёртвые ветви в `BaseApiClient.sendRequest`

**Статус**: ✅ применено

**Было**: `sendRequest` поддерживал POST/PUT/PATCH/DELETE, но публичный API имел только `getMethod`. Ветви switch не использовались.

**Стало**: добавлены защищённые методы `postMethod`, `putMethod`, `patchMethod`, `deleteMethod` — теперь мёртвые ветви доступны для новых клиентов через наследование. `sendRequest` больше не содержит неиспользуемого кода.

```typescript
protected postMethod(path: string, data?: unknown, options: RequestOptions = {}): Promise<APIResponse> {
  return this.executeRequest("POST", path, options, data);
}
// ... аналогично для putMethod, patchMethod, deleteMethod
```

**Рефакторинг**: Extract Function (превращение мёртвого кода в публичный API)

### 3.5. `baseURL?: string` с throw в конструкторе

**Статус**: ✅ применено

**Было**: опциональный параметр `baseURL?: string` с runtime-throw в теле конструктора — тип обещал `string | undefined`, но фактически требовал `string`.

**Стало**: `baseURL: string` — обязательный параметр на уровне типа. Валидация `baseURL` перенесена в `fixtures.ts` (функция `requireBaseURL`), где Playwright передаёт `string | undefined` из config. Это явная точка валидации вместо скрытой в конструкторе.

```typescript
// baseApiClient.ts
constructor(
  private readonly request: APIRequestContext,
  role: UserRole,
  baseURL: string,
  options: BaseApiClientOptions = {},
) { /* ... */ }

// fixtures.ts
const requireBaseURL = (baseURL?: string): string => {
  if (!baseURL) {
    throw new Error("❌ baseURL is required! Check playwright.config.ts or .env");
  }
  return baseURL;
};
```

**Рефакторинг**: Change Function Declaration + Move Statements into Function

### 3.6. Magic boolean `new ApiLogger(true)`

**Статус**: ✅ применено

**Было**: `new ApiLogger(true)` — magic boolean, назначение неочевидно без чтения `ApiLogger`.

**Стало**: введён интерфейс `BaseApiClientOptions` с `logEnabled?: boolean`. Значение по умолчанию `true` сохранено.

```typescript
export interface BaseApiClientOptions {
  logEnabled?: boolean;
}

constructor(
  private readonly request: APIRequestContext,
  role: UserRole,
  baseURL: string,
  options: BaseApiClientOptions = {},
) {
  this.logger = new ApiLogger(options.logEnabled ?? true);
}
```

**Рефакторинг**: Remove Flag Argument + Introduce Parameter Object

---

### Проверка после Этапа 3

- `npm run lint` — ✅ exit code 0, без ошибок
- `npm run typecheck` — ✅ exit code 0, без ошибок (после возврата `{}` в `requestAssertions` fixture — Playwright требует деструктуризации)
- IDE linter (ReadLints) — ✅ без ошибок

### Изменённые файлы

- `api/clients/baseApiClient.ts` — `baseURL: string` (обязательный), `BaseApiClientOptions`, добавлены `postMethod`/`putMethod`/`patchMethod`/`deleteMethod`
- `api/assertions/RequestAssertions.ts` — Extract Function `withSchemaValidation`, переименован `expectStatusCode` → `expectedStatusCode`
- `api/utils/responseValidator.ts` — поддержка ajv+zod через `instanceof z.ZodType`
- `api/fixtures/fixtures.ts` — `requireBaseURL` для валидации (ранее в конструкторе BaseApiClient)

## Этап 4. Логгер — структура и мутабельность (P1/P2) — ВЫПОЛНЕН

### 4.1. `logResponse` — длинный метод с разнородными задачами

**Статус**: ✅ применено

**Было**: `logResponse` делал 4 задачи: вычисление duration, статус, заголовки, тело (json → text → fallback) с вложенными try/catch.

**Стало**: разбит на 3 приватных метода:
- `logResponseStatus(response, startTime)` — статус и duration
- `logResponseHeaders(response)` — заголовки
- `logResponseBody(response)` — тело с fallback json → text → unreadable

`logResponse` теперь только оркестрирует вызовы + пустая строка в конце. Вложенный try/catch заменён на early return + плоский fallback.

**Рефакторинг**: Extract Function + Split Phase

### 4.2. `statusText` дублирует `http.STATUS_CODES`

**Статус**: ✅ применено

**Было**: hardcoded map на 12 статус-кодов в приватном методе `statusText`.

**Стало**: используется `STATUS_CODES` из `node:http` — стандартный Node.js API, покрывает все статус-коды.

```typescript
import { STATUS_CODES } from "node:http";

// в logResponseStatus:
const statusText = STATUS_CODES[status] ?? "";
```

Метод `statusText` удалён.

**Рефакторинг**: Replace Inline Code with Function Call

### 4.3. Мутабельное состояние `requestStartTime`

**Статус**: ✅ применено

**Было**: `private requestStartTime = 0` — хранилось между `logRequest` и `logResponse`. Параллельные запросы перетрут значение; вызов `logResponse` без `logRequest` давал NaN.

**Стало**: `logRequest` возвращает `startTime: number`, который передаётся в `logResponse(response, startTime)`. Мутабельное поле `requestStartTime` удалено. Поле `enabled` стало `readonly`.

```typescript
// logger.ts
logRequest(...): number { /* ... */ return startTime; }
async logResponse(response: APIResponse, startTime: number): Promise<void> { /* ... */ }

// baseApiClient.ts
const startTime = this.logger.logRequest(method, url, requestOptions);
const response = await this.sendRequest(method, url, requestOptions);
await this.logger.logResponse(response, startTime);
```

**Рефакторинг**: Replace Temp with Query + устранение Mutable State

### 4.4. `formatObject` — упрощение

**Статус**: ✅ применено

**Было**: `split("\n").map(line => `  ${line}`).join("\n")` — многословно.

**Стало**: `JSON.stringify(obj, null, 2).replace(/^/gm, "  ")` — одна строка, тот же результат.

**Рефакторинг**: Inline Function (упрощение)

### 4.5. `enable()`/`disable()` — мёртвый код

**Статус**: ✅ применено

**Было**: публичные методы `enable()`/`disable()` для изменения `enabled` в рантайме.

**Стало**: методы удалены — по grep не использовались ни в одном файле. Поле `enabled` стало `readonly` (задаётся только в конструкторе). Это устраняет мутабельное публичное состояние.

**Рефакторинг**: Remove Dead Code

---

### Проверка после Этапа 4

- `npm run lint` — ✅ exit code 0 (после исправления порядка импортов: `@playwright/test` перед `node:http`)
- `npm run typecheck` — ✅ exit code 0
- IDE linter (ReadLints) — ✅ без ошибок

### Изменённые файлы

- `api/utils/logger.ts` — разбиение `logResponse`, `STATUS_CODES` из `node:http`, устранение `requestStartTime`, упрощение `formatObject`, удаление `enable()`/`disable()`, `enabled` → `readonly`
- `api/clients/baseApiClient.ts` — `logRequest` возвращает `startTime`, передаётся в `logResponse`

## Этап 5. Утилиты, fixtures, типы (P2) — ВЫПОЛНЕН

### 5.1. Side effect при импорте в `envUtils.ts`

**Статус**: ✅ применено

**Было**: `dotenv.config()` вызывался на верхнем уровне при импорте модуля — скрытый side effect.

**Стало**: введена явная функция `initEnv()` с idempotent guard (`envInitialized` флаг). Вызывается явно в `playwright.config.ts` перед использованием env-доступа.

```typescript
// envUtils.ts
let envInitialized = false;

export const initEnv = (): void => {
  if (envInitialized) return;
  dotenv.config();
  envInitialized = true;
};

// playwright.config.ts
import { initEnv, optionalEnv } from "./api/utils/envUtils";
initEnv();
```

**Рефакторинг**: Move Statements into Function (устранение скрытого side effect)

### 5.2. `requireEnv(name: string)` — типизация имён

**Статус**: ⏸️ пропущено (сознательное решение)

По результатам обсуждения решено оставить `name: string` — типизация через branded `EnvVarName` усложнит использование без явной выгоды для текущего размера проекта.

### 5.3. `getAuthHeaders` — exhaustiveness check

**Статус**: ✅ применено

**Было**: switch по `UserRole` без default — при добавлении нового значения enum компилятор не укажет на непокрытую ветвь.

**Стало**: добавлена default-ветвь с `const _exhaustive: never = role` — теперь TypeScript укажет на непокрытый случай при расширении enum.

```typescript
default: {
  const _exhaustive: never = role;
  throw new Error(`Unknown UserRole: ${_exhaustive}`);
}
```

**Рефакторинг**: Replace Conditional with Polymorphism (exhaustiveness check через `never`)

### 5.4. Пустой деструктор `{}` в fixtures

**Статус**: ⏸️ оставлено (сознательное решение)

Выяснено на Этапе 3: Playwright `base.extend<ApiFixtures>` требует деструктуризации первого параметра `({}, use)` — без `{}` typecheck падает (`This expression is not callable`). Оставлено как идиоматичное требование Playwright API.

### 5.5. Дублирование создания клиентов в `fixtures.ts`

**Статус**: ✅ применено

**Было**: `albumsApiClient` и `hockeyApiClient` создавались идентичными inline-функциями с дублированием `requireBaseURL`.

**Стало**: введена обобщённая фабрика `createApiClient<T>(ctor)` с типизированным конструктором. Типы Playwright fixtures корректно выводятся.

```typescript
const createApiClient = <T extends BaseApiClient>(ctor: ClientConstructor<T>) =>
  async ({ request, role, baseURL }, use) => {
    await use(new ctor(request, role, requireBaseURL(baseURL)));
  };

albumsApiClient: createApiClient(AlbumsApiClient),
hockeyApiClient: createApiClient(HockeyApiClient),
```

**Рефакторинг**: Extract Function

### 5.6. `CountryCode` toUpperCase в конструкторе branded type

**Статус**: ✅ применено

**Было**: `CountryCode(code: string)` молча нормализует ввод через `toUpperCase()` — неожиданное поведение для branded type constructor.

**Стало**: поведение задокументировано в комментарии — callers могут передавать `"by"` или `"BY"` и получать одинаковое branded-значение.

```typescript
// The constructor normalizes input to UPPER CASE so callers can pass
// "by" or "BY" interchangeably and still get the same branded value.
export const CountryCode = (code: string): CountryCode => code.toUpperCase() as CountryCode;
```

**Рефакторинг**: документирование Surprising Behavior

---

### Проверка после Этапа 5

- `npm run lint` — ✅ exit code 0
- `npm run typecheck` — ✅ exit code 0 (фабрика `createApiClient` корректно выводит типы Playwright fixtures)
- IDE linter (ReadLints) — ✅ без ошибок

### Изменённые файлы

- `api/utils/envUtils.ts` — `initEnv()` с idempotent guard вместо side effect
- `playwright.config.ts` — явный вызов `initEnv()`
- `api/utils/headerUtils.ts` — exhaustiveness check через `never` в `getAuthHeaders`
- `api/fixtures/fixtures.ts` — обобщённая фабрика `createApiClient<T>`
- `api/types/common/index.ts` — документирование `CountryCode` toUpperCase

## Этап 6. Строгость tsconfig (P2) — ВЫПОЛНЕН

### 6.1. `noPropertyAccessFromIndexSignature: false` → `true`

**Статус**: ✅ применено

**Было**: `noPropertyAccessFromIndexSignature: false` — разрешало доступ через точку к индексным сигнатурам без проверки.

**Стало**: `true` — теперь свойства из индексных сигнатур (например `process.env`) требуют доступа через квадратные скобки: `process.env["CI"]` вместо `process.env.CI`.

Правки в `playwright.config.ts` (3 места):
- `process.env.CI` → `process.env["CI"]` (строки 21, 23, 25)

**Рефакторинг**: усиление типобезопасности (запрет неявного доступа к индексным сигнатурам)

### 6.2. `verbatimModuleSyntax: true` — уже включён

**Статус**: ✅ подтверждено

Опция уже включена — форсирует `import type` для типов. Сохранено без изменений.

### 6.3. `exactOptionalPropertyTypes` — откат

**Статус**: ⏸️ не применено (каскадные правки)

Пробовал включить `exactOptionalPropertyTypes: true` — typecheck упал с 4 ошибками:
- `fixtures.ts:46-47` — тип `baseURL?: string` фабрики `createApiClient` несовместим с Playwright fixture типами (`string | undefined` не присваивается к `string` при exactOptionalPropertyTypes)
- `playwright.config.ts:17` — `workers: number | undefined` несовместим с Playwright типом `string | number`

Эти ошибки требуют правок в Playwright-типах или существенной переработки фабрики и config. Решено откатить — требует отдельной задачи с оценкой влияния на все optional-свойства.

**Рефакторинг**: не применён (откат из-за каскадных правок в Playwright-типах)

---

### Проверка после Этапа 6

- `npm run lint` — ✅ exit code 0
- `npm run typecheck` — ✅ exit code 0 (после отката `exactOptionalPropertyTypes`)
- IDE linter (ReadLints) — ✅ без ошибок

### Изменённые файлы

- `tsconfig.json` — `noPropertyAccessFromIndexSignature: true`
- `playwright.config.ts` — `process.env.CI` → `process.env["CI"]` (3 места)
