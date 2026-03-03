import { test } from "@@/api/fixtures/fixtures";

import { errorSchema } from "@@/api/types/response/apiSportsIO/error/errorSchemas";
import { countryInfoSchema } from "@@/api/types/response/apiSportsIO/leagues/leaguesSchemas";

import { UserRole } from "@@/api/utils/headerUtils";

test.describe("Check endpoint 'get all countries': Authorized user", () => {
  test.use({ role: UserRole.AUTHORIZED });

  test("Check 'GET /countries' endpoint: ", async ({ hockeyApiClient, requestAssertions }) => {

    const response = await hockeyApiClient.getCountryInfoByCode("BY");

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchemaAjv(countryInfoSchema, response);
  });
});

test.describe("Check endpoint 'get all countries': Unauthorized user", () => {
  test.use({ role: UserRole.GUEST });

  test("Check 'GET /countries' endpoint: ", async ({ hockeyApiClient, requestAssertions }) => {

    const response = await hockeyApiClient.getCountryInfoByCode("BY");

    await requestAssertions.checkStatusCode(response.status(), 403);
    await requestAssertions.checkJSONResponseSchemaAjv(errorSchema, response);
  });
});
