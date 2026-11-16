import { test as base, expect, type APIRequestContext } from "@playwright/test";

import { AlbumsApiClient } from "@@/api/clients/albumsApiClient";
import { CommentsApiClient } from "@@/api/clients/commentsApiClient";
import { PhotosApiClient } from "@@/api/clients/photosApiClient";
import { PostsApiClient } from "@@/api/clients/postsApiClient";
import { TodosApiClient } from "@@/api/clients/todosApiClient";
import { UsersApiClient } from "@@/api/clients/usersApiClient";
import type { BaseApiClient, BaseApiClientOptions } from "@@/api/clients/baseApiClient";

import { RequestAssertions } from "@@/api/assertions/RequestAssertions";

import { UserRole } from "@@/api/utils/headerUtils";

type ApiFixtures = {
  albumsApiClient: AlbumsApiClient;
  commentsApiClient: CommentsApiClient;
  photosApiClient: PhotosApiClient;
  postsApiClient: PostsApiClient;
  todosApiClient: TodosApiClient;
  usersApiClient: UsersApiClient;
  requestAssertions: RequestAssertions;
  role: UserRole;
  logEnabled: boolean;
};

const requireBaseURL = (baseURL: string | undefined): string => {
  if (!baseURL) {
    throw new Error("❌ baseURL is required! Check playwright.config.ts or .env");
  }
  return baseURL;
};

type ClientConstructor<T extends BaseApiClient> = new (
  request: APIRequestContext,
  role: UserRole,
  baseURL: string,
  options?: BaseApiClientOptions,
) => T;

type ClientFixtureArgs = {
  request: APIRequestContext;
  role: UserRole;
  baseURL: string | undefined;
  logEnabled: boolean;
};

const createApiClient = <T extends BaseApiClient>(
  ctor: ClientConstructor<T>,
) =>
  async (
    { request, role, baseURL, logEnabled }: ClientFixtureArgs,
    use: (client: T) => Promise<void>,
  ): Promise<void> => {
    await use(new ctor(request, role, requireBaseURL(baseURL), { logEnabled }));
  };

export const test = base.extend<ApiFixtures>({
  role: [UserRole.GUEST, { option: true }],
  logEnabled: [true, { option: true }],

  albumsApiClient: createApiClient(AlbumsApiClient),
  commentsApiClient: createApiClient(CommentsApiClient),
  photosApiClient: createApiClient(PhotosApiClient),
  postsApiClient: createApiClient(PostsApiClient),
  todosApiClient: createApiClient(TodosApiClient),
  usersApiClient: createApiClient(UsersApiClient),

  requestAssertions: async ({}, use) => {
    await use(new RequestAssertions(expect));
  },
});

export { expect };
