import type { APIResponse } from "@playwright/test";
import test from "@playwright/test";

import type { RequestOptions } from "@@/api/clients/baseApiClient";
import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import type { CountryCode } from "@@/api/types/common";

export class HockeyApiClient extends BaseApiClient {
  getCountryInfoByCode(code: CountryCode, options: RequestOptions = {}): Promise<APIResponse> {
    return test.step(`Get info about country by code=${code}`, () => {
      return this.getMethod(URLS.API_SPORTS.COUNTRY_CODE(code), options);
    });
  }
}
