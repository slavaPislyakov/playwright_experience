# План TypeScript-рефакторинга фреймворка

> Применён скилл `@typescript-refactoring` (каталог Мартина Фаулера, адаптированный для TypeScript).
> Каждая проблема сопоставлена с конкретным рефакторингом из `catalog.md` и приоритизирована по влиянию и риску.

## Легенда приоритетов

- **P0 (критично)** — баги, небезопасность типов, нарушение SOLID/KISS
- **P1 (высоко)** — дублирование, мёртвый код, явные запахи
- **P2 (средне)** — улучшения читаемости, мелкие оптимизации
- **P3 (низко)** — стилистические, опциональные

---

## Этап 1. Мёртвый код и устаревшие ссылки (P1)

### 1.1. Закомментированный код в `playwright.config.ts`

**Запах**: Dead Code, Speculative Generity
**Файл**: `playwright.config.ts:40-44, 85-114, 117-122`

Закомментированные блоки `expect`, `firefox`, `webkit`, `Mobile`, `Edge`, `Chrome`, `webServer` — мёртвый груз.

**Рефакторинг**: Remove Dead Code — удалить все закомментированные блоки. При необходимости вернуть через git history.

### 1.2. Устаревшие ссылки в комментариях схем

**Запах**: Stale Comments
**Файлы**:
- `api/types/response/jsonplaceholder/albums/zod/albumsSchemas.ts:5` — ссылается на удалённый `api/REFACTORING_PLAN.md`
- `api/types/response/jsonplaceholder/error/zod/errorSchemas.ts:5-7` — та же ссылка

**Рефакторинг**: обновить комментарии, убрать ссылки на несуществующий файл.

### 1.3. Дублирование `dotenv.config()`

**Запах**: Duplicate Code, Side Effect at Import
**Файлы**: `playwright.config.ts:8` и `api/utils/envUtils.ts:5`

`dotenv.config()` вызывается дважды: в config и в envUtils.

**Рефакторинг**: **Move Statements into Function** — оставить только в `envUtils.ts` (или только в config). Унифицировать точку входа.

### 1.4. `devices["Desktop Chrome"]` для API-проектов

**Запах**: Speculative Generality / Inappropriate Intimacy
**Файл**: `playwright.config.ts:63, 71, 79`

API-проектам не нужны browser device settings (`devices["Desktop Chrome"]`).

**Рефакторинг**: **Remove Dead Code** — убрать `...devices["Desktop Chrome"]` из `apiOAuth` и `noOAuth` проектов. Оставить только для `ui`.

### 1.5. Несоответствие `lint:fix` скрипта

**Запах**: Inconsistent Behavior
**Файл**: `package.json:7`

`lint` проверяет `{ui,api}/**/*.{ts,json}`, а `lint:fix` — только `api/**/*.{ts,json}` (без ui, без fix для json).

**Рефакторинг**: привести к единому шаблону: `eslint -c eslint.config.mjs '{ui,api}/**/*.{ts,json}' --fix`.

---

## Этап 2. Типобезопасность URL и параметров (P0)

### 2.1. Магические плейсхолдеры `{0}` в URL

**Запах**: Primitive Obsession, Type-Unsafe String Interpolation
**Файлы**: `api/data/urls.ts`, `api/utils/stringUtils.ts`

```1:10:api/data/urls.ts
export const URLS = {
  API_SPORTS: {
    COUNTRY_CODE: "/countries/{0}",
  },
  ALBUMS: {
    ALBUMS_ALL: "/albums",
    ALBUMS_ID: "/albums/{0}",
    ALBUMS_ID_PHOTOS: "/albums/{0}/photos",
  },
} as const;
```

`stringFormat(URLS.ALBUMS.ALBUMS_ID, index)` — нет проверки, что передано нужное число аргументов и нужного типа.

**Рефакторинг**: **Replace Primitive with Object** + **Introduce Parameter Object** — ввести типизированный `UrlTemplate<P>`:

