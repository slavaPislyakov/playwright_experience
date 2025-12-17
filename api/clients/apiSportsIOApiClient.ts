import test, { APIRequestContext, APIResponse } from "@playwright/test";

import { BaseApiClient, RequestOptions } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import { UserRole } from "@@/api/utils/headerUtils";
import { stringFormat } from "@@/api/utils/stringUtils";

export class APISportsIOApiClient extends BaseApiClient {
  constructor(context: APIRequestContext, role: UserRole) {
    super(context, role);
  }

  async getLeagueInfo(id: string, options: RequestOptions = {}): Promise<APIResponse> {
    return await test.step(`Get info for league with id=${id}`, async () => {
      const url = stringFormat(URLS.API_SPORTS.LEAGUE_ID, id);

      return await this.getMethod(url, options);
    });
  }
}
