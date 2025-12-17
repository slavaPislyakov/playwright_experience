import { test } from "@@/api/fixtures/fixtures";

import { errorSchema } from "@@/api/types/response/apiSportsIO/error/errorSchemas";
import { leagueInfoSchema } from "@@/api/types/response/apiSportsIO/leagues/leaguesSchemas";

test.describe("Check api-sports.io endpoints", () => {
  test.describe("Authorized user", () => {
    test.use({ role: "authorized" });

    test("Check 'GET /leagues' endpoint with uniq id", async ({ apiSportsIOApiClient, requestAssertions }) => {

      const response = await apiSportsIOApiClient.getLeagueInfo("108");

      await requestAssertions.checkStatusCode(response.status(), 200);
      await requestAssertions.checkJSONResponseSchemaAjv(leagueInfoSchema, response);
    });
  });

  test.describe("Unauthorized user", () => {
    test.use({ role: "guest" });

    test("Check 'GET /leagues' endpoint", async ({ apiSportsIOApiClient, requestAssertions }) => {

      const response =  await apiSportsIOApiClient.getLeagueInfo("108");

      await requestAssertions.checkStatusCode(response.status(), 403);
      await requestAssertions.checkJSONResponseSchemaAjv(errorSchema, response);
    });
  });
});
