import { test } from "@@/api/fixtures/fixtures";

import {
  UserSchema,
  UsersArraySchema,
  EmptyUserResponseSchema,
} from "@@/api/types/response/jsonplaceholder/users/zod/usersSchemas";

import { AlbumsArraySchema } from "@@/api/types/response/jsonplaceholder/albums/zod/albumsSchemas";

import { PostsArraySchema } from "@@/api/types/response/jsonplaceholder/posts/zod/postsSchemas";

import { TodosArraySchema } from "@@/api/types/response/jsonplaceholder/todos/zod/todosSchemas";

import { EmptyJsonPlaceholderResponseSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { UserId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

import type {
  CreateUserRequest,
  PatchUserRequest,
  UpdateUserRequest,
} from "@@/api/types/request/jsonplaceholder/users/userRequests";

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

test.describe("Check 'USERS' endpoint mutations (Zod validation)", () => {
  const createUserRequest: CreateUserRequest = {
    name: "New user created by automated test",
    username: "new.user",
    email: "new.user@example.com",
    phone: "1-770-736-8031",
    website: "new-user.example.com",
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Gwenborough",
      zipcode: "92998-3874",
      geo: { lat: "-37.3159", lng: "81.1496" },
    },
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server",
      bs: "harness real-time e-markets",
    },
  };

  const updateUserRequest: UpdateUserRequest = {
    name: "User updated by automated test",
    username: "updated.user",
    email: "updated.user@example.com",
    phone: "1-770-736-8032",
    website: "updated-user.example.com",
    address: {
      street: "Victor Plains",
      suite: "Suite 879",
      city: "Wisokyburgh",
      zipcode: "90566-7771",
      geo: { lat: "-43.9509", lng: "-34.4618" },
    },
    company: {
      name: "Deckow-Crist",
      catchPhrase: "Proactive didactic contingency",
      bs: "synergize scalable deliverables",
    },
  };

  const patchUserRequest: PatchUserRequest = { name: "User patched by automated test" };

  test("Check 'POST /users' endpoint", async ({ usersApiClient, requestAssertions }) => {
    const response = await usersApiClient.createUser(createUserRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.CREATED);
    await requestAssertions.checkJSONResponseSchemaZod(UserSchema, response);
  });

  test("Check 'PUT /users/{id}' endpoint", async ({ usersApiClient, requestAssertions }) => {
    const response = await usersApiClient.updateUser(UserId(1), updateUserRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(UserSchema, response);
  });

  test("Check 'PATCH /users/{id}' endpoint", async ({ usersApiClient, requestAssertions }) => {
    const response = await usersApiClient.patchUser(UserId(1), patchUserRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(UserSchema, response);
  });

  test("Check 'DELETE /users/{id}' endpoint", async ({ usersApiClient, requestAssertions }) => {
    const response = await usersApiClient.deleteUser(UserId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(EmptyUserResponseSchema, response);
  });
});
