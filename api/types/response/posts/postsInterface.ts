// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IEmptyPost {}

export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface IGetPostComment {
  postId: number;
  name: string;
  id: number;
  email: string;
  body: string;
}

export interface IPostCreatePost {
  id: number;
}
