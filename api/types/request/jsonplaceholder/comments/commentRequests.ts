export interface CreateCommentRequest {
  postId: number;
  name: string;
  email: string;
  body: string;
}

// Эхо JSONPlaceholder: PUT-ответ вернёт только отправленные поля плюс id — поэтому все поля обязательны
export interface UpdateCommentRequest {
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface PatchCommentRequest {
  postId?: number;
  name?: string;
  email?: string;
  body?: string;
}
