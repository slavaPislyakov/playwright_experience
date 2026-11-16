import type { APIResponse } from "@playwright/test";
import { test } from "@playwright/test";

import { maskSensitiveHeaders, truncateBody } from "@@/api/utils/logger";

/**
 * Аттачи HTTP-запросов/ответов текущего API-клиента в отчёт (Allure / HTML).
 * Разбор падения идёт прямо в отчёте — без перезапуска теста и чтения консольных логов.
 * Маскирование заголовков и обрезка длинных тел переиспользуются из ApiLogger,
 * чтобы консоль и отчёт не расходились в том, что считается чувствительным.
 */

type AttachmentPayload = {
  name: string;
  body: string;
};

const attachToReport = async (payload: AttachmentPayload): Promise<void> => {
  try {
    await test.info().attach(payload.name, {
      contentType: "application/json",
      body: payload.body,
    });
  } catch {
    // Вне тестового контекста test.info() бросает исключение — аттач невозможен,
    // это concern отчёта, а не причина падать клиенту
  }
};

const stringifyAttachment = (payload: Record<string, unknown>): string => JSON.stringify(payload, null, 2);

export const attachRequest = async (
  method: string,
  url: string,
  options: { headers?: Record<string, string>; data?: unknown },
): Promise<void> => {
  const { headers, data } = options;

  await attachToReport({
    name: `Request ${method.toUpperCase()} ${url}`,
    body: stringifyAttachment({
      method: method.toUpperCase(),
      url,
      ...(headers && Object.keys(headers).length ? { headers: maskSensitiveHeaders(headers) } : {}),
      ...(data !== undefined ? { body: data } : {}),
    }),
  });
};

export const attachResponse = async (method: string, url: string, response: APIResponse): Promise<void> => {
  const headers = response.headers();

  let bodyText: string;
  try {
    bodyText = await response.text();
  } catch {
    bodyText = "<unreadable>";
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    body = truncateBody(bodyText);
  }

  await attachToReport({
    name: `Response ${method.toUpperCase()} ${response.status()} ${url}`,
    body: stringifyAttachment({
      status: response.status(),
      statusText: response.statusText(),
      headers: maskSensitiveHeaders(headers),
      body,
    }),
  });
};
