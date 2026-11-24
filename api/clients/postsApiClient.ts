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

  getPostsWithLimit(limit: number): Promise<APIResponse> {
    return test.step(`Get posts with limit "${limit}" request`, () => this.getMethod(URLS.POSTS.POSTS_LIMIT_FILTER(limit)), {
      subtitle: URLS.POSTS.POSTS_LIMIT_FILTER(limit),
      params: { limit },
    });
  }

  getPostsWithLimitAndPage(limit: number, page: number): Promise<APIResponse> {
    return test.step(
      `Get posts with limit "${limit}" and page "${page}" request`,
      () => this.getMethod(URLS.POSTS.POSTS_LIMIT_PAGE_FILTER(limit, page)),
      {
        subtitle: URLS.POSTS.POSTS_LIMIT_PAGE_FILTER(limit, page),
        params: { limit, page },
      },
    );
  }

  getPostsSortedBy(sort: string, order: string): Promise<APIResponse> {
    return test.step(
      `Get posts sorted by "${sort}" field in "${order}" order request`,
      () => this.getMethod(URLS.POSTS.POSTS_SORT_FILTER(sort, order)),
      {
        subtitle: URLS.POSTS.POSTS_SORT_FILTER(sort, order),
        params: { sort, order },
      },
    );
  }

  searchPosts(term: string): Promise<APIResponse> {
    return test.step(`Search posts by term "${term}" request`, () => this.getMethod(URLS.POSTS.POSTS_SEARCH_FILTER(term)), {
      subtitle: URLS.POSTS.POSTS_SEARCH_FILTER(term),
      params: { term },
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

  // Documenting-тест: типобезопасный API не даёт отправить «невалидный» запрос — поэтому явный метод на несуществующий маршрут
  getUnknownRoute(): Promise<APIResponse> {
    return test.step("Get unknown route request", () => this.getMethod(URLS.UNKNOWN_ROUTE), {
      subtitle: URLS.UNKNOWN_ROUTE,
    });
  }

  // Невалидный нечисловой id не выразить бренд-конструктором — поэтому явный метод с literal-маршрутом
  getPostByNonNumericId(): Promise<APIResponse> {
    return test.step("Get post by non-numeric id request", () => this.getMethod(URLS.POSTS.POSTS_INVALID_ID), {
      subtitle: URLS.POSTS.POSTS_INVALID_ID,
    });
  }

  // Пустое тело не проходит по типу CreatePostRequest — поэтому явный метод с невалидным payload
  createPostWithEmptyBody(): Promise<APIResponse> {
    return test.step("Create post with empty body request", () => this.postMethod(URLS.POSTS.POSTS_ALL, {}), {
      subtitle: URLS.POSTS.POSTS_ALL,
    });
  }
}
