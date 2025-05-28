import test, { APIResponse, expect } from "@playwright/test";
import Ajv, { JSONSchemaType } from "ajv";

export class RequestAssertions {
  constructor() {}

  async checkStatusCode(actualStatusCode: number, expectStatusCode: number): Promise<void> {
    await test.step(`Check status code should be equal to: ${expectStatusCode}`, async () => {
      expect(actualStatusCode).toEqual(expectStatusCode);
    });
  }

  async checkJSONResponseSchema<T>(responseSchema: JSONSchemaType<T>, jsonResponse: APIResponse): Promise<void> {
    await test.step("Check JSON response schema", async () => {
      const ajv = new Ajv({
        allErrors: true,
      });

      const validate = ajv.compile(responseSchema);
      const isSchemaValid = validate(jsonResponse);

      if (!isSchemaValid) {
        const prettyError = JSON.stringify(validate.errors, null, 2);

        expect(isSchemaValid, `Schema validation error: ${prettyError}`).toBe(true);
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
