import type { UserAddress, UserCompany } from "@@/api/types/response/jsonplaceholder/users/zod/usersSchemas";

export interface CreateUserRequest {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: UserAddress;
  company: UserCompany;
}

// Эхо JSONPlaceholder: PUT-ответ вернёт только отправленные поля плюс id — поэтому все поля обязательны (address/company целиком)
export interface UpdateUserRequest {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: UserAddress;
  company: UserCompany;
}

export interface PatchUserRequest {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: UserAddress;
  company?: UserCompany;
}
