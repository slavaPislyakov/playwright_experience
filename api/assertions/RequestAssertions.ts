import type { APIResponse, expect as PlaywrightExpect } from "@playwright/test";
import test from "@playwright/test";
import type { ErrorObject } from "ajv";
import type { z } from "zod";

import type { HttpStatusCode } from "@@/api/types/common";

import type { JSONSchemaType } from "@@/api/utils/ajv";
import { ajv } from "@@/api/utils/ajv";
import { formatObjectsDiff, isJsonObject } from "@@/api/utils/prettyObjectDiff";

type Expect = typeof PlaywrightExpect;

const buildObjectDiffMessage = (expected: unknown, actual: unknown): string => {
  if (isJsonObject(expected) && isJsonObject(actual)) {
    return `\n${formatObjectsDiff(expected, actual)}`;
  }

  return `\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`;
};

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

  async checkStatusCode(actualStatusCode: number, expectStatusCode: HttpStatusCode): Promise<void> {
    await test.step(`Check status code should be equal to: ${expectStatusCode}`, async () => {
      this.expect(actualStatusCode).toEqual(expectStatusCode);
    });
  }

  async checkJSONResponseSchemaAjv<T>(responseSchema: JSONSchemaType<T>, response: APIResponse): Promise<void> {
    await test.step("Check JSON response schema using Ajv", async () => {
      const jsonResponseData = await response.json();
      const validate = ajv.compile(responseSchema);
      const isSchemaValid = validate(jsonResponseData);

      this.expect(
        isSchemaValid,
        `Validation errors list:\n${formatAjvErrors(validate.errors)}`,
      ).toBe(true);
    });
  }

  async checkJSONResponseSchemaZod<T extends z.ZodType>(responseSchema: T, response: APIResponse): Promise<void> {
    await test.step("Check JSON response schema using Zod", async () => {
      const jsonResponseData = await response.json();
      const validationResult = responseSchema.safeParse(jsonResponseData);

      this.expect(
        validationResult.success,
        formatZodValidationMessage(validationResult),
      ).toBe(true);
    });
  }

  async partialCompareTwoObjects<T>(objectA: Partial<T>, objectB: T): Promise<void> {
    await test.step("Partial compare two objects", async () => {
      const isObjectBIncludesObjectA = Object.keys(objectA).every((key) => {
        return objectA[key as keyof T] === objectB[key as keyof T];
      });

      this.expect(
        isObjectBIncludesObjectA,
        `ObjectB does not include ObjectA.${buildObjectDiffMessage(objectA, objectB)}`,
      ).toBe(true);
    });
  }

  async fullComparingTwoObjects(actualObject: unknown, expectedObject: unknown): Promise<void> {
    await test.step("Full comparing two objects", async () => {
      this.expect(
        actualObject,
        `Objects are not equal.${buildObjectDiffMessage(expectedObject, actualObject)}`,
      ).toStrictEqual(expectedObject);
    });
  }
}
