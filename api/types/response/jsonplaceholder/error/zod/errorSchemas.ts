import { z } from "zod";

// JSONPlaceholder error response schema
// Typically returns empty object {} for 404 or simple error message
export const JsonPlaceholderErrorSchema = z.object({
  message: z.string().optional(),
}).or(z.object({}));  // Sometimes returns empty object

export type JsonPlaceholderError = z.infer<typeof JsonPlaceholderErrorSchema>;
