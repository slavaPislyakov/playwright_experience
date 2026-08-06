import { z } from "zod";

export const AlbumSchema = z.strictObject({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
});

export type Album = z.infer<typeof AlbumSchema>;

export const AlbumsArraySchema = z.array(AlbumSchema);

export type AlbumsArray = z.infer<typeof AlbumsArraySchema>;

export const AlbumPhotoSchema = z.strictObject({
  albumId: z.number(),
  id: z.number(),
  title: z.string(),
  url: z.string(),
  thumbnailUrl: z.string(),
});

export type AlbumPhoto = z.infer<typeof AlbumPhotoSchema>;

export const AlbumPhotosSchema = z.array(AlbumPhotoSchema);

export type AlbumPhotos = z.infer<typeof AlbumPhotosSchema>;
