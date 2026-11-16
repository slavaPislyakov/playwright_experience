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
