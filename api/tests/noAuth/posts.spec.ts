import { test } from "@@/api/fixtures/fixtures";

import { PostRequestBuilder } from "@@/api/data/builders/postRequestBuilder";

import { CommentsArraySchema } from "@@/api/types/response/jsonplaceholder/comments/zod/commentsSchemas";

import {
  EmptyPostResponseSchema,
  PostSchema,
  PostsArraySchema,
} from "@@/api/types/response/jsonplaceholder/posts/zod/postsSchemas";

import { EmptyJsonPlaceholderResponseSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { PostId, UserId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

import type {
  CreatePostRequest,
  PatchPostRequest,
  UpdatePostRequest,
} from "@@/api/types/request/jsonplaceholder/posts/postRequests";

test.describe("Check 'POSTS' endpoint (Zod validation)", () => {
  test("Check 'GET /posts' endpoint @smoke", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.getAllPosts();
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(PostsArraySchema, response);
  });

  test("Check 'GET /posts/{id}' endpoint", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.getPostById(PostId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(PostSchema, response);
  });

  test("Check 'GET /posts/{id}/comments' endpoint", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.getPostCommentsById(PostId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(CommentsArraySchema, response);
    await requestAssertions.checkEveryItemHasFieldValue(response, "postId", 1);
  });

  test("Check 'GET /posts?userId={id}' endpoint", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.getPostsByUserId(UserId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(PostsArraySchema, response);
    await requestAssertions.checkEveryItemHasFieldValue(response, "userId", 1);
  });

  test("Check 'GET /posts/{id}' with non-existing post returns error", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.getPostById(PostId(999999));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.NOT_FOUND);
    await requestAssertions.checkJSONResponseSchemaZod(EmptyJsonPlaceholderResponseSchema, response);
  });
});

test.describe("Check 'POSTS' endpoint mutations (Zod validation)", () => {
  const createPostRequest: CreatePostRequest = new PostRequestBuilder().build();

  const updatePostRequest: UpdatePostRequest = new PostRequestBuilder()
    .withUserId(2)
    .withTitle("Post updated by automated test")
    .withBody("Post body updated by automated test")
    .build();

  const patchPostRequest: PatchPostRequest = { title: "Post patched by automated test" };

  test("Check 'POST /posts' endpoint", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.createPost(createPostRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.CREATED);
    await requestAssertions.checkJSONResponseSchemaZod(PostSchema, response);
  });

  test("Check 'PUT /posts/{id}' endpoint", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.updatePost(PostId(1), updatePostRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(PostSchema, response);
  });

  test("Check 'PATCH /posts/{id}' endpoint", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.patchPost(PostId(1), patchPostRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(PostSchema, response);
  });

  test("Check 'DELETE /posts/{id}' endpoint", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.deletePost(PostId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(EmptyPostResponseSchema, response);
  });
});
