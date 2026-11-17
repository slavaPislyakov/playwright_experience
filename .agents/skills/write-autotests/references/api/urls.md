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

export const TodoId = (id: number): TodoId => id as TodoId;
```

Строковые идентификаторы (коды стран и т.п.) — тот же паттерн с `string & { readonly __brand: unique symbol }`; добавляй по мере появления в тестируемых API.

> Ограничение branded-типов: конструктор не валидирует значение — `TodoId(-42)` «валиден». Бренд защищает от перепутанных аргументов, а не от мусорных значений; для REST-идентификаторов этого достаточно.

Дальше по цепочке: схемы ответов — [schemas.md](schemas.md), метод клиента — [clients.md](clients.md).
