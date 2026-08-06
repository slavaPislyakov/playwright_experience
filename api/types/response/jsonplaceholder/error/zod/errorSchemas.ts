import { z } from "zod";

// JSONPlaceholder error response schema
// Typically returns empty object {} for 404 or simple error message
// .strict() on both branches rejects unexpected extra fields — matches the
// strictness AJV gets for free via `additionalProperties: false`.
export const JsonPlaceholderErrorSchema = z.strictObject({
  message: z.string().optional(),
}).or(z.strictObject({}));  // Sometimes returns empty object

export type JsonPlaceholderError = z.infer<typeof JsonPlaceholderErrorSchema>;
