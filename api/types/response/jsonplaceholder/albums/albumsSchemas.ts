import z from "zod";

export const AlbumSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
});

export const AlbumsArraySchema = z.array(AlbumSchema);

export const AlbumPhotosSchema = z.array(z.object({
  albumId: z.number(),
  id: z.number(),
  title: z.string(),
  url: z.string(),
  thumbnailUrl: z.string(),
}));
