import { test } from "@@/api/fixtures/fixtures";

import {
  AlbumPhotosSchema,
  AlbumsArraySchema,
  AlbumSchema,
  EmptyAlbumResponseSchema,
} from "@@/api/types/response/jsonplaceholder/albums/zod/albumsSchemas";

import { EmptyJsonPlaceholderResponseSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { AlbumId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

import type {
  CreateAlbumRequest,
  PatchAlbumRequest,
  UpdateAlbumRequest,
} from "@@/api/types/request/jsonplaceholder/albums/albumRequests";

test.describe("Check 'ALBUMS' endpoint (Zod validation)", () => {
  test("Check 'GET /albums' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.getAllAlbums();
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumsArraySchema, response);
  });

  test("Check 'GET /albums/{number}' endpoint @smoke", async ({ albumsApiClient, requestAssertions }) => {
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
    await requestAssertions.checkJSONResponseSchemaZod(EmptyJsonPlaceholderResponseSchema, response);
  });
});

test.describe("Check 'ALBUMS' endpoint mutations (Zod validation)", () => {
  const createAlbumRequest: CreateAlbumRequest = { userId: 1, title: "New album created by automated test" };
  const updateAlbumRequest: UpdateAlbumRequest = { userId: 2, title: "Album updated by automated test" };
  const patchAlbumRequest: PatchAlbumRequest = { title: "Album patched by automated test" };

  test("Check 'POST /albums' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.createAlbum(createAlbumRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.CREATED);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumSchema, response);
  });

  test("Check 'PUT /albums/{number}' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.updateAlbum(AlbumId(1), updateAlbumRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumSchema, response);
  });

  test("Check 'PATCH /albums/{number}' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.patchAlbum(AlbumId(1), patchAlbumRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumSchema, response);
  });

  test("Check 'DELETE /albums/{number}' endpoint", async ({ albumsApiClient, requestAssertions }) => {
    const response = await albumsApiClient.deleteAlbum(AlbumId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(EmptyAlbumResponseSchema, response);
  });
});
