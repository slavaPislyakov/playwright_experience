import type { APIResponse, expect as PlaywrightExpect } from "@playwright/test";
import test from "@playwright/test";
import type { z } from "zod";

import type { HttpStatusCode } from "@@/api/types/common/httpStatusCode";
import type { ValidationResult } from "@@/api/types/common/validation";

import { validateZodSchema } from "@@/api/utils/responseValidatorZod";

type Expect = typeof PlaywrightExpect;

export class RequestAssertions {
  constructor(private readonly expect: Expect) {}

  async checkStatusCode(actualStatusCode: number, expectedStatusCode: HttpStatusCode): Promise<void> {
    await test.step(`Check status code should be equal to: ${expectedStatusCode}`, () => {
      this.expect(actualStatusCode).toEqual(expectedStatusCode);
    });
  }

  async checkJSONResponseSchemaZod<T extends z.ZodType>(responseSchema: T, response: APIResponse): Promise<void> {
    await this.withSchemaValidation("Check JSON response schema using Zod", response, (data) => validateZodSchema(responseSchema, data));
  }

  async checkEveryItemHasFieldValue(response: APIResponse, field: string, expectedValue: unknown): Promise<void> {
    await test.step(`Check every response item has "${field}" equal to "${String(expectedValue)}"`, async () => {
      const items = (await response.json()) as Array<Record<string, unknown>>;

      this.expect(items.every((item) => item[field] === expectedValue)).toBe(true);
    });
  }

  private async withSchemaValidation(
    stepName: string,
    response: APIResponse,
    validate: (data: unknown) => ValidationResult,
  ): Promise<void> {
    await test.step(stepName, async () => {
      const jsonResponseData = await response.json();
      const result = validate(jsonResponseData);

      this.expect(result.success, result.errors).toBe(true);
    });
  }
}
