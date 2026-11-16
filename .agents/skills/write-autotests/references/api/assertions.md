# API: ассерты

Проверки живут в `api/assertions/RequestAssertions.ts`, спек вызывает их через фикстуру `requestAssertions`. В тесте ровно два вида проверок — статус и схема:

```typescript
await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
await requestAssertions.checkJSONResponseSchemaZod(TodosArraySchema, response);
```

- Статус — только через enum `HttpStatusCode` (`api/types/common/httpStatusCode.ts`), никогда числом.
- Схема — только через `checkJSONResponseSchemaZod`; сырой `response.json()` + ручной разбор в спеке не используется.
- Каждый ассерт уже обёрнут в `test.step` внутри `RequestAssertions` — в спеке дополнительно оборачивать не нужно.

## Расширение

Новый метод-ассерт:

1. Имя `check*`, сигнатура в стиле существующих, внутри — `test.step` и `this.expect(...)`.
2. Обязательно добавь имя в `eslint.config.mjs` → `playwright/expect-expect` → `assertFunctionPatterns` — иначе линт начнёт требовать сырой `expect` в каждом спеке, который вызывает новый ассерт.

Ошибки валидации уже форматируются человекочитаемо (`ValidationResult` со списком ошибок по путям) — не дублируй их разбор в спеке.
