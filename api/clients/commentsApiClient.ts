import type { APIResponse } from "@playwright/test";
import test from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import type { CommentId, PostId } from "@@/api/types/common/brandedTypes";

export class CommentsApiClient extends BaseApiClient {
  getAllComments(): Promise<APIResponse> {
    return test.step("Get all comments request", () => this.getMethod(URLS.COMMENTS.COMMENTS_ALL), {
      subtitle: URLS.COMMENTS.COMMENTS_ALL,
    });
  }

  getCommentById(id: CommentId): Promise<APIResponse> {
    return test.step(`Get comment by id "${id}" request`, () => this.getMethod(URLS.COMMENTS.COMMENTS_ID(id)), {
      subtitle: URLS.COMMENTS.COMMENTS_ID(id),
      params: { id },
    });
  }

  getCommentsByPostId(postId: PostId): Promise<APIResponse> {
    return test.step(`Get comments of post with id "${postId}" request`, () => this.getMethod(URLS.COMMENTS.COMMENTS_POST_FILTER(postId)), {
      subtitle: URLS.COMMENTS.COMMENTS_POST_FILTER(postId),
      params: { postId },
    });
  }
}
