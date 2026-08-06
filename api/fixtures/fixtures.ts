import { test as base, expect, type APIRequestContext } from "@playwright/test";

import { AlbumsApiClient } from "@@/api/clients/albumsApiClient";
import type { BaseApiClient } from "@@/api/clients/baseApiClient";
import { HockeyApiClient } from "@@/api/clients/hockeyApiClient";

import { RequestAssertions } from "@@/api/assertions/RequestAssertions";

import { UserRole } from "@@/api/utils/headerUtils";

type ApiFixtures = {
  albumsApiClient: AlbumsApiClient;
  hockeyApiClient: HockeyApiClient;
  requestAssertions: RequestAssertions;
  role: UserRole;
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
) => T;

type ClientFixtureArgs = {
  request: APIRequestContext;
  role: UserRole;
  baseURL: string | undefined;
};

const createApiClient = <T extends BaseApiClient>(
  ctor: ClientConstructor<T>,
) =>
  async (
    { request, role, baseURL }: ClientFixtureArgs,
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
});

export { expect };
