import { test } from "@@/api/fixtures/fixtures";

import { PhotoSchema, PhotosArraySchema } from "@@/api/types/response/jsonplaceholder/photos/zod/photosSchemas";

import { EmptyJsonPlaceholderResponseSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { PhotoId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

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
