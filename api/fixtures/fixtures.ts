import { test as base } from "@playwright/test";

import { AlbumsApiClient } from "@@/api/clients/albumbsApiClient";
import { PostsApiClient } from "@@/api/clients/postsApiClient";

import { RequestAssertions } from "@@/api/assertions/requestAssertions";

import { Role } from "@@/api/types/common/roles";

type MyFixture = {
  postsApiClient: PostsApiClient;
  albumsApiClient: AlbumsApiClient;
  requestAssertions: RequestAssertions;
  role: Role;
};

export const test = base.extend<MyFixture>({
  role: ["user", { option: true }],
  postsApiClient: async ({ request, role }, use) => {
    await use(new PostsApiClient(request, role));
  },
  albumsApiClient: async ({ request }, use) => {
    await use(new AlbumsApiClient(request));
  },
  // eslint-disable-next-line no-empty-pattern
  requestAssertions: async ({}, use) => {
    await use(new RequestAssertions());
  },
});
