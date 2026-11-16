import { z } from "zod";

export const PhotoSchema = z.strictObject({
  albumId: z.number(),
  id: z.number(),
  title: z.string(),
  url: z.string(),
  thumbnailUrl: z.string(),
});

export type Photo = z.infer<typeof PhotoSchema>;

export const PhotosArraySchema = z.array(PhotoSchema);

export type PhotosArray = z.infer<typeof PhotosArraySchema>;
