import { test as base } from "@playwright/test";

import { AlbumsApiClient } from "@@/api/clients/albumbsApiClient";
import { PostsApiClient } from "@@/api/clients/postsApiClient";

import { RequestAssertions } from "@@/api/assertions/requestAssertions";
type MyFixture = {
  postsApiClient: PostsApiClient;
  albumsApiClient: AlbumsApiClient;
  requestAssertions: RequestAssertions;
};

export const test = base.extend<MyFixture>({
  postsApiClient: async ({ request }, use) => {
    await use(new PostsApiClient(request));
  },
  albumsApiClient: async ({ request }, use) => {
    await use(new AlbumsApiClient(request));
  },
  // eslint-disable-next-line no-empty-pattern
  requestAssertions: async ({}, use) => {
    await use(new RequestAssertions());
  },
});
