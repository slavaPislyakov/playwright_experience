import type { APIResponse } from "@playwright/test";
import test from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import type { CreateCommentRequest, PatchCommentRequest, UpdateCommentRequest } from "@@/api/types/request/jsonplaceholder/comments/commentRequests";

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

  createComment(comment: CreateCommentRequest): Promise<APIResponse> {
    return test.step("Create comment request", () => this.postMethod(URLS.COMMENTS.COMMENTS_ALL, comment), {
      subtitle: URLS.COMMENTS.COMMENTS_ALL,
      params: { comment },
    });
  }

  updateComment(id: CommentId, comment: UpdateCommentRequest): Promise<APIResponse> {
    return test.step(`Update comment with id "${id}" request`, () => {
      return this.putMethod(URLS.COMMENTS.COMMENTS_ID(id), comment);
    }, {
      subtitle: URLS.COMMENTS.COMMENTS_ID(id),
      params: { id, comment },
    });
  }

  patchComment(id: CommentId, comment: PatchCommentRequest): Promise<APIResponse> {
    return test.step(`Patch comment with id "${id}" request`, () => {
      return this.patchMethod(URLS.COMMENTS.COMMENTS_ID(id), comment);
    }, {
      subtitle: URLS.COMMENTS.COMMENTS_ID(id),
      params: { id, comment },
    });
  }

  deleteComment(id: CommentId): Promise<APIResponse> {
    return test.step(`Delete comment with id "${id}" request`, () => {
      return this.deleteMethod(URLS.COMMENTS.COMMENTS_ID(id));
    }, {
      subtitle: URLS.COMMENTS.COMMENTS_ID(id),
      params: { id },
    });
  }
}
