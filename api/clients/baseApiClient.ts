import { APIRequestContext, APIResponse } from "@playwright/test";

import { Role } from "@@/api/types/common/roles";

export abstract class BaseApiClient {
  private token: string | null = null;

  constructor(private readonly context: APIRequestContext) {}

  protected async login(role: Role): Promise<string | null> {
    let response: APIResponse;
    if (role === "admin") {
      response = await this.context.post("/auth/login", {
        data: { username: "admin", password: "secret" },
      });
    } else {
      response = await this.context.post("/auth/login", {
        data: { username: "user", password: "password" },
      });
    }

    const data = await response.json();
    this.token = data.accessToken;
    return this.token;
  }

  protected async getMethod(url: string): Promise<APIResponse> {
    return await this.context.get(url);
  }

  protected async postMethod(url: string, body: unknown): Promise<APIResponse> {
    return await this.context.post(url, { data: body });
  }

  protected async putMethod(url: string, body: unknown): Promise<APIResponse> {
    return await this.context.put(url, { data: body });
  }

  protected async patchMethod(url: string, body: unknown): Promise<APIResponse> {
    return await this.context.patch(url, { data: body });
  }

  protected async deleteMethod(url: string): Promise<APIResponse> {
    return await this.context.delete(url);
  }
}
