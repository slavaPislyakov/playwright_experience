import { test as base, expect } from "@playwright/test";

import { AlbumsApiClient } from "@@/api/clients/albumsApiClient";
import { HockeyApiClient } from "@@/api/clients/hockeyApiClient";

import { UserRole } from "@@/api/utils/headerUtils";

import { RequestAssertions } from "../assertions/RequestAssertions";

type MyFixture = {
  albumsApiClient: AlbumsApiClient;
  hockeyApiClient: HockeyApiClient;
  requestAssertions: RequestAssertions;
  role: UserRole;
};

export const test = base.extend<MyFixture>({
  role: [UserRole.GUEST, { option: true }],

  albumsApiClient: async ({ request, role, baseURL }, use) => {
    await use(new AlbumsApiClient(request, role, baseURL));
  },
  hockeyApiClient: async ({ request, role, baseURL }, use) => {
    await use(new HockeyApiClient(request, role, baseURL));
  },
  // eslint-disable-next-line no-empty-pattern
  requestAssertions: async ({}, use) => {
    await use(new RequestAssertions());
  },
});

export { expect };
