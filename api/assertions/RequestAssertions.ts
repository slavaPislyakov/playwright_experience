import type { APIResponse, expect as PlaywrightExpect } from "@playwright/test";
import test from "@playwright/test";
import type { ErrorObject } from "ajv";
import type { z } from "zod";

import type { HttpStatusCode } from "@@/api/types/common";

import type { JSONSchemaType } from "@@/api/utils/ajv";
import { ajv } from "@@/api/utils/ajv";

type Expect = typeof PlaywrightExpect;

interface SchemaValidationResult {
  success: boolean;
  errors: string;
}

const formatAjvErrors = (errors: ErrorObject[] | null | undefined): string => {
  return errors
    ?.map((error) => `  • ${error.instancePath || "root"}: ${error.message}`)
    .join("\n") || "Unknown error";
};

const formatZodErrors = (issues: z.ZodIssue[]): string => {
  return issues
    .map((issue) => `  • ${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("\n");
};

const formatZodValidationMessage = (result: z.ZodSafeParseResult<unknown>): string => {
  if (!result.success) {
    return `Validation errors list:\n${formatZodErrors(result.error.issues)}`;
  }

  return "Schema validation should pass";
};

export class RequestAssertions {
  constructor(private readonly expect: Expect) {}

  async checkStatusCode(actualStatusCode: number, expectedStatusCode: HttpStatusCode): Promise<void> {
    await test.step(`Check status code should be equal to: ${expectedStatusCode}`, async () => {
      this.expect(actualStatusCode).toEqual(expectedStatusCode);
    });
  }

  async checkJSONResponseSchemaAjv<T>(responseSchema: JSONSchemaType<T>, response: APIResponse): Promise<void> {
    await this.withSchemaValidation("Check JSON response schema using Ajv", response, (data) => {
      const validate = ajv.compile(responseSchema);
      const isValid = validate(data);
      return {
        success: isValid,
        errors: `Validation errors list:\n${formatAjvErrors(validate.errors)}`,
      };
    });
  }

  async checkJSONResponseSchemaZod<T extends z.ZodType>(responseSchema: T, response: APIResponse): Promise<void> {
    await this.withSchemaValidation("Check JSON response schema using Zod", response, (data) => {
      const result = responseSchema.safeParse(data);
      return {
        success: result.success,
        errors: formatZodValidationMessage(result),
      };
    });
  }

  private async withSchemaValidation(
    stepName: string,
    response: APIResponse,
    validate: (data: unknown) => SchemaValidationResult,
  ): Promise<void> {
    await test.step(stepName, async () => {
      const jsonResponseData = await response.json();
      const result = validate(jsonResponseData);

      this.expect(result.success, result.errors).toBe(true);
    });
  }
}
