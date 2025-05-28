import { JSONSchemaType } from "ajv";

import { IAlbum, IAlbumPhotos } from "@@/api/types/response/albums/albumsInterface";

export const getAllAlbumsSchema: JSONSchemaType<IAlbum[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      userId: {
        type: "number",
      },
      id: {
        type: "number",
      },
      title: {
        type: "string",
      },
    },
    required: ["userId", "id", "title"],
  },
};

export const getAlbumSchema: JSONSchemaType<IAlbum> = {
  type: "object",
  properties: {
    userId: {
      type: "number",
    },
    id: {
      type: "number",
    },
    title: {
      type: "string",
    },
  },
  required: ["userId", "id", "title"],
};

export const getAlbumPhotosSchema: JSONSchemaType<IAlbumPhotos[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      albumId: {
        type: "number",
      },
      id: {
        type: "number",
      },
      title: {
        type: "string",
      },
      url: {
        type: "string",
      },
      thumbnailUrl: {
        type: "string",
      },
    },
    required: ["albumId", "id", "title", "url", "thumbnailUrl"],
  },
};
