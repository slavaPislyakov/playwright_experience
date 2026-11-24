import { test } from "@@/api/fixtures/fixtures";

import {
  EmptyPhotoResponseSchema,
  PhotoSchema,
  PhotosArraySchema,
} from "@@/api/types/response/jsonplaceholder/photos/zod/photosSchemas";

import { EmptyJsonPlaceholderResponseSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { PhotoId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

import type {
  CreatePhotoRequest,
  PatchPhotoRequest,
  UpdatePhotoRequest,
} from "@@/api/types/request/jsonplaceholder/photos/photoRequests";

test.describe("Check 'PHOTOS' endpoint (Zod validation)", () => {
  test("Check 'GET /photos' endpoint", async ({ photosApiClient, requestAssertions }) => {
    const response = await photosApiClient.getAllPhotos();
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(PhotosArraySchema, response);
  });

  test("Check 'GET /photos/{id}' endpoint", async ({ photosApiClient, requestAssertions }) => {
    const response = await photosApiClient.getPhotoById(PhotoId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(PhotoSchema, response);
  });

  test("Check 'GET /photos/{id}' with non-existing photo returns error", async ({ photosApiClient, requestAssertions }) => {
    const response = await photosApiClient.getPhotoById(PhotoId(999999));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.NOT_FOUND);
    await requestAssertions.checkJSONResponseSchemaZod(EmptyJsonPlaceholderResponseSchema, response);
  });
});

test.describe("Check 'PHOTOS' endpoint mutations (Zod validation)", () => {
  const createPhotoRequest: CreatePhotoRequest = {
    albumId: 1,
    title: "New photo created by automated test",
    url: "https://via.placeholder.com/600/92c952",
    thumbnailUrl: "https://via.placeholder.com/150/92c952",
  };

  const updatePhotoRequest: UpdatePhotoRequest = {
    albumId: 1,
    title: "Photo updated by automated test",
    url: "https://via.placeholder.com/600/771796",
    thumbnailUrl: "https://via.placeholder.com/150/771796",
  };

  const patchPhotoRequest: PatchPhotoRequest = { title: "Photo title patched by automated test" };

  test("Check 'POST /photos' endpoint", async ({ photosApiClient, requestAssertions }) => {
    const response = await photosApiClient.createPhoto(createPhotoRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.CREATED);
    await requestAssertions.checkJSONResponseSchemaZod(PhotoSchema, response);
  });

  test("Check 'PUT /photos/{id}' endpoint", async ({ photosApiClient, requestAssertions }) => {
    const response = await photosApiClient.updatePhoto(PhotoId(1), updatePhotoRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(PhotoSchema, response);
  });

  test("Check 'PATCH /photos/{id}' endpoint", async ({ photosApiClient, requestAssertions }) => {
    const response = await photosApiClient.patchPhoto(PhotoId(1), patchPhotoRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(PhotoSchema, response);
  });

  test("Check 'DELETE /photos/{id}' endpoint", async ({ photosApiClient, requestAssertions }) => {
    const response = await photosApiClient.deletePhoto(PhotoId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(EmptyPhotoResponseSchema, response);
  });
});
