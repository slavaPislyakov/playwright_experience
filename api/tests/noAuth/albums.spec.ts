import { test } from "@@/api/fixtures/fixtures";

import {
  AlbumPhotosSchema,
  AlbumsArraySchema,
  AlbumSchema,
} from "@@/api/types/response/jsonplaceholder/albums/zod/albumsSchemas";
import { JsonPlaceholderErrorSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { AlbumId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

test.describe("Check 'ALBUMS' endpoint (Zod validation)", () => {
  test("Check 'GET /albums' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAllAlbums();
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumsArraySchema, response);
  });

  test("Check 'GET /albums/{number}' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAlbumByNumber(AlbumId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumSchema, response);
  });

  test("Check 'GET /albums/{number}/photos' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAlbumPhotosByNumber(AlbumId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumPhotosSchema, response);
  });

  test("Check 'GET /albums/{number}' with non-existing album returns error", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAlbumByNumber(AlbumId(999999));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.NOT_FOUND);
    await requestAssertions.checkJSONResponseSchemaZod(JsonPlaceholderErrorSchema, response);
  });
});
