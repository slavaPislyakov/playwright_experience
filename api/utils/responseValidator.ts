import type { APIResponse } from "@playwright/test";
import type { z } from "zod";

import { RequestAssertions } from "@@/api/assertions/RequestAssertions";

import type { HttpStatusCode } from "@@/api/types/common";
import { HttpStatusCode as StatusCode } from "@@/api/types/common";

export interface ValidationOptions {
  statusCode?: HttpStatusCode;
  schema?: z.ZodType;
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
      await this.assertions.checkJSONResponseSchemaZod(schema, response);
    }
  }
}
