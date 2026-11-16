import type { APIResponse } from "@playwright/test";
import test from "@playwright/test";

import { BaseApiClient } from "@@/api/clients/baseApiClient";

import { URLS } from "@@/api/data/urls";

import type { CreateTodoRequest, PatchTodoRequest } from "@@/api/types/request/jsonplaceholder/todos/todoRequests";

import type { TodoId } from "@@/api/types/common/brandedTypes";

export class TodosApiClient extends BaseApiClient {
  getAllTodos(): Promise<APIResponse> {
    return test.step("Get all todos request", () => this.getMethod(URLS.TODOS.TODOS_ALL), {
      subtitle: URLS.TODOS.TODOS_ALL,
    });
  }

  getTodoById(id: TodoId): Promise<APIResponse> {
    return test.step(`Get todo by id "${id}" request`, () => this.getMethod(URLS.TODOS.TODOS_ID(id)), {
      subtitle: URLS.TODOS.TODOS_ID(id),
      params: { id },
    });
  }

  getTodosByCompletedStatus(completed: boolean): Promise<APIResponse> {
    return test.step(`Get todos filtered by completed status "${completed}" request`, () => this.getMethod(URLS.TODOS.TODOS_COMPLETED_FILTER(completed)), {
      subtitle: URLS.TODOS.TODOS_COMPLETED_FILTER(completed),
      params: { completed },
    });
  }

  createTodo(todo: CreateTodoRequest): Promise<APIResponse> {
    return test.step("Create todo request", () => this.postMethod(URLS.TODOS.TODOS_ALL, todo), {
      subtitle: URLS.TODOS.TODOS_ALL,
      params: { todo },
    });
  }

  patchTodo(id: TodoId, todo: PatchTodoRequest): Promise<APIResponse> {
    return test.step(`Patch todo with id "${id}" request`, () => this.patchMethod(URLS.TODOS.TODOS_ID(id), todo), {
      subtitle: URLS.TODOS.TODOS_ID(id),
      params: { id, todo },
    });
  }
}
