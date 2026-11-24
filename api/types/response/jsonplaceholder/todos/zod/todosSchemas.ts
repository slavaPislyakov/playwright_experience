import { z } from "zod";

export const TodoSchema = z.strictObject({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

export type Todo = z.infer<typeof TodoSchema>;

export const TodosArraySchema = z.array(TodoSchema);

export type TodosArray = z.infer<typeof TodosArraySchema>;

// JSONPlaceholder на DELETE отвечает 200 с пустым телом-объектом {} (эхо-API), а не 204 без тела — strict-схема фиксирует это
export const EmptyTodoResponseSchema = z.strictObject({});

export type EmptyTodoResponse = z.infer<typeof EmptyTodoResponseSchema>;
