import Ajv, { JSONSchemaType } from "ajv";

export const ajv = new Ajv({
  allErrors: true,
  strict: true,
  validateFormats: true,
});

export { JSONSchemaType };
