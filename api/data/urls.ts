import type { AlbumId, CountryCode } from "@@/api/types/common/brandedTypes";

export const URLS = {
  API_SPORTS: {
    COUNTRY_CODE: (code: CountryCode): string => `/countries/${code}`,
  },
  ALBUMS: {
    ALBUMS_ALL: "/albums",
    ALBUMS_ID: (id: AlbumId): string => `/albums/${id}`,
    ALBUMS_ID_PHOTOS: (id: AlbumId): string => `/albums/${id}/photos`,
  },
} as const;
