export interface IAlbum {
  userId: number;
  id: number;
  title: string;
}

export interface IAlbumPhotos {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}
