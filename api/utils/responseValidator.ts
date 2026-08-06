import type { APIResponse } from "@playwright/test";
import { z } from "zod";

import { RequestAssertions } from "@@/api/assertions/RequestAssertions";

import type { HttpStatusCode } from "@@/api/types/common";
import { HttpStatusCode as StatusCode } from "@@/api/types/common";

import type { JSONSchemaType } from "@@/api/utils/ajv";

type ResponseSchema = z.ZodType | JSONSchemaType<unknown>;

export interface ValidationOptions {
  statusCode?: HttpStatusCode;
  schema?: ResponseSchema;
}

export class ApiResponseValidator {
  constructor(private readonly assertions: RequestAssertions) {}

  async validateResponse(
    response: APIResponse,
    options: ValidationOptions = {},
  ): Promise<void> {
    const { statusCode = StatusCode.OK, schema } = options;

    await this.assertions.checkStatusCode(response.status(), statusCode);

    if (schema) {
      if (schema instanceof z.ZodType) {
        await this.assertions.checkJSONResponseSchemaZod(schema, response);
      } else {
        await this.assertions.checkJSONResponseSchemaAjv(schema, response);
      }
    }
  }
}
