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

  async checkJSONResponseSchemaZodFails<T extends z.ZodType>(responseSchema: T, response: APIResponse): Promise<void> {
    await test.step("Check JSON response schema using Zod should fail", async () => {
      const jsonResponseData = await response.json();
      const result = validateZodSchema(responseSchema, jsonResponseData);

      this.expect(result.success, result.errors).toBe(false);
    });
  }

  async checkEveryItemHasFieldValue(response: APIResponse, field: string, expectedValue: unknown): Promise<void> {
    await test.step(`Check every response item has "${field}" equal to "${String(expectedValue)}"`, async () => {
      const items = (await response.json()) as Array<Record<string, unknown>>;

      this.expect(items.every((item) => item[field] === expectedValue)).toBe(true);
    });
  }

  async checkResponseItemsCount(response: APIResponse, expectedCount: number): Promise<void> {
    await test.step(`Check response items count should be equal to: ${expectedCount}`, async () => {
      const items = (await response.json()) as Array<Record<string, unknown>>;

      this.expect(items.length).toEqual(expectedCount);
    });
  }

  async checkItemsSortedBy(response: APIResponse, field: string, order: "asc" | "desc"): Promise<void> {
    await test.step(`Check response items are sorted by "${field}" field in "${order}" order`, async () => {
      const items = (await response.json()) as Array<Record<string, unknown>>;
      const isAscending: boolean = order === "asc";

      const isSorted = items.every((item: Record<string, unknown>, index: number): boolean => {
        const previousItem = items[index - 1];

        if (previousItem === undefined) {
          return true;
        }

        const previousValue = previousItem[field];
        const currentValue = item[field];

        if (typeof previousValue === "number" && typeof currentValue === "number") {
          return isAscending ? previousValue <= currentValue : previousValue >= currentValue;
        }

        if (typeof previousValue === "string" && typeof currentValue === "string") {
          const comparisonResult = previousValue.localeCompare(currentValue);

          return isAscending ? comparisonResult <= 0 : comparisonResult >= 0;
        }

        return false;
      });

      this.expect(isSorted).toBe(true);
    });
  }

  async checkEveryItemContainsTextInFields(
    response: APIResponse,
    fields: readonly string[],
    term: string,
  ): Promise<void> {
    await test.step(`Check every response item contains "${term}" text in one of fields: ${fields.join(", ")}`, async () => {
      const items = (await response.json()) as Array<Record<string, unknown>>;

      const containsText = items.every((item) => fields.some((field) => this.fieldContainsTerm(item, field, term)));

      this.expect(containsText).toBe(true);
    });
  }

  private fieldContainsTerm(item: Record<string, unknown>, field: string, term: string): boolean {
    const fieldValue = item[field];

    return typeof fieldValue === "string" && fieldValue.toLowerCase().includes(term.toLowerCase());
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
