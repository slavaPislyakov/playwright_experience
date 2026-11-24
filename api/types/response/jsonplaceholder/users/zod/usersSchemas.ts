import { z } from "zod";

export const UserGeoSchema = z.strictObject({
  lat: z.string(),
  lng: z.string(),
});

export type UserGeo = z.infer<typeof UserGeoSchema>;

export const UserAddressSchema = z.strictObject({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: UserGeoSchema,
});

export type UserAddress = z.infer<typeof UserAddressSchema>;

export const UserCompanySchema = z.strictObject({
  name: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
});

export type UserCompany = z.infer<typeof UserCompanySchema>;

export const UserSchema = z.strictObject({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  address: UserAddressSchema,
  phone: z.string(),
  website: z.string(),
  company: UserCompanySchema,
});

export type User = z.infer<typeof UserSchema>;

export const UsersArraySchema = z.array(UserSchema);

export type UsersArray = z.infer<typeof UsersArraySchema>;

// JSONPlaceholder на DELETE отвечает 200 с пустым телом-объектом {} (эхо-API), а не 204 без тела — strict-схема фиксирует это
export const EmptyUserResponseSchema = z.strictObject({});

export type EmptyUserResponse = z.infer<typeof EmptyUserResponseSchema>;
