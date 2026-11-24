import { test } from "@@/api/fixtures/fixtures";

import {
  CommentSchema,
  CommentsArraySchema,
  EmptyCommentResponseSchema,
} from "@@/api/types/response/jsonplaceholder/comments/zod/commentsSchemas";

import { EmptyJsonPlaceholderResponseSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { CommentId, PostId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

import type {
  CreateCommentRequest,
  PatchCommentRequest,
  UpdateCommentRequest,
} from "@@/api/types/request/jsonplaceholder/comments/commentRequests";

test.describe("Check 'COMMENTS' endpoint (Zod validation)", () => {
  test("Check 'GET /comments' endpoint", async ({ commentsApiClient, requestAssertions }) => {
    const response = await commentsApiClient.getAllComments();
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(CommentsArraySchema, response);
  });

  test("Check 'GET /comments/{id}' endpoint", async ({ commentsApiClient, requestAssertions }) => {
    const response = await commentsApiClient.getCommentById(CommentId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(CommentSchema, response);
  });

  test("Check 'GET /comments?postId={id}' endpoint", async ({ commentsApiClient, requestAssertions }) => {
    const response = await commentsApiClient.getCommentsByPostId(PostId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(CommentsArraySchema, response);
    await requestAssertions.checkEveryItemHasFieldValue(response, "postId", 1);
  });

  test("Check 'GET /comments/{id}' with non-existing comment returns error", async ({ commentsApiClient, requestAssertions }) => {
    const response = await commentsApiClient.getCommentById(CommentId(999999));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.NOT_FOUND);
    await requestAssertions.checkJSONResponseSchemaZod(EmptyJsonPlaceholderResponseSchema, response);
  });
});

test.describe("Check 'COMMENTS' endpoint mutations (Zod validation)", () => {
  const createCommentRequest: CreateCommentRequest = {
    postId: 1,
    name: "New comment created by automated test",
    email: "new.comment@example.com",
    body: "Comment body created by automated test",
  };

  const updateCommentRequest: UpdateCommentRequest = {
    postId: 1,
    name: "Comment updated by automated test",
    email: "updated.comment@example.com",
    body: "Comment body updated by automated test",
  };

  const patchCommentRequest: PatchCommentRequest = { body: "Comment body patched by automated test" };

  test("Check 'POST /comments' endpoint", async ({ commentsApiClient, requestAssertions }) => {
    const response = await commentsApiClient.createComment(createCommentRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.CREATED);
    await requestAssertions.checkJSONResponseSchemaZod(CommentSchema, response);
  });

  test("Check 'PUT /comments/{id}' endpoint", async ({ commentsApiClient, requestAssertions }) => {
    const response = await commentsApiClient.updateComment(CommentId(1), updateCommentRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(CommentSchema, response);
  });

  test("Check 'PATCH /comments/{id}' endpoint", async ({ commentsApiClient, requestAssertions }) => {
    const response = await commentsApiClient.patchComment(CommentId(1), patchCommentRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(CommentSchema, response);
  });

  test("Check 'DELETE /comments/{id}' endpoint", async ({ commentsApiClient, requestAssertions }) => {
    const response = await commentsApiClient.deleteComment(CommentId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(EmptyCommentResponseSchema, response);
  });
});
