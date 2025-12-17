import { expect, test as base } from "@playwright/test";

import { AlbumsApiClient } from "@@/api/clients/albumsApiClient";
import { APISportsIOApiClient } from "@@/api/clients/apiSportsIOApiClient";

import { Role } from "@@/api/types/common/roles";

import { RequestAssertions } from "../assertions/RequestAssertions.1";

type MyFixture = {
  albumsApiClient: AlbumsApiClient;
  apiSportsIOApiClient: APISportsIOApiClient;
  requestAssertions: RequestAssertions;
  role: Role;
};

export const test = base.extend<MyFixture>({
  role: ["guest", { option: true }],

  albumsApiClient: async ({ request, role }, use) => {
    await use(new AlbumsApiClient(request, role));
  },
  apiSportsIOApiClient: async ({ request, role }, use) => {
    await use(new APISportsIOApiClient(request, role));
  },
  // eslint-disable-next-line no-empty-pattern
  requestAssertions: async ({}, use) => {
    await use(new RequestAssertions());
  },
});

export { expect };
