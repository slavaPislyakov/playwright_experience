import { test as base, expect, type APIRequestContext } from "@playwright/test";

import { AlbumsApiClient } from "@@/api/clients/albumsApiClient";
import type { BaseApiClient } from "@@/api/clients/baseApiClient";
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

const requireBaseURL = (baseURL?: string): string => {
  if (!baseURL) {
    throw new Error("❌ baseURL is required! Check playwright.config.ts or .env");
  }
  return baseURL;
};

type ClientConstructor<T extends BaseApiClient> = new (
  request: APIRequestContext,
  role: UserRole,
  baseURL: string,
) => T;

const createApiClient = <T extends BaseApiClient>(
  ctor: ClientConstructor<T>,
) =>
  async (
    { request, role, baseURL }: { request: APIRequestContext; role: UserRole; baseURL?: string },
    use: (client: T) => Promise<void>,
  ): Promise<void> => {
    await use(new ctor(request, role, requireBaseURL(baseURL)));
  };

export const test = base.extend<ApiFixtures>({
  role: [UserRole.GUEST, { option: true }],

  albumsApiClient: createApiClient(AlbumsApiClient),
  hockeyApiClient: createApiClient(HockeyApiClient),

  requestAssertions: async ({}, use) => {
    await use(new RequestAssertions(expect));
  },

  responseValidator: async ({ requestAssertions }, use) => {
    await use(new ApiResponseValidator(requestAssertions));
  },
});

export { expect };