```typescript
interface UrlTemplate<Params extends readonly unknown[]> {
  readonly template: string;
  build(...params: Params): string;
}
```

Или использовать **Template Literal Types** для статического парсинга параметров.

### 2.2. `stringFormat` — неявная семантика

**Запах**: Reimplementing the Wheel, Implicit Behavior
**Файл**: `api/utils/stringUtils.ts`

`{0}` — C#-стиль, не идиоматично для TS. `?.toString() ?? match` молча оставляет `{0}` в строке, если аргумент `undefined` — скрытый баг.

**Рефакторинг**: **Replace Inline Code with Function Call** — использовать нативные template literals или типизированный builder (см. 2.1). Удалить `stringFormat` после миграции всех вызовов.

### 2.3. Branded `HttpStatusCode` type guard вводит в заблуждение

**Запах**: Misleading Abstraction, Leaky Encapsulation
**Файл**: `api/types/common/index.ts:32-34`

```32:34:api/types/common/index.ts
export const isValidHttpStatusCode = (code: number): code is HttpStatusCode => {
  return code >= 100 && code < 600;
};
```

Type guard утверждает `code is HttpStatusCode` (branded type), но проверяет лишь диапазон. Любое число 100-599 проходит проверку и приобретает brand, что обесценивает branded type.

**Рефакторинг**: **Introduce Special Case** — либо:
- переименовать в `isHttpStatusCodeRange` и документировать,
- либо убрать type guard (он не используется в коде — проверить через grep),
- либо сделать assertion-функцией, конвертирующей через `as HttpStatusCode`.

---

## Этап 3. Дублирование и ответственность классов (P0/P1)

### 3.1. Дублирование валидации в `RequestAssertions`

**Запах**: Duplicate Code, Long Method
**Файл**: `api/assertions/RequestAssertions.ts:42-65`

`checkJSONResponseSchemaAjv` и `checkJSONResponseSchemaZod` идентичны по структуре: `test.step` → `response.json()` → `validate` → `expect(...).toBe(true)`.

**Рефакторинг**: **Extract Function** — выделить общую часть:

```typescript
private async withSchemaValidation(
  stepName: string,
  response: APIResponse,
  validate: (data: unknown) => { success: boolean; errors: string },
): Promise<void> {
  await test.step(stepName, async () => {
    const data = await response.json();
    const result = validate(data);
    this.expect(result.success, result.errors).toBe(true);
  });
}
```

### 3.2. Разрыв: `ApiResponseValidator` (zod) vs `RequestAssertions` (ajv+zod)

**Запах**: Inconsistent Abstraction, Divergent Change
**Файлы**: `api/utils/responseValidator.ts`, `api/assertions/RequestAssertions.ts`

`ApiResponseValidator.validateResponse` поддерживает только zod, а `RequestAssertions` поддерживает ajv и zod. Тесты используют оба пути (см. `hockeyHighlight.spec.ts` — ajv, `albums.spec.ts` — zod через validator).

**Рефакторинг**: **Parameterize Function** + **Introduce Parameter Object** — объединить через discriminated union:

```typescript
type SchemaValidator =
  | { kind: "zod"; schema: z.ZodType }
  | { kind: "ajv"; schema: JSONSchemaType<unknown> };

interface ValidationOptions {
  statusCode?: HttpStatusCode;
  schema?: SchemaValidator;
}
```

Или: `ApiResponseValidator` делегирует в `RequestAssertions`, а `RequestAssertions` предоставляет оба метода (текущее состояние), но `validateResponse` расширить до ajv.

### 3.3. `test.step` внутри API-клиентов — смешение ответственности

**Запах**: Feature Envy, Mixed Responsibilities
**Файлы**: `api/clients/albumsApiClient.ts:14, 18, 24`, `api/clients/hockeyApiClient.ts:15`

Клиент отвечает и за HTTP-запрос, и за шаг теста. Это нарушает SRP и затрудняет переиспользование клиента вне тестового контекста.

**Рефакторинг**: **Move Function** — вынести `test.step` в тесты или в слой fixtures. Клиент должен возвращать `Promise<APIResponse>` без обёртки step. Шаги — ответственность теста.

