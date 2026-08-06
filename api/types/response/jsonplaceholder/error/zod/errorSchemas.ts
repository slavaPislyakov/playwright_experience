import { z } from "zod";

export const JsonPlaceholderErrorSchema = z.strictObject({
  message: z.string().optional(),
}).or(z.strictObject({}));

export type JsonPlaceholderError = z.infer<typeof JsonPlaceholderErrorSchema>;
