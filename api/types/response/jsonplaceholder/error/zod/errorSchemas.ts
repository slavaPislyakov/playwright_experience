import { z } from "zod";

/**
 * JSONPlaceholder отвечает на 404 (и DELETE) пустым объектом `{}` —
 * честный контракт описывает только это. Union со схемой `message`
 * принимал почти что угодно и делал проверку 404 фиктивной.
 */
export const EmptyJsonPlaceholderResponseSchema = z.strictObject({});

export type EmptyJsonPlaceholderResponse = z.infer<typeof EmptyJsonPlaceholderResponseSchema>;
