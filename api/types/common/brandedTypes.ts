const assertPositiveIntId = (name: string, value: number): void => {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be an integer >= 1, got: ${value}`);
  }
};

export type AlbumId = number & { readonly __brand: unique symbol };

export const AlbumId = (id: number): AlbumId => {
  assertPositiveIntId("AlbumId", id);

  return id as AlbumId;
};

export type CommentId = number & { readonly __brand: unique symbol };

export const CommentId = (id: number): CommentId => {
  assertPositiveIntId("CommentId", id);

  return id as CommentId;
};

export type PhotoId = number & { readonly __brand: unique symbol };

export const PhotoId = (id: number): PhotoId => {
  assertPositiveIntId("PhotoId", id);

  return id as PhotoId;
};

export type PostId = number & { readonly __brand: unique symbol };

export const PostId = (id: number): PostId => {
  assertPositiveIntId("PostId", id);

  return id as PostId;
};

export type TodoId = number & { readonly __brand: unique symbol };

export const TodoId = (id: number): TodoId => {
  assertPositiveIntId("TodoId", id);

  return id as TodoId;
};

export type UserId = number & { readonly __brand: unique symbol };

export const UserId = (id: number): UserId => {
  assertPositiveIntId("UserId", id);

  return id as UserId;
};
