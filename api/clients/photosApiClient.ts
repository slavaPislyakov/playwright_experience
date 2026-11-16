import type { APIResponse } from "@playwright/test";
import test from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import type { PhotoId } from "@@/api/types/common/brandedTypes";

export class PhotosApiClient extends BaseApiClient {
  getAllPhotos(): Promise<APIResponse> {
    return test.step("Get all photos request", () => this.getMethod(URLS.PHOTOS.PHOTOS_ALL), {
      subtitle: URLS.PHOTOS.PHOTOS_ALL,
    });
  }

  getPhotoById(id: PhotoId): Promise<APIResponse> {
    return test.step(`Get photo by id "${id}" request`, () => this.getMethod(URLS.PHOTOS.PHOTOS_ID(id)), {
      subtitle: URLS.PHOTOS.PHOTOS_ID(id),
      params: { id },
    });
  }
}
