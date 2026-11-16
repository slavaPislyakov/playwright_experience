import type { APIResponse } from "@playwright/test";
import test from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import type { CreatePostRequest, PatchPostRequest, UpdatePostRequest } from "@@/api/types/request/jsonplaceholder/posts/postRequests";

import type { PostId, UserId } from "@@/api/types/common/brandedTypes";

export class PostsApiClient extends BaseApiClient {
  getAllPosts(): Promise<APIResponse> {
    return test.step("Get all posts request", () => this.getMethod(URLS.POSTS.POSTS_ALL), {
      subtitle: URLS.POSTS.POSTS_ALL,
    });
  }

  getPostById(id: PostId): Promise<APIResponse> {
    return test.step(`Get post by id "${id}" request`, () => this.getMethod(URLS.POSTS.POSTS_ID(id)), {
      subtitle: URLS.POSTS.POSTS_ID(id),
      params: { id },
    });
  }

  getPostCommentsById(id: PostId): Promise<APIResponse> {
    return test.step(`Get comments of post with id "${id}" request`, () => this.getMethod(URLS.POSTS.POSTS_ID_COMMENTS(id)), {
      subtitle: URLS.POSTS.POSTS_ID_COMMENTS(id),
      params: { id },
    });
  }

  getPostsByUserId(userId: UserId): Promise<APIResponse> {
    return test.step(`Get posts of user with id "${userId}" request`, () => this.getMethod(URLS.POSTS.POSTS_USER_FILTER(userId)), {
      subtitle: URLS.POSTS.POSTS_USER_FILTER(userId),
      params: { userId },
    });
  }

  createPost(post: CreatePostRequest): Promise<APIResponse> {
    return test.step("Create post request", () => this.postMethod(URLS.POSTS.POSTS_ALL, post), {
      subtitle: URLS.POSTS.POSTS_ALL,
      params: { post },
    });
  }

  updatePost(id: PostId, post: UpdatePostRequest): Promise<APIResponse> {
    return test.step(`Update post with id "${id}" request`, () => this.putMethod(URLS.POSTS.POSTS_ID(id), post), {
      subtitle: URLS.POSTS.POSTS_ID(id),
      params: { id, post },
    });
  }

  patchPost(id: PostId, post: PatchPostRequest): Promise<APIResponse> {
    return test.step(`Patch post with id "${id}" request`, () => this.patchMethod(URLS.POSTS.POSTS_ID(id), post), {
      subtitle: URLS.POSTS.POSTS_ID(id),
      params: { id, post },
    });
  }

  deletePost(id: PostId): Promise<APIResponse> {
    return test.step(`Delete post with id "${id}" request`, () => this.deleteMethod(URLS.POSTS.POSTS_ID(id)), {
      subtitle: URLS.POSTS.POSTS_ID(id),
      params: { id },
    });
  }
}
