export interface CreateTodoRequest {
  userId: number;
  title: string;
  completed: boolean;
}

// Эхо JSONPlaceholder: PUT-ответ вернёт только отправленные поля плюс id — поэтому все поля обязательны
export interface UpdateTodoRequest {
  userId: number;
  title: string;
  completed: boolean;
}

export interface PatchTodoRequest {
  title?: string;
  completed?: boolean;
}
