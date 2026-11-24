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

// JSONPlaceholder на DELETE отвечает 200 с пустым телом-объектом {} (эхо-API), а не 204 без тела — strict-схема фиксирует это
export const EmptyPhotoResponseSchema = z.strictObject({});

export type EmptyPhotoResponse = z.infer<typeof EmptyPhotoResponseSchema>;
