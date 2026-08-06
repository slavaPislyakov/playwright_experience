import type { APIResponse } from "@playwright/test";
import test from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import type { AlbumId } from "@@/api/types/common/brandedTypes";

export class AlbumsApiClient extends BaseApiClient {
  getAllAlbums(): Promise<APIResponse> {
    return test.step("Get all albums request", () => this.getMethod(URLS.ALBUMS.ALBUMS_ALL));
  }

  getAlbumByNumber(index: AlbumId): Promise<APIResponse> {
    return test.step(`Get album by number "${index}" request`, () => {
      return this.getMethod(URLS.ALBUMS.ALBUMS_ID(index));
    });
  }

  getAlbumPhotosByNumber(index: AlbumId): Promise<APIResponse> {
    return test.step(`Get album photos by number "${index}" request`, () => {
      return this.getMethod(URLS.ALBUMS.ALBUMS_ID_PHOTOS(index));
    });
  }
}
