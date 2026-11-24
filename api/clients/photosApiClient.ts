import type { APIResponse } from "@playwright/test";
import test from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import type { PhotoId } from "@@/api/types/common/brandedTypes";

import type { CreatePhotoRequest, PatchPhotoRequest, UpdatePhotoRequest } from "@@/api/types/request/jsonplaceholder/photos/photoRequests";

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

  createPhoto(photo: CreatePhotoRequest): Promise<APIResponse> {
    return test.step("Create photo request", () => this.postMethod(URLS.PHOTOS.PHOTOS_ALL, photo), {
      subtitle: URLS.PHOTOS.PHOTOS_ALL,
      params: { photo },
    });
  }

  updatePhoto(id: PhotoId, photo: UpdatePhotoRequest): Promise<APIResponse> {
    return test.step(`Update photo with id "${id}" request`, () => {
      return this.putMethod(URLS.PHOTOS.PHOTOS_ID(id), photo);
    }, {
      subtitle: URLS.PHOTOS.PHOTOS_ID(id),
      params: { id, photo },
    });
  }

  patchPhoto(id: PhotoId, photo: PatchPhotoRequest): Promise<APIResponse> {
    return test.step(`Patch photo with id "${id}" request`, () => {
      return this.patchMethod(URLS.PHOTOS.PHOTOS_ID(id), photo);
    }, {
      subtitle: URLS.PHOTOS.PHOTOS_ID(id),
      params: { id, photo },
    });
  }

  deletePhoto(id: PhotoId): Promise<APIResponse> {
    return test.step(`Delete photo with id "${id}" request`, () => {
      return this.deleteMethod(URLS.PHOTOS.PHOTOS_ID(id));
    }, {
      subtitle: URLS.PHOTOS.PHOTOS_ID(id),
      params: { id },
    });
  }
}
