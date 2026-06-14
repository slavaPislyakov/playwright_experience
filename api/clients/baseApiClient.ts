import type { APIRequestContext, APIResponse } from "@playwright/test";

import { getAuthHeaders, UserRole } from "@@/api/utils/headerUtils";
import { ApiLogger } from "@@/api/utils/logger";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  headers?: Record<string, string>;
  [key: string]: unknown;
}

export abstract class BaseApiClient {
  private readonly defaultHeaders: Record<string, string>;
  private readonly logger: ApiLogger;
  private readonly baseUrl: string;

  constructor(private readonly request: APIRequestContext, role: UserRole, baseURL?: string) {
    if (!baseURL) {
      throw new Error("❌ baseURL is required! Check playwright.config.ts or .env");
    }

    this.baseUrl = baseURL;
    this.logger = new ApiLogger(true);
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...getAuthHeaders(role),
    };
  }

  private mergeHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return {
      ...this.defaultHeaders,
      ...customHeaders,
    };
  }

  private buildRequestOptions(options: RequestOptions = {}, data?: unknown): Record<string, unknown> {
    const { headers, ...restOptions } = options;

    return {
      ...restOptions,
      ...(data !== undefined ? { data } : {}),
      headers: this.mergeHeaders(headers),
    };
  }

  private async executeRequest(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {},
    data?: unknown,
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${path}`;
    const requestOptions = this.buildRequestOptions(options, data);

    this.logger.logRequest(method, url, requestOptions);

    const response = await this.sendRequest(method, url, requestOptions);
    await this.logger.logResponse(response);

    return response;
  }

  private sendRequest(
    method: HttpMethod,
    url: string,
    requestOptions: Record<string, unknown>,
  ): Promise<APIResponse> {
    switch (method) {
      case "GET":
        return this.request.get(url, requestOptions);
      case "POST":
        return this.request.post(url, requestOptions);
      case "PUT":
        return this.request.put(url, requestOptions);
      case "PATCH":
        return this.request.patch(url, requestOptions);
      case "DELETE":
        return this.request.delete(url, requestOptions);
    }
  }

  protected getMethod(path: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.executeRequest("GET", path, options);
  }

  protected postMethod(path: string, data: unknown, options: RequestOptions = {}): Promise<APIResponse> {
    return this.executeRequest("POST", path, options, data);
  }

  protected putMethod(path: string, data: unknown, options: RequestOptions = {}): Promise<APIResponse> {
    return this.executeRequest("PUT", path, options, data);
  }

  protected patchMethod(path: string, data: unknown, options: RequestOptions = {}): Promise<APIResponse> {
    return this.executeRequest("PATCH", path, options, data);
  }

  protected deleteMethod(path: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.executeRequest("DELETE", path, options);
  }

  enableLogging(): void {
    this.logger.enable();
  }

  disableLogging(): void {
    this.logger.disable();
  }
}
