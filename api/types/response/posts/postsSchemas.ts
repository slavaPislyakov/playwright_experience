import { JSONSchemaType } from "ajv";

import { IEmptyPost, IGetPostComment, IPost, IPostCreatePost } from "@@/api/types/response/posts/postsInterface";

export const getAllPostsSchema: JSONSchemaType<IPost[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      userId: {
        type: "number",
      },
      id: {
        type: "number",
      },
      title: {
        type: "string",
      },
      body: {
        type: "string",
      },
    },
    required: ["userId", "id", "title", "body"],
  },
};

export const getPostSchema: JSONSchemaType<IPost> = {
  type: "object",
  properties: {
    userId: {
      type: "integer",
    },
    id: {
      type: "integer",
    },
    title: {
      type: "string",
    },
    body: {
      type: "string",
    },
  },
  required: ["userId", "id", "title", "body"],
};

export const getPostCommentSchema: JSONSchemaType<IGetPostComment[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      postId: {
        type: "number",
      },
      name: {
        type: "string",
      },
      id: {
        type: "number",
      },
      email: {
        type: "string",
      },
      body: {
        type: "string",
      },
    },
    required: ["postId", "name", "id", "email", "body"],
  },
};

export const postCreatePostSchema: JSONSchemaType<IPostCreatePost> = {
  type: "object",
  properties: {
    id: {
      type: "integer",
    },
  },
  required: ["id"],
};

export const putUpdatePostSchema: JSONSchemaType<IPost> = {
  type: "object",
  properties: {
    userId: {
      type: "integer",
    },
    id: {
      type: "integer",
    },
    title: {
      type: "string",
    },
    body: {
      type: "string",
    },
  },
  required: ["userId", "id", "title", "body"],
};

export const patchUpdatePostSchema: JSONSchemaType<IPost> = {
  type: "object",
  properties: {
    userId: {
      type: "integer",
    },
    id: {
      type: "integer",
    },
    title: {
      type: "string",
    },
    body: {
      type: "string",
    },
  },
  required: ["userId", "id", "title", "body"],
};

export const deletePostSchema: JSONSchemaType<IEmptyPost> = {
  type: "object",
  properties: {},
  required: [],
};
