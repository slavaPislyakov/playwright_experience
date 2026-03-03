import { JSONSchemaType } from "ajv";

import { IError } from "@@/api/types/response/apiSportsIO/error/errorInterface";

export const errorSchema: JSONSchemaType<IError> = {
  type: "object",
  properties: {
    status: {
      type: "integer",
      minimum: 400,
      maximum: 599,
      description: "HTTP status code",
    },
    error: {
      type: "string",
      minLength: 1,
      description: "Error message",
    },
  },
  required: ["status", "error"],
  additionalProperties: false,
};
