import { test } from "@@/api/fixtures/fixtures";

import { AlbumPhotosSchema, AlbumsArraySchema, AlbumSchema } from "@@/api/types/response/jsonplaceholder/albums/albumsSchemas";

test.describe("Check 'ALBUMS' endpoint", () => {
  test("Check 'GET /albums' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAllAlbums();

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumsArraySchema, await response.json());
  });

  test("Check 'GET /albums/{number}' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAlbumByNumber(1);

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumSchema, await response.json());
  });

  test("Check 'GET /albums/{number}/photos' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAlbumPhotosByNumber(1);

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumPhotosSchema, await response.json());
  });
});
