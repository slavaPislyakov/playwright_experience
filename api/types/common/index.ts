// Type-safe identifiers using intersection types

// Album ID type - prevents mixing with regular numbers
export type AlbumId = number & { readonly __brand: unique symbol };

export const AlbumId = (id: number): AlbumId => id as AlbumId;

// Country Code type - prevents mixing with regular strings
export type CountryCode = string & { readonly __brand: unique symbol };

export const CountryCode = (code: string): CountryCode => code.toUpperCase() as CountryCode;

// HTTP Status codes
export type HttpStatusCode = number & { readonly __brand: unique symbol };

export const HttpStatusCode = {
  OK: 200 as HttpStatusCode,
  CREATED: 201 as HttpStatusCode,
  NO_CONTENT: 204 as HttpStatusCode,
  BAD_REQUEST: 400 as HttpStatusCode,
  UNAUTHORIZED: 401 as HttpStatusCode,
  FORBIDDEN: 403 as HttpStatusCode,
  NOT_FOUND: 404 as HttpStatusCode,
  UNPROCESSABLE_ENTITY: 422 as HttpStatusCode,
  TOO_MANY_REQUESTS: 429 as HttpStatusCode,
  INTERNAL_SERVER_ERROR: 500 as HttpStatusCode,
  BAD_GATEWAY: 502 as HttpStatusCode,
  SERVICE_UNAVAILABLE: 503 as HttpStatusCode,
} as const;

// Type guard for HttpStatusCode
export const isValidHttpStatusCode = (code: number): code is HttpStatusCode => {
  return code >= 100 && code < 600;
};
