import { APIRequestContext, APIResponse } from "@playwright/test";

export abstract class BaseApiClient {
  constructor(protected context: APIRequestContext) {
    this.context = context;
  }

  protected async getMethod(url: string): Promise<APIResponse> {
    return this.context.get(url);
  }

  async postMethod(url: string, body: unknown): Promise<APIResponse> {
    return this.context.post(url, { data: body });
  }

  async putMethod(url: string, body: unknown): Promise<APIResponse> {
    return this.context.put(url, { data: body });
  }

  async patchMethod(url: string, body: unknown): Promise<APIResponse> {
    return this.context.patch(url, { data: body });
  }

  async deleteMethod(url: string): Promise<APIResponse> {
    return this.context.delete(url);
  }
}
