import type { ErrorObject, JSONSchemaType } from "ajv";
import Ajv from "ajv";

import type { ValidationResult } from "@@/api/types/common/validation";

export const ajv = new Ajv({
  allErrors: true,
  strict: true,
  validateFormats: true,
});

export type { JSONSchemaType };

export const formatAjvErrors = (errors: ErrorObject[] | null | undefined): string => {
  return (
    errors
      ?.map((error) => `  • ${error.instancePath || "root"}: ${error.message}`)
      .join("\n") || "Unknown error"
  );
};

export const validateAjvSchema = <T>(responseSchema: JSONSchemaType<T>, data: unknown): ValidationResult => {
  const validate = ajv.compile(responseSchema);
  const isValid = validate(data);
  return {
    success: isValid,
    errors: `Validation errors list:\n${formatAjvErrors(validate.errors)}`,
  };
};
