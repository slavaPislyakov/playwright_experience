import { test } from "@@/api/fixtures/fixtures";

import {
  EmptyTodoResponseSchema,
  TodoSchema,
  TodosArraySchema,
} from "@@/api/types/response/jsonplaceholder/todos/zod/todosSchemas";

import { EmptyJsonPlaceholderResponseSchema } from "@@/api/types/response/jsonplaceholder/error/zod/errorSchemas";

import { TodoId } from "@@/api/types/common/brandedTypes";
import { HttpStatusCode } from "@@/api/types/common/httpStatusCode";

import type {
  CreateTodoRequest,
  PatchTodoRequest,
  UpdateTodoRequest,
} from "@@/api/types/request/jsonplaceholder/todos/todoRequests";

test.describe("Check 'TODOS' endpoint (Zod validation)", () => {
  test("Check 'GET /todos' endpoint", async ({ todosApiClient, requestAssertions }) => {
    const response = await todosApiClient.getAllTodos();
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(TodosArraySchema, response);
  });

  test("Check 'GET /todos/{id}' endpoint", async ({ todosApiClient, requestAssertions }) => {
    const response = await todosApiClient.getTodoById(TodoId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(TodoSchema, response);
  });

  test("Check 'GET /todos?completed={status}' endpoint", async ({ todosApiClient, requestAssertions }) => {
    const response = await todosApiClient.getTodosByCompletedStatus(false);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(TodosArraySchema, response);
    await requestAssertions.checkEveryItemHasFieldValue(response, "completed", false);
  });

  test("Check 'GET /todos/{id}' with non-existing todo returns error", async ({ todosApiClient, requestAssertions }) => {
    const response = await todosApiClient.getTodoById(TodoId(999999));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.NOT_FOUND);
    await requestAssertions.checkJSONResponseSchemaZod(EmptyJsonPlaceholderResponseSchema, response);
  });
});

test.describe("Check 'TODOS' endpoint mutations (Zod validation)", () => {
  const createTodoRequest: CreateTodoRequest = { userId: 1, title: "New todo created by automated test", completed: false };
  const updateTodoRequest: UpdateTodoRequest = { userId: 1, title: "Todo updated by automated test", completed: true };

  const patchTodoRequest: PatchTodoRequest = { completed: true };

  test("Check 'POST /todos' endpoint", async ({ todosApiClient, requestAssertions }) => {
    const response = await todosApiClient.createTodo(createTodoRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.CREATED);
    await requestAssertions.checkJSONResponseSchemaZod(TodoSchema, response);
  });

  test("Check 'PUT /todos/{id}' endpoint", async ({ todosApiClient, requestAssertions }) => {
    const response = await todosApiClient.updateTodo(TodoId(1), updateTodoRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(TodoSchema, response);
  });

  test("Check 'PATCH /todos/{id}' endpoint", async ({ todosApiClient, requestAssertions }) => {
    const response = await todosApiClient.patchTodo(TodoId(1), patchTodoRequest);
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(TodoSchema, response);
  });

  test("Check 'DELETE /todos/{id}' endpoint", async ({ todosApiClient, requestAssertions }) => {
    const response = await todosApiClient.deleteTodo(TodoId(1));
    await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
    await requestAssertions.checkJSONResponseSchemaZod(EmptyTodoResponseSchema, response);
  });
});
