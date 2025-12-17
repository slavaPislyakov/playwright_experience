import test, { APIResponse } from "@playwright/test";
import z from "zod/v4/classic/external.cjs";

import { expect } from "@@/api/fixtures/fixtures";

import { ajv, JSONSchemaType } from "@@/api/utils/ajv";

export class RequestAssertions {
  constructor() { }

  async checkStatusCode(actualStatusCode: number, expectStatusCode: number): Promise<void> {
    await test.step(`Check status code should be equal to: ${expectStatusCode}`, async () => {
      expect(actualStatusCode).toEqual(expectStatusCode);
    });
  }

  async checkJSONResponseSchemaAjv<T>(responseSchema: JSONSchemaType<T>, jsonResponse: APIResponse): Promise<void> {
    await test.step("Check JSON response schema using Ajv", async () => {
      const jsonResponseData = await jsonResponse.json();

      const validate = ajv.compile(responseSchema);
      const isSchemaValid = validate(jsonResponseData);

      if (!isSchemaValid) {
        const errors = validate.errors
          ?.map((e) => `  • ${e.instancePath || "root"}: ${e.message}`)
          .join("\n") || "Unknown error";

        expect(isSchemaValid, `Validation errors list:\n${errors}`).toBe(true);
      }
    });
  }

  async checkJSONResponseSchemaZod<T extends z.ZodType>(responseSchema: T, jsonResponse: APIResponse): Promise<void> {
    await test.step("Check JSON response schema using Zod", async () => {
      const isSchemaValid = responseSchema.safeParse(jsonResponse);

      if (!isSchemaValid.success) {
        const prettyErrors = isSchemaValid.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("\n");

        expect(isSchemaValid.success, `Validation errors list: ${prettyErrors}`).toBe(true);
      }
    });
  }

  async partialCompareTwoObjects<T>(objectA: Partial<T>, objectB: T): Promise<void> {
    await test.step("Partial compare two objects", async () => {
      const isObjectBIncludesObjectA = Object.keys(objectA).every((key) => {
        return objectA[key as keyof T] === objectB[key as keyof T];
      });

      expect(
        isObjectBIncludesObjectA,
        `ObjectB: ${JSON.stringify(objectB)} not includes ObjectA: ${JSON.stringify(objectA)}`,
      ).toBe(true);
    });
  }

  async fullComparingTwoObjects(actualObject: unknown, expectedObject: unknown): Promise<void> {
    await test.step("Full comparing two objects", async () => {
      expect(actualObject).toStrictEqual(expectedObject);
    });
  }
}
