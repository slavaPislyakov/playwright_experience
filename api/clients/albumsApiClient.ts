import test, { APIRequestContext, APIResponse } from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import { UserRole } from "@@/api/utils/headerUtils";
import { stringFormat } from "@@/api/utils/stringUtils";

export class AlbumsApiClient extends BaseApiClient {
  constructor(request: APIRequestContext, role: UserRole) {
    super(request, role);
  }

  async getAllAlbums(): Promise<APIResponse> {
    return await test.step("Get all albums request", async () => {
      return await this.getMethod(URLS.ALBUMS.ALBUMS_ALL);
    });
  }

  async getAlbumByNumber(index: number): Promise<APIResponse> {
    return await test.step(`Get album by number "${index}" request`, async () => {
      const url = stringFormat(URLS.ALBUMS.ALBUMS_ID, index);

      return await this.getMethod(url);
    });
  }

  async getAlbumPhotosByNumber(index: number): Promise<APIResponse> {
    return await test.step(`Get album photos by number "${index}" request`, async () => {
      const url = stringFormat(URLS.ALBUMS.ALBUMS_ID_PHOTOS, index);

      return await this.getMethod(url);
    });
  }
}
