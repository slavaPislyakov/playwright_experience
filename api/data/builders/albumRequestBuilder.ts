import type { CreateAlbumRequest } from "@@/api/types/request/jsonplaceholder/albums/albumRequests";

type AlbumField = "userId" | "title";

/**
 * Builder тела запроса для POST/PUT /albums. Дефолтное тело валидно и совпадает
 * с данными существующих CRUD-тестов; with*-методы переопределяют отдельные поля.
 *
 * without(field) удаляет поле ради негативных сценариев: build() в этом случае
 * осознанно «врёт» типом — клиент ждёт CreateAlbumRequest, а негативный запрос
 * обязан отправить невалидный payload. UpdateAlbumRequest структурно идентичен
 * CreateAlbumRequest, поэтому build() используется для обоих методов.
 */
export class AlbumRequestBuilder {
  private readonly album: Record<string, unknown> = {
    userId: 1,
    title: "New album created by automated test",
  };

  public withUserId(userId: number): AlbumRequestBuilder {
    this.album["userId"] = userId;
    return this;
  }

  public withTitle(title: string): AlbumRequestBuilder {
    this.album["title"] = title;
    return this;
  }

  public without(field: AlbumField): AlbumRequestBuilder {
    delete this.album[field];
    return this;
  }

  public build(): CreateAlbumRequest {
    // Задокументированная «ложь» типов: см. комментарий к классу
    return this.album as unknown as CreateAlbumRequest;
  }
}
