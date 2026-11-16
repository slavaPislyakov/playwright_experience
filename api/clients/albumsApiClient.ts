import type { APIResponse } from "@playwright/test";
import test from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import type { CreateAlbumRequest, PatchAlbumRequest, UpdateAlbumRequest } from "@@/api/types/request/jsonplaceholder/albums/albumRequests";

import type { AlbumId } from "@@/api/types/common/brandedTypes";

export class AlbumsApiClient extends BaseApiClient {
  getAllAlbums(): Promise<APIResponse> {
    return test.step("Get all albums request", () => this.getMethod(URLS.ALBUMS.ALBUMS_ALL), {
      subtitle: URLS.ALBUMS.ALBUMS_ALL,
    });
  }

  getAlbumByNumber(index: AlbumId): Promise<APIResponse> {
    return test.step(`Get album by number "${index}" request`, () => {
      return this.getMethod(URLS.ALBUMS.ALBUMS_ID(index));
    }, {
      subtitle: URLS.ALBUMS.ALBUMS_ID(index),
      params: { index },
    });
  }

  getAlbumPhotosByNumber(index: AlbumId): Promise<APIResponse> {
    return test.step(`Get album photos by number "${index}" request`, () => {
      return this.getMethod(URLS.ALBUMS.ALBUMS_ID_PHOTOS(index));
    }, {
      subtitle: URLS.ALBUMS.ALBUMS_ID_PHOTOS(index),
      params: { index },
    });
  }

  createAlbum(album: CreateAlbumRequest): Promise<APIResponse> {
    return test.step("Create album request", () => this.postMethod(URLS.ALBUMS.ALBUMS_ALL, album), {
      subtitle: URLS.ALBUMS.ALBUMS_ALL,
      params: { album },
    });
  }

  updateAlbum(index: AlbumId, album: UpdateAlbumRequest): Promise<APIResponse> {
    return test.step(`Update album with number "${index}" request`, () => {
      return this.putMethod(URLS.ALBUMS.ALBUMS_ID(index), album);
    }, {
      subtitle: URLS.ALBUMS.ALBUMS_ID(index),
      params: { index, album },
    });
  }

  patchAlbum(index: AlbumId, album: PatchAlbumRequest): Promise<APIResponse> {
    return test.step(`Patch album with number "${index}" request`, () => {
      return this.patchMethod(URLS.ALBUMS.ALBUMS_ID(index), album);
    }, {
      subtitle: URLS.ALBUMS.ALBUMS_ID(index),
      params: { index, album },
    });
  }

  deleteAlbum(index: AlbumId): Promise<APIResponse> {
    return test.step(`Delete album with number "${index}" request`, () => {
      return this.deleteMethod(URLS.ALBUMS.ALBUMS_ID(index));
    }, {
      subtitle: URLS.ALBUMS.ALBUMS_ID(index),
      params: { index },
    });
  }
}