### 3.4. Мёртвые ветви в `BaseApiClient.sendRequest`

**Запах**: Dead Code, Speculative Generality
**Файл**: `api/clients/baseApiClient.ts:63-80`

`sendRequest` поддерживает POST/PUT/PATCH/DELETE, но публичный API имеет только `getMethod`. Четыре ветви switch не используются.

**Рефакторинг**: либо **Remove Dead Code** (оставить только GET), либо добавить защищённые методы `postMethod`/`putMethod`/etc. и использовать их в новых клиентах. Решение зависит от планов расширения.

### 3.5. `baseURL?: string` с throw в конструкторе

**Запах**: Temporary Field, Implicit Contract
**Файл**: `api/clients/baseApiClient.ts:17-20`

Опциональный параметр с runtime-throw — антипаттерн. Тип обещает `string | undefined`, но фактически требует `string`.

**Рефакторинг**: **Change Function Declaration** — сделать `baseURL: string` обязательным типом. Валидация переносится на уровень fixtures/config (там уже есть `optionalEnv`, который возвращает `undefined` — это и есть реальная точка валидации).

### 3.6. Magic boolean `new ApiLogger(true)`

**Запах**: Magic Number/Boolean, Implicit Configuration
**Файл**: `api/clients/baseApiClient.ts:23`

`true` — что включает? Неочевидно без чтения `ApiLogger`.

**Рефакторинг**: **Remove Flag Argument** + **Introduce Parameter Object**:

```typescript
constructor(
  private readonly request: APIRequestContext,
  role: UserRole,
  baseURL: string,
  options: { logEnabled?: boolean } = {},
) {
  this.logger = new ApiLogger(options.logEnabled ?? true);
}
```

---

## Этап 4. Логгер — структура и мутабельность (P1/P2)

### 4.1. `logResponse` — длинный метод с разнородными задачами

**Запах**: Long Method, Mixed Responsibilities
**Файл**: `api/utils/logger.ts:50-88`

Метод делает: вычисление duration, статус, заголовки, тело (json → text → fallback). Вложенные try/catch.

**Рефакторинг**: **Extract Function** + **Split Phase**:

```typescript
async logResponse(response: APIResponse): Promise<void> {
  if (!this.enabled) return;
  this.logResponseStatus(response);
  this.logResponseHeaders(response);
  await this.logResponseBody(response);
  console.log("");
}

private logResponseStatus(response: APIResponse): void { /* ... */ }
private logResponseHeaders(response: APIResponse): void { /* ... */ }
private async logResponseBody(response: APIResponse): Promise<void> { /* ... */ }
```

### 4.2. `statusText` дублирует `http.STATUS_CODES`

**Запах**: Reimplementing the Wheel, Duplicate Code
**Файл**: `api/utils/logger.ts:111-127`

Хардкод таблицы статус-кодов, хотя Node.js предоставляет `http.STATUS_CODES`.

**Рефакторинг**: **Replace Inline Code with Function Call**:

```typescript
import { STATUS_CODES } from "node:http";

private statusText(status: number): string {
  return STATUS_CODES[status] ?? "";
}
```

### 4.3. Мутабельное состояние `requestStartTime`

**Запах**: Mutable State, Hidden Temporal Coupling
**Файл**: `api/utils/logger.ts:6, 28, 53`

`requestStartTime` хранится между `logRequest` и `logResponse`. Если вызвать `logResponse` без `logRequest` — NaN. Параллельные запросы перетрут значение.

**Рефакторинг**: **Replace Temp with Query** / **Introduce Parameter Object** — `logRequest` возвращает `{ startTime: number }`, который передаётся в `logResponse`. Или `executeRequest` сам считает duration и передаёт в логгер.

### 4.4. `formatObject` — тривиальная обёртка

**Запах**: Speculative Generality
**Файл**: `api/utils/logger.ts:98-109`

Функция делает `JSON.stringify(obj, null, 2)` + добавление отступа. Можно упростить.

