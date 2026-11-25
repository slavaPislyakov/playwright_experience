# API: маршруты и branded-типы

## Маршруты — `api/data/urls.ts`

Единственное место, где собираются пути. Объект по провайдеру, константа или функция-билдер, параметры — branded-типы, весь объект `as const`:

```typescript
import type { AlbumId, TodoId } from "@@/api/types/common/brandedTypes";

export const URLS = {
  ALBUMS: {
    ALBUMS_ALL: "/albums",
    ALBUMS_ID: (id: AlbumId): string => `/albums/${id}`,
  },
  TODOS: {
    TODOS_ALL: "/todos",
    TODOS_ID: (id: TodoId): string => `/todos/${id}`,
  },
} as const;
```

Спек никогда не содержит URL — только вызов метода клиента. Путь с параметром — всегда билдер-функция, не конкатенация строк в клиенте.

## Branded-типы — `api/types/common/brandedTypes.ts`

Branded-типы не позволяют передать «сырой» number/string туда, где ожидается идентификатор: `getTodoById(1)` не скомпилируется, `getTodoById(TodoId(1))` — да. Новые идентификаторы добавляй по тому же образцу — type + конструктор с тем же именем:

```typescript
export type TodoId = number & { readonly __brand: unique symbol };

export const TodoId = (id: number): TodoId => {
  assertPositiveIntId("TodoId", id);

  return id as TodoId;
};
```

Строковые идентификаторы (коды стран и т.п.) — тот же паттерн с `string & { readonly __brand: unique symbol }`; добавляй по мере появления в тестируемых API.

> Защита в два слоя: бренд на этапе компиляции не даёт перепутать аргументы (`getTodoById(UserId(1))` не скомпилируется), а конструктор в рантайме отбрасывает мусорные значения — общий хелпер `assertPositiveIntId` в начале того же файла требует целое число ≥ 1 и бросает `Error` для остальных (`TodoId(-42)`). Новый идентификатор добавляй с той же проверкой.

Дальше по цепочке: схемы ответов — [schemas.md](schemas.md), метод клиента — [clients.md](clients.md).
