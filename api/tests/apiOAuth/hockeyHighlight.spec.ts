import { test } from "@@/api/fixtures/fixtures";

import { ErrorSchema as ErrorSchemaAjv } from "@@/api/types/response/apiSportsIO/error/ajv/errorSchemas";
import {
  CountryInfoArraySchema as CountryInfoArraySchemaAjv,
} from "@@/api/types/response/apiSportsIO/leagues/ajv/leaguesSchemas";

import { CountryCode } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

import { UserRole } from "@@/api/utils/headerUtils";

test.describe("Check endpoint 'get all countries': AJV validation", () => {
  test.use({ role: UserRole.AUTHORIZED });

  test("Check 'GET /countries' with AJV schema validation:", async ({ hockeyApiClient, requestAssertions }) => {
    const response = await hockeyApiClient.getCountryInfoByCode(CountryCode("BY"));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaAjv(CountryInfoArraySchemaAjv, response);
  });
});

test.describe("Check endpoint 'get all countries': Unauthorized user with AJV", () => {
  test.use({ role: UserRole.GUEST });

  test("Check 'GET /countries' with AJV error schema:", async ({ hockeyApiClient, requestAssertions }) => {
    const response = await hockeyApiClient.getCountryInfoByCode(CountryCode("BY"));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.FORBIDDEN);
    await requestAssertions.checkJSONResponseSchemaAjv(ErrorSchemaAjv, response);
  });
});