**Рефакторинг**: **Inline Function** или упростить до одной строки через `replace`:

```typescript
private formatObject(obj: unknown): string {
  return JSON.stringify(obj, null, 2).replace(/^/gm, "  ");
}
```

### 4.5. `enable()`/`disable()` — мутабельный API

**Запах**: Mutable Public State
**Файл**: `api/utils/logger.ts:90-96`

Методы меняют состояние. Не используются в коде (проверить через grep).

**Рефакторинг**: **Remove Dead Code** (если не используются) или сделать `readonly enabled` + создать новый инстанс через фабрику.

---

## Этап 5. Утилиты, fixtures, типы (P2)

### 5.1. Side effect при импорте в `envUtils.ts`

**Запах**: Hidden Side Effect, Module-Level Mutation
**Файл**: `api/utils/envUtils.ts:1-5`

`dotenv.config()` вызывается на верхнем уровне при импорте. Любой импорт `requireEnv` молча конфигурирует dotenv.

**Рефакторинг**: **Move Statements into Function** — экспортировать `initEnv()` и вызывать явно в `playwright.config.ts`. Или оставить, но задокументировать как намеренное поведение.

### 5.2. `requireEnv(name: string)` — нет типизации имён переменных

**Запах**: Primitive Obsession
**Файл**: `api/utils/envUtils.ts:7`

`name: string` — можно передать опечатку.

**Рефакторинг**: **Replace Primitive with Object** — branded type `EnvVarName` или объединить с конфигом:

```typescript
const ENV_VARS = {
  API_KEY: "API_KEY",
  BASE_URL_AUTH: "BASE_URL_AUTH",
  // ...
} as const;

type EnvVarName = typeof ENV_VARS[keyof typeof ENV_VARS];

export const requireEnv = (name: EnvVarName): string => { /* ... */ };
```

### 5.3. `getAuthHeaders` — switch без default

**Запах**: Implicit Fallthrough Risk, Missing Exhaustiveness Check
**Файл**: `api/utils/headerUtils.ts:15-22`

Switch по enum работает, но при добавлении нового `UserRole` компилятор не укажет на непокрытую ветвь (нет `never`-проверки).

**Рефакторинг**: **Replace Conditional with Polymorphism** (через discriminated union) или добавить exhaustiveness check:

```typescript
export const getAuthHeaders = (role: UserRole): Record<string, string> => {
  switch (role) {
    case UserRole.AUTHORIZED:
      return { "x-rapidapi-key": requireEnv("API_KEY") };
    case UserRole.GUEST:
      return {};
    default: {
      const _exhaustive: never = role;
      throw new Error(`Unknown role: ${_exhaustive}`);
    }
  }
};
```

### 5.4. Пустой деструктор в fixtures

**Запах**: Code Smell (minor), Inconsistent Style
**Файл**: `api/fixtures/fixtures.ts:30`

```30:30:api/fixtures/fixtures.ts
  requestAssertions: async ({}, use) => {
```

`{}` — пустой объект, не несёт смысла.

**Рефакторинг**: убрать деструктор: `async (use) => { await use(new RequestAssertions(expect)); }`.

### 5.5. Дублирование создания клиентов в fixtures

**Запах**: Duplicate Code
**Файл**: `api/fixtures/fixtures.ts:22-28`

`albumsApiClient` и `hockeyApiClient` создаются идентично.

**Рефакторинг**: **Extract Function** — обобщённая фабрика:

```typescript
function createClient<T extends BaseApiClient>(
  ctor: new (request: APIRequestContext, role: UserRole, baseURL: string) => T,
) {
  return async ({ request, role, baseURL }: { request: APIRequestContext; role: UserRole; baseURL?: string }, use: (c: T) => Promise<void>) => {
    if (!baseURL) throw new Error("baseURL is required");
    await use(new ctor(request, role, baseURL));
  };
}
```

### 5.6. `CountryCode` делает `toUpperCase()` в конструкторе branded type

