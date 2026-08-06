import type { JSONSchemaType } from "ajv";

export interface CountryInfo {
  code: string;
  name: string;
  logo: string;
}

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

export const CountryInfoArraySchema: JSONSchemaType<CountryInfo[]> = {
  type: "array",
  items: CountryInfoSchema,
};
