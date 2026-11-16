import { test } from "@@/api/fixtures/fixtures";

import { UserSchema, UsersArraySchema } from "@@/api/types/response/jsonplaceholder/users/zod/usersSchemas";

import { AlbumsArraySchema } from "@@/api/types/response/jsonplaceholder/albums/zod/albumsSchemas";

import { PostsArraySchema } from "@@/api/types/response/jsonplaceholder/posts/zod/postsSchemas";

import { TodosArraySchema } from "@@/api/types/response/jsonplaceholder/todos/zod/todosSchemas";

import { EmptyJsonPlaceholderResponseSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { UserId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

test.describe("Check 'USERS' endpoint (Zod validation)", () => {
  test("Check 'GET /users' endpoint @smoke", async ({ usersApiClient, requestAssertions }) => {
    const response = await usersApiClient.getAllUsers();
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(UsersArraySchema, response);
  });

  test("Check 'GET /users/{id}' endpoint", async ({ usersApiClient, requestAssertions }) => {
    const response = await usersApiClient.getUserById(UserId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(UserSchema, response);
  });

  test("Check 'GET /users/{id}/todos' endpoint", async ({ usersApiClient, requestAssertions }) => {
    const response = await usersApiClient.getUserTodosById(UserId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(TodosArraySchema, response);
    await requestAssertions.checkEveryItemHasFieldValue(response, "userId", 1);
  });

  test("Check 'GET /users/{id}/posts' endpoint", async ({ usersApiClient, requestAssertions }) => {
    const response = await usersApiClient.getUserPostsById(UserId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(PostsArraySchema, response);
    await requestAssertions.checkEveryItemHasFieldValue(response, "userId", 1);
  });

  test("Check 'GET /users/{id}/albums' endpoint", async ({ usersApiClient, requestAssertions }) => {
    const response = await usersApiClient.getUserAlbumsById(UserId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(AlbumsArraySchema, response);
    await requestAssertions.checkEveryItemHasFieldValue(response, "userId", 1);
  });

  test("Check 'GET /users/{id}' with non-existing user returns error", async ({ usersApiClient, requestAssertions }) => {
    const response = await usersApiClient.getUserById(UserId(999999));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.NOT_FOUND);
    await requestAssertions.checkJSONResponseSchemaZod(EmptyJsonPlaceholderResponseSchema, response);
  });
});
