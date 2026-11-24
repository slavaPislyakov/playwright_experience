import type { APIResponse } from "@playwright/test";
import test from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import type {
  CreateUserRequest,
  PatchUserRequest,
  UpdateUserRequest,
} from "@@/api/types/request/jsonplaceholder/users/userRequests";

import type { UserId } from "@@/api/types/common/brandedTypes";

export class UsersApiClient extends BaseApiClient {
  getAllUsers(): Promise<APIResponse> {
    return test.step("Get all users request", () => this.getMethod(URLS.USERS.USERS_ALL), {
      subtitle: URLS.USERS.USERS_ALL,
    });
  }

  getUserById(id: UserId): Promise<APIResponse> {
    return test.step(`Get user by id "${id}" request`, () => this.getMethod(URLS.USERS.USERS_ID(id)), {
      subtitle: URLS.USERS.USERS_ID(id),
      params: { id },
    });
  }

  getUserPostsById(id: UserId): Promise<APIResponse> {
    return test.step(`Get posts of user with id "${id}" request`, () => this.getMethod(URLS.USERS.USERS_ID_POSTS(id)), {
      subtitle: URLS.USERS.USERS_ID_POSTS(id),
      params: { id },
    });
  }

  getUserTodosById(id: UserId): Promise<APIResponse> {
    return test.step(`Get todos of user with id "${id}" request`, () => this.getMethod(URLS.USERS.USERS_ID_TODOS(id)), {
      subtitle: URLS.USERS.USERS_ID_TODOS(id),
      params: { id },
    });
  }

  getUserAlbumsById(id: UserId): Promise<APIResponse> {
    return test.step(`Get albums of user with id "${id}" request`, () => this.getMethod(URLS.USERS.USERS_ID_ALBUMS(id)), {
      subtitle: URLS.USERS.USERS_ID_ALBUMS(id),
      params: { id },
    });
  }

  createUser(user: CreateUserRequest): Promise<APIResponse> {
    return test.step("Create user request", () => this.postMethod(URLS.USERS.USERS_ALL, user), {
      subtitle: URLS.USERS.USERS_ALL,
      params: { user },
    });
  }

  updateUser(id: UserId, user: UpdateUserRequest): Promise<APIResponse> {
    return test.step(`Update user with id "${id}" request`, () => {
      return this.putMethod(URLS.USERS.USERS_ID(id), user);
    }, {
      subtitle: URLS.USERS.USERS_ID(id),
      params: { id, user },
    });
  }

  patchUser(id: UserId, user: PatchUserRequest): Promise<APIResponse> {
    return test.step(`Patch user with id "${id}" request`, () => {
      return this.patchMethod(URLS.USERS.USERS_ID(id), user);
    }, {
      subtitle: URLS.USERS.USERS_ID(id),
      params: { id, user },
    });
  }

  deleteUser(id: UserId): Promise<APIResponse> {
    return test.step(`Delete user with id "${id}" request`, () => {
      return this.deleteMethod(URLS.USERS.USERS_ID(id));
    }, {
      subtitle: URLS.USERS.USERS_ID(id),
      params: { id },
    });
  }
}
