import { test } from "@@/api/fixtures/fixtures";

import { getAlbumPhotosSchema, getAlbumSchema, getAllAlbumsSchema } from "@@/api/types/response/albums/albumsSchemas";

test.describe("Check 'ALBUMS' endpoint", () => {
  test("Check 'GET /albums' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAllAlbums();

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchema(getAllAlbumsSchema, await response.json());
  });

  test("Check 'GET /albums/{number}' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAlbumByNumber(1);

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchema(getAlbumSchema, await response.json());
  });

  test("Check 'GET /albums/{number}/photos' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAlbumPhotosByNumber(1);

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchema(getAlbumPhotosSchema, await response.json());
  });
});
