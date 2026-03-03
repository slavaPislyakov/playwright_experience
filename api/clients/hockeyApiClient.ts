import test, { APIRequestContext, APIResponse } from "@playwright/test";

import { BaseApiClient, RequestOptions } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import { UserRole } from "@@/api/utils/headerUtils";
import { stringFormat } from "@@/api/utils/stringUtils";

export class HockeyApiClient extends BaseApiClient {
  constructor(context: APIRequestContext, role: UserRole, baseURL?: string) {
    super(context, role, baseURL);
  }

  async getCountryInfoByCode(code: string, options: RequestOptions = {}): Promise<APIResponse> {
    return await test.step(`Get info about country by code=${code}`, async () => {
      const url = stringFormat(URLS.API_SPORTS.COUNTRY_CODE, code);

      return await this.getMethod(url, options);
    });
  }
}
