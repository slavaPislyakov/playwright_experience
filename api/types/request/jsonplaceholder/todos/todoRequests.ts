export interface CreateTodoRequest {
  userId: number;
  title: string;
  completed: boolean;
}

export interface PatchTodoRequest {
  title?: string;
  completed?: boolean;
}
