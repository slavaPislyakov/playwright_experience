export interface CreatePhotoRequest {
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

// Эхо JSONPlaceholder: PUT-ответ вернёт только отправленные поля плюс id — поэтому все поля обязательны
export interface UpdatePhotoRequest {
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface PatchPhotoRequest {
  albumId?: number;
  title?: string;
  url?: string;
  thumbnailUrl?: string;
}
