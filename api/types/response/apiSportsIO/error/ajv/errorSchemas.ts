import type { JSONSchemaType } from "ajv";

export interface ApiError {
  status: number;
  error: string;
}

export const ErrorSchema: JSONSchemaType<ApiError> = {
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
