import type { APIRequestContext, APIResponse } from "@playwright/test";

import { getAuthHeaders, UserRole } from "@@/api/utils/headerUtils";
import { ApiLogger } from "@@/api/utils/logger";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  headers?: Record<string, string>;
}

export interface BaseApiClientOptions {
  logEnabled?: boolean;
}

export abstract class BaseApiClient {
  private readonly defaultHeaders: Record<string, string>;
  private readonly logger: ApiLogger;
  private readonly baseUrl: string;

  constructor(
    private readonly request: APIRequestContext,
    role: UserRole,
    baseURL: string,
    options: BaseApiClientOptions = {},
  ) {
    this.baseUrl = baseURL;
    this.logger = new ApiLogger(options.logEnabled ?? true);
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
    const { headers } = options;

    return {
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

    const startTime = this.logger.logRequest(method, url, requestOptions);

    const response = await this.sendRequest(method, url, requestOptions);
    await this.logger.logResponse(response, startTime);

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

  protected postMethod(path: string, data?: unknown, options: RequestOptions = {}): Promise<APIResponse> {
    return this.executeRequest("POST", path, options, data);
  }

  protected putMethod(path: string, data?: unknown, options: RequestOptions = {}): Promise<APIResponse> {
    return this.executeRequest("PUT", path, options, data);
  }

  protected patchMethod(path: string, data?: unknown, options: RequestOptions = {}): Promise<APIResponse> {
    return this.executeRequest("PATCH", path, options, data);
  }

  protected deleteMethod(path: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.executeRequest("DELETE", path, options);
  }
}
