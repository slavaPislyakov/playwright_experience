import { JSONSchemaType } from "ajv";

import { ILeagueInfo } from "@@/api/types/response/apiSportsIO/leagues/leaguesInterface";

export const leagueInfoSchema: JSONSchemaType<ILeagueInfo> = {
  "type": "object",
  "properties": {
    "get": {
      "type": "string",
    },
    "parameters": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
        },
      },
      "required": [
        "id",
      ],
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string",
          },
          "code": {
            "type": "number",
          },
        },
        "required": ["message", "code"],
      },
    },
    "results": {
      "type": "number",
    },
    "response": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number",
          },
          "name": {
            "type": "string",
          },
          "type": {
            "type": "string",
          },
          "logo": {
            "type": "string",
          },
          "country": {
            "type": "object",
            "properties": {
              "id": {
                "type": "number",
              },
              "name": {
                "type": "string",
              },
              "code": {
                "type": "string",
              },
              "flag": {
                "type": "string",
              },
            },
            "required": [
              "id",
              "name",
              "code",
              "flag",
            ],
          },
          "seasons": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "season": {
                  "type": "number",
                },
                "current": {
                  "type": "boolean",
                },
                "start": {
                  "type": "string",
                },
                "end": {
                  "type": "string",
                },
              },
              "required": [
                "season",
                "current",
                "start",
                "end",
              ],
            },
          },
        },
        "required": [
          "id",
          "name",
          "type",
          "logo",
          "country",
          "seasons",
        ],
      },
    },
  },
  "required": [
    "get",
    "parameters",
    "errors",
    "results",
    "response",
  ],
};
