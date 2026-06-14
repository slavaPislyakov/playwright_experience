import { test } from "@@/api/fixtures/fixtures";

import {
  AlbumPhotosSchema,
  AlbumsArraySchema,
  AlbumSchema,
} from "@@/api/types/response/jsonplaceholder/albums/zod/albumsSchemas";
import { JsonPlaceholderErrorSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { AlbumId, HttpStatusCode } from "@@/api/types/common";

test.describe("Check 'ALBUMS' endpoint (Zod validation)", () => {
  test("Check 'GET /albums' endpoint", async ({ albumsApiClient, responseValidator }) => {
    const response = await albumsApiClient.getAllAlbums();
    await responseValidator.validateResponse(response, { schema: AlbumsArraySchema });
  });

  test("Check 'GET /albums/{number}' endpoint", async ({ albumsApiClient, responseValidator }) => {
    const response = await albumsApiClient.getAlbumByNumber(AlbumId(1));
    await responseValidator.validateResponse(response, { schema: AlbumSchema });
  });

  test("Check 'GET /albums/{number}/photos' endpoint", async ({ albumsApiClient, responseValidator }) => {
    const response = await albumsApiClient.getAlbumPhotosByNumber(AlbumId(1));
    await responseValidator.validateResponse(response, { schema: AlbumPhotosSchema });
  });

  test("Check 'GET /albums/{number}' with non-existing album returns error", async ({ albumsApiClient, responseValidator }) => {
    const response = await albumsApiClient.getAlbumByNumber(AlbumId(999999));
    await responseValidator.validateResponse(response, {
      statusCode: HttpStatusCode.NOT_FOUND,
      schema: JsonPlaceholderErrorSchema,
    });
  });
});
