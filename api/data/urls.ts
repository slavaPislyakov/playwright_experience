import type {
  AlbumId,
  CommentId,
  PhotoId,
  PostId,
  TodoId,
  UserId,
} from "@@/api/types/common/brandedTypes";

export const URLS = {
  POSTS: {
    POSTS_ALL: "/posts",
    POSTS_ID: (id: PostId): string => `/posts/${id}`,
    POSTS_ID_COMMENTS: (id: PostId): string => `/posts/${id}/comments`,
    POSTS_USER_FILTER: (userId: UserId): string => `/posts?userId=${userId}`,
  },
  COMMENTS: {
    COMMENTS_ALL: "/comments",
    COMMENTS_ID: (id: CommentId): string => `/comments/${id}`,
    COMMENTS_POST_FILTER: (postId: PostId): string => `/comments?postId=${postId}`,
  },
  ALBUMS: {
    ALBUMS_ALL: "/albums",
    ALBUMS_ID: (id: AlbumId): string => `/albums/${id}`,
    ALBUMS_ID_PHOTOS: (id: AlbumId): string => `/albums/${id}/photos`,
  },
  PHOTOS: {
    PHOTOS_ALL: "/photos",
    PHOTOS_ID: (id: PhotoId): string => `/photos/${id}`,
  },
  TODOS: {
    TODOS_ALL: "/todos",
    TODOS_ID: (id: TodoId): string => `/todos/${id}`,
    TODOS_COMPLETED_FILTER: (completed: boolean): string => `/todos?completed=${completed}`,
  },
  USERS: {
    USERS_ALL: "/users",
    USERS_ID: (id: UserId): string => `/users/${id}`,
    USERS_ID_ALBUMS: (id: UserId): string => `/users/${id}/albums`,
    USERS_ID_POSTS: (id: UserId): string => `/users/${id}/posts`,
    USERS_ID_TODOS: (id: UserId): string => `/users/${id}/todos`,
  },
} as const;
