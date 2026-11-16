import type { CreatePostRequest } from "@@/api/types/request/jsonplaceholder/posts/postRequests";

type PostField = "userId" | "title" | "body";

/**
 * Builder тела запроса для POST/PUT /posts. Дефолтное тело валидно и совпадает
 * с данными существующих CRUD-тестов; with*-методы переопределяют отдельные поля.
 *
 * without(field) удаляет поле ради негативных сценариев (POST без обязательного
 * поля, пустой объект): build() в этом случае осознанно «врёт» типом — клиент
 * ждёт CreatePostRequest, а негативный запрос обязан отправить невалидный payload.
 */
export class PostRequestBuilder {
  private readonly post: Record<string, unknown> = {
    userId: 1,
    title: "New post created by automated test",
    body: "Post body created by automated test",
  };

  public withUserId(userId: number): PostRequestBuilder {
    this.post["userId"] = userId;
    return this;
  }

  public withTitle(title: string): PostRequestBuilder {
    this.post["title"] = title;
    return this;
  }

  public withBody(body: string): PostRequestBuilder {
    this.post["body"] = body;
    return this;
  }

  public without(field: PostField): PostRequestBuilder {
    delete this.post[field];
    return this;
  }

  public build(): CreatePostRequest {
    // Задокументированная «ложь» типов: см. комментарий к классу
    return this.post as unknown as CreatePostRequest;
  }
}
