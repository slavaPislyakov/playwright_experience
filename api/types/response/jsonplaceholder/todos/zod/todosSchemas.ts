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
