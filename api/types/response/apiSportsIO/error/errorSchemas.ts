import { JSONSchemaType } from "ajv";

import { IError } from "@@/api/types/response/apiSportsIO/error/errorInterface";

export const errorSchema: JSONSchemaType<IError> = {
  "type": "object",
  "properties": {
    "get": {
      "type": "string",
    },
    "parameters": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
      },
    },
    "errors": {
      "type": "object",
      "properties": {
        "token": {
          "type": "string",
        },
        "error": {
          "type": "string",
        },
      },
      "required": ["token", "error"],
    },
    "results": {
      "type": "number",
    },
    "paging": {
      "type": "object",
      "properties": {
        "current": {
          "type": "number",
        },
        "total": {
          "type": "number",
        },
      },
      "required": ["current", "total"],
    },
    "response": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true,
      },
    },
  },
  "required": [
    "get",
    "parameters",
    "errors",
    "results",
    "paging",
    "response",
  ],
};