**Запах**: Hidden Mutation, Surprising Behavior
**Файл**: `api/types/common/index.ts:11`

```11:11:api/types/common/index.ts
export const CountryCode = (code: string): CountryCode => code.toUpperCase() as CountryCode;
```

Конструктор типа молча нормализует ввод. Это удобно, но неожиданно и нарушает принцип «branded type = identity».

**Рефакторинг**: либо документировать поведение, либо разделить: `CountryCode(code: string)` — pure brand, `normalizeCountryCode(code: string): CountryCode` — с нормализацией.

---

## Этап 6. Строгость TypeScript-конфигурации (P2)

### 6.1. `noPropertyAccessFromIndexSignature: false`

**Запах**: Weakened Type Safety
**Файл**: `tsconfig.json:18`

Опция отключена, что разрешает доступ через точку к индексным сигнатурам без проверки.

**Рефакторинг**: включить `true` для большей строгости (потребует правок в коде, использующем индексные сигнатуры — оценить объём).

### 6.2. `verbatimModuleSyntax: true` уже включён

Хорошо — форсирует `import type` для типов. Сохранить.

### 6.3. Нет `exactOptionalPropertyTypes`

**Запах**: Optional Property Ambiguity
**Файл**: `tsconfig.json`

Не включено — различие между `prop?: T` и `prop: T | undefined` размыто.

**Рефакторинг**: оценить включение `exactOptionalPropertyTypes: true` (может потребовать правок в опциональных полях, например `ValidationOptions`).

---

## Сводка по приоритетам

| Приоритет | Кол-во | Краткое содержание |
|-----------|--------|-------------------|
| **P0** | 4 | Типобезопасность URL (2.1, 2.2), type guard HttpStatusCode (2.3), дублирование валидации (3.1), разрыв validator/assertions (3.2) |
| **P1** | 8 | Мёртвый код (1.1-1.5), мёртвые ветви sendRequest (3.4), baseURL throw (3.5), magic boolean (3.6), logResponse (4.1), statusText (4.2), test.step в клиентах (3.3) |
| **P2** | 7 | requestStartTime (4.3), formatObject (4.4), enable/disable (4.5), env side effect (5.1), requireEnv типизация (5.2), switch exhaustiveness (5.3), fixtures (5.4-5.5), CountryCode (5.6), tsconfig (6.1, 6.3) |
| **P3** | — | стилистические |

## Рекомендуемый порядок выполнения

1. **Этап 1** — быстрые правки, низкий риск, сразу улучшают читаемость. Запустить `npm run lint && npm run typecheck` после.
2. **Этап 2** — типобезопасность URL. Самый высокий ROI, но требует миграции всех вызовов `stringFormat`. Делать после этапа 1.
3. **Этап 3.1, 3.2** — объединение валидации. Затрагивает `RequestAssertions`, `ApiResponseValidator`, тесты. Делать осторожно, с прогоном тестов.
4. **Этап 3.3-3.6** — правки `BaseApiClient`. Совместить с этапом 3.1/3.2.
5. **Этап 4** — логгер. Изолированно, низкий риск.
6. **Этап 5** — утилиты и fixtures. После стабилизации API-клиентов.
7. **Этап 6** — tsconfig. Последним, после всех правок, чтобы избежать каскадных ошибок типизации.

## Правила безопасного рефакторинга (по скиллу)

1. **Наличие тестов** — перед каждым этапом: `npm run test:api:no_oauth` (не требует `API_KEY`).
2. **Маленькие шаги** — один пункт плана = один коммит.
3. **compile → test → commit** после каждого шага.
4. **Правило трёх раз** — если дублирование встречается 3+ раза, обязательно извлекать (см. 3.1, 5.5).

## Что не вошло в план (намеренно)

- Миграция enum `UserRole` на discriminated union — текущая реализация достаточна, добавит сложности без явной выгоды.
- Замена `ajv` на `zod` во всём проекте — оба валидатора используются осознанно (разные API), унификация не является целью.
- Введение DI-контейнера — избыточно для тестового фреймворка такого размера.
