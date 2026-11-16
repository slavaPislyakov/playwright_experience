import { z } from "zod";

export const PostSchema = z.strictObject({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export type Post = z.infer<typeof PostSchema>;

export const PostsArraySchema = z.array(PostSchema);

export type PostsArray = z.infer<typeof PostsArraySchema>;

export const EmptyPostResponseSchema = z.strictObject({});

export type EmptyPostResponse = z.infer<typeof EmptyPostResponseSchema>;
