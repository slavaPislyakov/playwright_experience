import type { JSONSchemaType } from "ajv";

// Country info interface for AJV
export interface CountryInfo {
  code: string;
  name: string;
  logo: string;
}

// Country info schema using AJV
export const CountryInfoSchema: JSONSchemaType<CountryInfo> = {
  type: "object",
  properties: {
    code: {
      type: "string",
    },
    name: {
      type: "string",
    },
    logo: {
      type: "string",
    },
  },
  required: ["code", "name", "logo"],
  additionalProperties: false,
};

// Country info array schema
export const CountryInfoArraySchema: JSONSchemaType<CountryInfo[]> = {
  type: "array",
  items: CountryInfoSchema,
};
