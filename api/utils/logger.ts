/* eslint-disable no-console */
import type { APIResponse } from "@playwright/test";

import { STATUS_CODES } from "node:http";

export class ApiLogger {
  private readonly enabled: boolean;

  constructor(enabled = true) {
    this.enabled = enabled;
  }

  private now(): string {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ms = String(date.getMilliseconds()).padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  logRequest(
    method: string,
    url: string,
    options: { headers?: Record<string, string>; data?: unknown } = {},
  ): number {
    if (!this.enabled) return 0;

    const startTime = Date.now();
    const { headers, data } = options;

    console.log(`[${this.now()}] REQUEST ${method.toUpperCase().padEnd(6)}: ${url}`);

    if (headers && Object.keys(headers).length) {
      console.log("HEADERS:");
      console.log(this.formatObject(headers));
    }

    if (data !== undefined) {
      console.log("REQUEST BODY:");
      console.log(this.formatObject(data));
    }

    console.log("");

    return startTime;
  }

  async logResponse(response: APIResponse, startTime: number): Promise<void> {
    if (!this.enabled) return;

    this.logResponseStatus(response, startTime);
    this.logResponseHeaders(response);
    await this.logResponseBody(response);

    console.log("");
  }

  private logResponseStatus(response: APIResponse, startTime: number): void {
    const duration = Date.now() - startTime;
    const status = response.status();
    const statusText = STATUS_CODES[status] ?? "";
    console.log(`[${this.now()}] RESPONSE ${status} ${statusText}: ${duration}ms`);
  }

  private logResponseHeaders(response: APIResponse): void {
    const headers = response.headers();
    if (headers && Object.keys(headers).length) {
      console.log("RESPONSE HEADERS:");
      console.log(this.formatObject(headers));
    }
  }

  private async logResponseBody(response: APIResponse): Promise<void> {
    try {
      const json = await response.json();
      if (json && Object.keys(json).length > 0) {
        console.log("RESPONSE BODY:");
        console.log(this.formatObject(json));
      }
      return;
    } catch {
      // json parsing failed — fall back to text
    }

    try {
      const text = await response.text();
      if (text) {
        console.log("RESPONSE BODY (text):");
        console.log(this.formatObject(text));
      }
    } catch {
      console.log("RESPONSE BODY: <unreadable>");
    }
  }

  private formatObject(obj: unknown): string {
    try {
      return JSON.stringify(obj, null, 2).replace(/^/gm, "  ");
    } catch {
      return `  ${String(obj)}`;
    }
  }
}
