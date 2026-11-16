import { test } from "@@/api/fixtures/fixtures";

import { CommentSchema, CommentsArraySchema } from "@@/api/types/response/jsonplaceholder/comments/zod/commentsSchemas";

import { EmptyJsonPlaceholderResponseSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { CommentId, PostId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

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
