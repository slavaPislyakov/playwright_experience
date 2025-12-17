import { APIRequestContext, APIResponse } from "@playwright/test";

import { Role } from "@@/api/types/common/roles";

import { getAuthHeaders } from "@@/api/utils/headerUtils";
import { ApiLogger } from "@@/api/utils/logger";

export interface RequestOptions {
  headers?: Record<string, string>;
  [key: string]: unknown;
}

export abstract class BaseApiClient {
  private defaultHeaders: Record<string, string>;
  private role: Role;
  private logger: ApiLogger;
  private baseUrl: string;

  constructor(private readonly request: APIRequestContext, role: Role) {
    this.role = role;
    this.baseUrl = process.env.BASE_URL ?? "undefined";
    ;

    this.logger = new ApiLogger(true);

    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...getAuthHeaders(this.role),
    };
  }

  private mergeHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return {
      ...this.defaultHeaders,
      ...customHeaders,
    };
  }

  protected async getMethod(path: string, options: RequestOptions = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${path}`;
    const mergedHeaders = this.mergeHeaders(options.headers);
    const requestOptions = { headers: mergedHeaders, ...options };

    this.logger.logRequest("GET", url, requestOptions);
    const response = await this.request.get(url, requestOptions);
    await this.logger.logResponse(response);

    return response;
  }

  protected async postMethod(path: string, data: unknown, options: RequestOptions = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${path}`;
    const mergedHeaders = this.mergeHeaders(options.headers);
    const requestOptions = { data, headers: mergedHeaders, ...options };

    this.logger.logRequest("POST", url, requestOptions);
    const response = await this.request.post(url, requestOptions);
    await this.logger.logResponse(response);

    return response;
  }

  protected async putMethod(path: string, data: unknown, options: RequestOptions = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${path}`;
    const mergedHeaders = this.mergeHeaders(options.headers);
    const requestOptions = { data, headers: mergedHeaders, ...options };

    this.logger.logRequest("PUT", url, requestOptions);
    const response = await this.request.put(url, requestOptions);
    await this.logger.logResponse(response);

    return response;
  }

  protected async patchMethod(path: string, data: unknown, options: RequestOptions = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${path}`;
    const mergedHeaders = this.mergeHeaders(options.headers);
    const requestOptions = { data, headers: mergedHeaders, ...options };

    this.logger.logRequest("PATCH", url, requestOptions);
    const response = await this.request.patch(url, requestOptions);
    await this.logger.logResponse(response);

    return response;
  }

  protected async deleteMethod(path: string, options: RequestOptions = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${path}`;
    const mergedHeaders = this.mergeHeaders(options.headers);
    const requestOptions = { headers: mergedHeaders, ...options };

    this.logger.logRequest("DELETE", url, requestOptions);
    const response = await this.request.delete(url, requestOptions);
    await this.logger.logResponse(response);

    return response;
  }

  enableLogging(): void {
    this.logger.enable();
  }

  disableLogging(): void {
    this.logger.disable();
  }
}
