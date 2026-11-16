# API: фикстуры

Все фикстуры — в `api/fixtures/fixtures.ts`. Спек получает клиентов и ассерты только через них: `import { test } from "@@/api/fixtures/fixtures"` (множественное число — не перепутать с UI, где `@@/ui/fixtures/fixture`).

## Добавление нового клиента — две строки

Поле в `ApiFixtures` + `createApiClient(Клиент)` (фабрика сама передаёт `request`, `role` и `baseURL`, проверяя, что `baseURL` задан):

```typescript
type ApiFixtures = {
  todosApiClient: TodosApiClient;
  // ...
};

export const test = base.extend<ApiFixtures>({
  role: [UserRole.GUEST, { option: true }],
  todosApiClient: createApiClient(TodosApiClient),
  // ...
});
```

## Роль авторизации — опция `role`

По умолчанию `UserRole.GUEST`. Для авторизованных сценариев в спеке на уровне describe:

```typescript
test.use({ role: UserRole.AUTHORIZED });
```

Механизм ролей пока не используется тестами (все текущие клиенты — `GUEST`), но остаётся готовым к добавлению авторизованного API. `API_KEY` читается лениво — только в момент, когда клиент запрашивает заголовки `AUTHORIZED` (`requireEnv("API_KEY")` внутри `getAuthHeaders`). Не выноси чтение ключа на уровень модуля — это сломает запуск проектов, которым ключ не нужен.

## Доступные фикстуры

| Фикстура | Что даёт |
|---|---|
| `albumsApiClient` | Клиент JSONPlaceholder (/albums) |
| `requestAssertions` | Ассерты статуса и схем — см. [assertions.md](assertions.md) |
| `role` | Роль авторизации для клиентов |
