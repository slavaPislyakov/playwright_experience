import { z } from "zod";

export const CommentSchema = z.strictObject({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
});

export type Comment = z.infer<typeof CommentSchema>;

export const CommentsArraySchema = z.array(CommentSchema);

export type CommentsArray = z.infer<typeof CommentsArraySchema>;

// JSONPlaceholder на DELETE отвечает 200 с пустым телом-объектом {} (эхо-API), а не 204 без тела — strict-схема фиксирует это
export const EmptyCommentResponseSchema = z.strictObject({});

export type EmptyCommentResponse = z.infer<typeof EmptyCommentResponseSchema>;
