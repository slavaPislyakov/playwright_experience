export type AlbumId = number & { readonly __brand: unique symbol };

export const AlbumId = (id: number): AlbumId => id as AlbumId;

export type CountryCode = string & { readonly __brand: unique symbol };

export const CountryCode = (code: string): CountryCode => code.toUpperCase() as CountryCode;
