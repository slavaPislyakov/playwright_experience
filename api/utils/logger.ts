/* eslint-disable no-console */
import { APIResponse } from "@playwright/test";

export class ApiLogger {
  private enabled: boolean;
  private requestStartTime = 0;

  constructor(enabled = true) {
    this.enabled = enabled;
  }

  private now(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ms = String(now.getMilliseconds()).padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  logRequest(
    method: string,
    url: string,
    options: { headers?: Record<string, string>; data?: unknown } = {},
  ): void {
    if (!this.enabled) return;

    this.requestStartTime = Date.now();
    const { headers, data } = options;

    // REQUEST строка
    console.log(`[${this.now()}] REQUEST ${method.toUpperCase().padEnd(6)}: ${url}`);

    // HEADERS как объект
    if (headers && Object.keys(headers).length) {
      console.log("HEADERS:");
      console.log(this.formatObject(headers));
    }

    // BODY как объект (если есть)
    if (data !== undefined) {
      console.log("REQUEST BODY:");
      console.log(this.formatObject(data));
    }

    // Пустая строка для разделения
    console.log("");
  }

  async logResponse(response: APIResponse): Promise<void> {
    if (!this.enabled) return;

    const duration = Date.now() - this.requestStartTime;
    const status = response.status();
    const statusText = this.statusText(status);

    // RESPONSE строка
    console.log(`[${this.now()}] RESPONSE ${status} ${statusText}: ${duration}ms`);

    // HEADERS как объект
    const headers = response.headers();
    if (headers && Object.keys(headers).length) {
      console.log("RESPONSE HEADERS:");
      console.log(this.formatObject(headers));
    }

    // BODY как объект (если есть)
    try {
      const json = await response.json();
      if (json && Object.keys(json).length > 0) {
        console.log("RESPONSE BODY:");
        console.log(this.formatObject(json));
      }
    } catch {
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

    // Пустая строка после ответа
    console.log("");
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  private formatObject(obj: unknown): string {
    try {
      const json = JSON.stringify(obj, null, 2);
      // Добавляем отступ в начало каждой строки
      return json
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n");
    } catch {
      return `  ${String(obj)}`;
    }
  }

  private statusText(status: number): string {
    const map: Record<number, string> = {
      200: "OK",
      201: "Created",
      204: "No Content",
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      422: "Unprocessable Entity",
      429: "Too Many Requests",
      500: "Internal Server Error",
      502: "Bad Gateway",
      503: "Service Unavailable",
    };
    return map[status] ?? "";
  }
}
