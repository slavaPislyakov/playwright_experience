import { test as base, expect } from "@playwright/test";

import { AlbumsApiClient } from "@@/api/clients/albumsApiClient";
import { HockeyApiClient } from "@@/api/clients/hockeyApiClient";

import { RequestAssertions } from "@@/api/assertions/RequestAssertions";

import { UserRole } from "@@/api/utils/headerUtils";
import { ApiResponseValidator } from "@@/api/utils/responseValidator";

type ApiFixtures = {
  albumsApiClient: AlbumsApiClient;
  hockeyApiClient: HockeyApiClient;
  requestAssertions: RequestAssertions;
  responseValidator: ApiResponseValidator;
  role: UserRole;
};

export const test = base.extend<ApiFixtures>({
  role: [UserRole.GUEST, { option: true }],

  albumsApiClient: async ({ request, role, baseURL }, use) => {
    await use(new AlbumsApiClient(request, role, baseURL));
  },

  hockeyApiClient: async ({ request, role, baseURL }, use) => {
    await use(new HockeyApiClient(request, role, baseURL));
  },

  requestAssertions: async ({}, use) => {
    await use(new RequestAssertions(expect));
  },

  responseValidator: async ({ requestAssertions }, use) => {
    await use(new ApiResponseValidator(requestAssertions));
  },
});

export { expect };
