import test, { APIRequestContext, APIResponse } from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import { Role } from "@@/api/types/common/roles";

import { stringFormat } from "@@/api/utils/stringUtils";

export class PostsApiClient extends BaseApiClient {
  constructor(
    context: APIRequestContext,
    private role: Role,
  ) {
    super(context);

    if (this.role !== "guest") {
      void this.login(role); // авто-логин при создании клиента
    }
  }

  async getAllPosts(): Promise<APIResponse> {
    return await test.step("Get all posts request", async () => {
      return await this.getMethod(URLS.POSTS.POSTS_ALL);
    });
  }

  async getPostByNumber(index: number): Promise<APIResponse> {
    return await test.step(`Get post by number "${index}" request`, async () => {
      const url = stringFormat(URLS.POSTS.POSTS_ID, index);

      return await this.getMethod(url);
    });
  }

  async getCommentPostByNumber(index: number): Promise<APIResponse> {
    return await test.step(`Get comment post by number "${index}" request`, async () => {
      const url = stringFormat(URLS.POSTS.POSTS_ID_COMMENTS, index);

      return await this.getMethod(url);
    });
  }

  async createNewPost(body: { title: string; body: string; userId: number }): Promise<APIResponse> {
    return await test.step("Create new post request", async () => {
      return await this.postMethod(URLS.POSTS.POSTS_ALL, body);
    });
  }

  async updatePostByNumber(index: number, body: { title: string; body: string }): Promise<APIResponse> {
    return await test.step(`Update post by number "${index}" request`, async () => {
      const url = stringFormat(URLS.POSTS.POSTS_ID, index);

      return await this.putMethod(url, body);
    });
  }

  async partialUpdatePostByNumber(index: number, body: { title: string; body: string }): Promise<APIResponse> {
    return await test.step(`Partial update post by number "${index}" request`, async () => {
      const url = stringFormat(URLS.POSTS.POSTS_ID, index);

      return await this.patchMethod(url, body);
    });
  }

  async deletePostByNumber(index: number): Promise<APIResponse> {
    return await test.step(`Delete post by number "${index}" request`, async () => {
      const url = stringFormat(URLS.POSTS.POSTS_ID, index);

      return await this.deleteMethod(url);
    });
  }
}
