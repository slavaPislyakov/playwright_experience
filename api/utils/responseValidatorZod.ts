import { z } from "zod";

import type { ValidationResult } from "@@/api/types/common/validation";

export const formatZodErrors = (issues: z.ZodIssue[]): string => {
  return issues
    .map((issue) => `  • ${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("\n");
};

export const formatZodValidationMessage = (result: z.ZodSafeParseResult<unknown>): string => {
  if (!result.success) {
    return `Validation errors list:\n${formatZodErrors(result.error.issues)}`;
  }

  return "Schema validation should pass";
};

export const validateZodSchema = <T extends z.ZodType>(responseSchema: T, data: unknown): ValidationResult => {
  const result = responseSchema.safeParse(data);
  return {
    success: result.success,
    errors: formatZodValidationMessage(result),
  };
};
