# API: анатомия спека

Файл: `api/tests/noAuth/<ресурс>.spec.ts` (camelCase, по ресурсу). Порядок импортов: `test` из фикстур → схемы → common-типы (`import` значения) → `import type` запросов. Пустые строки между импортами расставит `npm run lint:fix`.

## Структура

- Positive-проверки — describe `Check '<РЕСУРС>' endpoint (Zod validation)`.
- Мутации (POST/PUT/PATCH/DELETE) — отдельный describe `Check '<РЕСУРС>' endpoint mutations (Zod validation)`.
- Негативный сценарий — отдельный тест с ожидаемым статусом и схемой ошибки: `... with non-existing <ресурс> returns error`.
- Имя теста повторяет HTTP-метод и путь: `Check 'GET /todos' endpoint`, `Check 'POST /albums' endpoint`.
- Тестовые данные мутирующих запросов — константы с явной аннотацией типа на уровне describe.
- Тело: запрос через клиента → `checkStatusCode` → `checkJSONResponseSchema*`. Ничего больше.

## Работающий пример

```typescript
import { test } from "@@/api/fixtures/fixtures";

import { TodosArraySchema } from "@@/api/types/response/jsonplaceholder/todos/zod/todosSchemas";

import { JsonPlaceholderErrorSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { TodoId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

import type { CreateTodoRequest } from "@@/api/types/request/jsonplaceholder/todos/todoRequests";

test.describe("Check 'TODOS' endpoint (Zod validation)", () => {
  test("Check 'GET /todos' endpoint", async ({ todosApiClient, requestAssertions }) => {
    const response = await todosApiClient.getAllTodos();
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(TodosArraySchema, response);
  });

  test("Check 'GET /todos/{id}' with non-existing todo returns error", async ({ todosApiClient, requestAssertions }) => {
    const response = await todosApiClient.getTodoById(TodoId(999999));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.NOT_FOUND);
    await requestAssertions.checkJSONResponseSchemaZod(JsonPlaceholderErrorSchema, response);
  });
});

test.describe("Check 'TODOS' endpoint mutations (Zod validation)", () => {
  const createTodoRequest: CreateTodoRequest = { userId: 1, title: "New todo created by automated test", completed: false };

  test("Check 'POST /todos' endpoint", async ({ todosApiClient, requestAssertions }) => {
    const response = await todosApiClient.createTodo(createTodoRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.CREATED);
    await requestAssertions.checkJSONResponseSchemaZod(TodoSchema, response);
  });
});
```

## Переменные окружения

Новые переменные читаются через `optionalEnv` (в `playwright.config.ts`, если нужна для проекта) или `requireEnv` (в момент использования, если обязательна). Не обращайся к `process.env` точечной нотацией — включён `noPropertyAccessFromIndexSignature`, только скобки: `process.env["NAME"]`. `.env` не коммитится.

## Чек-лист перед сдачей

- [ ] Спек не содержит URL, числовых статусов и сырого `expect`
- [ ] Схемы строгие (`strictObject` / `additionalProperties: false`), типы выведены `z.infer`
- [ ] Клиентские методы обёрнуты в `test.step`, имена-глаголы
- [ ] Новые `check*`-ассерты добавлены в `assertFunctionPatterns`
- [ ] `npm run typecheck && npm run lint` зелёные, тест реально запущен: `npx playwright test <файл> --project=<проект>`
