import { test } from "@@/api/fixtures/fixtures";

import {
  deletePostSchema,
  getAllPostsSchema,
  getPostCommentSchema,
  getPostSchema,
  patchUpdatePostSchema,
  postCreatePostSchema,
  putUpdatePostSchema,
} from "@@/api/types/response/posts/postsSchemas";

test.describe("Check 'POSTS' endpoint", () => {
  test("Check 'GET /posts' endpoint", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.getAllPosts();

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchema(getAllPostsSchema, await response.json());
  });

  test("Check 'GET /posts/{number}' endpoint", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.getPostByNumber(1);

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchema(getPostSchema, await response.json());
  });

  test("Check 'GET /posts/{number}/comments' endpoint", async ({ postsApiClient, requestAssertions }) => {
    const response = await postsApiClient.getCommentPostByNumber(1);

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchema(getPostCommentSchema, await response.json());
  });

  test("Check 'POST /posts' endpoint: creation new post", async ({ postsApiClient, requestAssertions }) => {
    const newPostBody = {
      title: "foo",
      body: "bar",
      userId: 1,
    };
    const response = await postsApiClient.createNewPost(newPostBody);

    await requestAssertions.checkStatusCode(response.status(), 201);
    await requestAssertions.checkJSONResponseSchema(postCreatePostSchema, await response.json());
  });

  test("Check 'PUT /posts/{number}' endpoint: partial update existing post", async ({
    postsApiClient,
    requestAssertions,
  }) => {
    const updatePostBody = {
      userId: 1,
      id: 1,
      title: "new_title",
      body: "new_body",
    };
    const response = await postsApiClient.updatePostByNumber(1, updatePostBody);

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchema(putUpdatePostSchema, await response.json());
    await requestAssertions.fullComparingTwoObjects(await response.json(), updatePostBody);
  });

  test("Check 'PATCH /posts/{number}' endpoint: partial update existing post", async ({
    postsApiClient,
    requestAssertions,
  }) => {
    const updatePostBody = {
      title: "foo333",
      body: "bar222",
    };
    const response = await postsApiClient.partialUpdatePostByNumber(1, updatePostBody);

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchema(patchUpdatePostSchema, await response.json());
    await requestAssertions.partialCompareTwoObjects(updatePostBody, await response.json());
  });

  test("Check 'DELETE /posts/{number}' endpoint: update existing post", async ({
    postsApiClient,
    requestAssertions,
  }) => {
    const response = await postsApiClient.deletePostByNumber(1);

    await requestAssertions.checkStatusCode(response.status(), 200);
    await requestAssertions.checkJSONResponseSchema(deletePostSchema, await response.json());
    await requestAssertions.fullComparingTwoObjects(await response.json(), {});
  });
});
