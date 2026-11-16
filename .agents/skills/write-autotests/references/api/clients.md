# API: клиенты

Клиент наследует `BaseApiClient` (`api/clients/baseApiClient.ts`) — базовый класс инкапсулирует HTTP-методы (`getMethod`/`postMethod`/`putMethod`/`patchMethod`/`deleteMethod`), мерж заголовков, авторизацию по роли и логирование с маскировкой секретных заголовков. Конкретный клиент (`api/clients/<провайдер>ApiClient.ts`) содержит только методы эндпоинтов и остаётся тонким.

Правила метода эндпоинта:

- Имя-глагол: `get*`, `create*` (POST), `update*` (PUT), `patch*` (PATCH), `delete*` (DELETE).
- Вызов protected-метода базового класса с путём из `URLS` (см. [urls.md](urls.md)).
- Обёртка в `test.step` с человекочитаемым названием запроса.
- Третий аргумент `test.step` — options с метаданными отчёта: `subtitle` + `params` (см. «Метаданные шага (1.63)» ниже).
- Возврат `Promise<APIResponse>` — парсинг и проверки остаются в ассертах, клиент ничего не проверяет.
- Тело запроса типизировано типом из `api/types/request/...` (см. [schemas.md](schemas.md)) — `unknown` не проходит по ESLint.

```typescript
export class TodosApiClient extends BaseApiClient {
  getAllTodos(): Promise<APIResponse> {
    return test.step("Get all todos request", () => this.getMethod(URLS.TODOS.TODOS_ALL), {
      subtitle: URLS.TODOS.TODOS_ALL,
    });
  }

  getTodoById(id: TodoId): Promise<APIResponse> {
    return test.step(`Get todo by id "${id}" request`, () => this.getMethod(URLS.TODOS.TODOS_ID(id)), {
      subtitle: URLS.TODOS.TODOS_ID(id),
      params: { id },
    });
  }

  createTodo(todo: CreateTodoRequest): Promise<APIResponse> {
    return test.step("Create todo request", () => this.postMethod(URLS.TODOS.TODOS_ALL, todo), {
      subtitle: URLS.TODOS.TODOS_ALL,
      params: { todo },
    });
  }

  patchTodo(id: TodoId, todo: PatchTodoRequest): Promise<APIResponse> {
    return test.step(`Patch todo with id "${id}" request`, () => this.patchMethod(URLS.TODOS.TODOS_ID(id), todo), {
      subtitle: URLS.TODOS.TODOS_ID(id),
      params: { id, todo },
    });
  }

  deleteTodo(id: TodoId): Promise<APIResponse> {
    return test.step(`Delete todo with id "${id}" request`, () => this.deleteMethod(URLS.TODOS.TODOS_ID(id)), {
      subtitle: URLS.TODOS.TODOS_ID(id),
      params: { id },
    });
  }
}
```

## Метаданные шага (1.63)

`test.step` принимает третий аргумент — options (`{ box, location, timeout, params, subtitle }`). В клиентах заполняются два поля, заголовок шага не меняется:

- `subtitle` — резолвнутый путь запроса: тот же URLS-билдер/константа, что передаётся в метод (`"/posts/42"`; для фильтров виден query — `"/posts?userId=3"`).
- `params` — все аргументы метода, ключи = имена аргументов: branded-скаляры передаются как есть (`PostId` — число в рантайме), payload-объекты (`CreatePostRequest`) сериализуемы. Нет аргументов — `params` не добавляется вовсе.

```typescript
getPostById(id: PostId): Promise<APIResponse> {
  return test.step(`Get post by id "${id}" request`, () => this.getMethod(URLS.POSTS.POSTS_ID(id)), {
    subtitle: URLS.POSTS.POSTS_ID(id),
    params: { id },
  });
}
```

Импорты в клиенте: `import type { APIResponse }` + `import test` из `@playwright/test` (value-импорт нужен для `test.step`).

Новый клиент не создаётся в спеке вручную — сразу регистрируй его в фикстурах: [fixtures.md](fixtures.md).
