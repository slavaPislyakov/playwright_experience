export interface CreatePostRequest {
  userId: number;
  title: string;
  body: string;
}

export interface UpdatePostRequest {
  userId: number;
  title: string;
  body: string;
}

export interface PatchPostRequest {
  userId?: number;
  title?: string;
  body?: string;
}
