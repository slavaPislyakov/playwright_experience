import { JSONSchemaType } from "ajv";

import { ICountryInfo } from "@@/api/types/response/apiSportsIO/leagues/leaguesInterface";

export const countryInfoSchema: JSONSchemaType<ICountryInfo[]> = {
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "code": {
        "type": "string",
      },
      "name": {
        "type": "string",
      },
      "logo": {
        "type": "string",
      },
    },
    "required": [
      "code",
      "name",
      "logo",
    ],
  },
};
