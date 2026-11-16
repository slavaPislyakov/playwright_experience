export interface CreateAlbumRequest {
  userId: number;
  title: string;
}

export interface UpdateAlbumRequest {
  userId: number;
  title: string;
}

export interface PatchAlbumRequest {
  userId?: number;
  title?: string;
}
