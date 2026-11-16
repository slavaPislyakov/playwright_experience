import type { APIResponse } from "@playwright/test";
import test from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

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
}
