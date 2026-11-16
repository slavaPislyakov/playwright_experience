# API: типы запросов и схемы ответов

Валидатор — **Zod**: все тесты проверяют JSONPlaceholder. (Контур AJV удалён 04.11.2026 как неиспользуемый; при появлении API со строгой JSON Schema — вернуть по паттерну: интерфейс + `JSONSchemaType<T>`, `required` на все поля, `additionalProperties: false`.)

## Типы запросов — `api/types/request/<провайдер>/<ресурс>/<ресурс>Requests.ts`

Только для мутирующих методов (POST/PUT/PATCH). Плоские интерфейсы, файл на ресурс. PATCH — все поля опциональны:

```typescript
export interface CreateTodoRequest {
  userId: number;
  title: string;
  completed: boolean;
}

export interface PatchTodoRequest {
  title?: string;
  completed?: boolean;
}
```

Важно для echo-API вроде JSONPlaceholder: POST-ответ возвращает **только отправленные поля** плюс сгенерированный `id`. Если схема ответа требует поле, его надо отправлять в запросе — поэтому `completed` здесь обязателен, иначе строгая валидация POST-ответа упадёт.

## Схемы ответов Zod — `.../response/<провайдер>/<ресурс>/zod/<ресурс>Schemas.ts`

`z.strictObject` (лишние поля отклоняются), рядом тип через `z.infer`, массив — отдельно:

```typescript
export const TodoSchema = z.strictObject({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

export type Todo = z.infer<typeof TodoSchema>;

export const TodosArraySchema = z.array(TodoSchema);
```

Пустой ответ DELETE описывается явно: `export const EmptyTodoResponseSchema = z.strictObject({});` с комментарием-объяснением.

## Схемы ошибок

Схема ошибки — тоже схема: для негативного теста валидируется тело ошибки. См. `api/types/response/jsonplaceholder/error/zod/errorSchemas.ts`.

## Главное правило strict-валидации

Прежде чем писать схему, посмотри **реальный** ответ (в логах `ApiLogger`, curl или в существующих спеках): strict-схема честно падает на любом лишнем поле. Например, объект `/users` у JSONPlaceholder содержит не только `id/name/username/email`, но и `address/phone/website/company` — схема по «здравому смыслу» без этих полей провалит валидацию. Это не баг, а назначение строгой валидации: «протечка» лишних полей в ответе должна быть замечена. Если поля нужно игнорировать — это осознанное решение, а не дефолт.

Применение схем в тестах — [assertions.md](assertions.md).
