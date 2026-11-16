import type { CreateTodoRequest } from "@@/api/types/request/jsonplaceholder/todos/todoRequests";

type TodoField = "userId" | "title" | "completed";

/**
 * Builder тела запроса для POST /todos. Дефолтное тело валидно и совпадает
 * с данными существующих CRUD-тестов; with*-методы переопределяют отдельные поля.
 *
 * without(field) удаляет поле ради негативных сценариев: build() в этом случае
 * осознанно «врёт» типом — клиент ждёт CreateTodoRequest, а негативный запрос
 * обязан отправить невалидный payload.
 */
export class TodoRequestBuilder {
  private readonly todo: Record<string, unknown> = {
    userId: 1,
    title: "New todo created by automated test",
    completed: false,
  };

  public withUserId(userId: number): TodoRequestBuilder {
    this.todo["userId"] = userId;
    return this;
  }

  public withTitle(title: string): TodoRequestBuilder {
    this.todo["title"] = title;
    return this;
  }

  public withCompleted(completed: boolean): TodoRequestBuilder {
    this.todo["completed"] = completed;
    return this;
  }

  public without(field: TodoField): TodoRequestBuilder {
    delete this.todo[field];
    return this;
  }

  public build(): CreateTodoRequest {
    // Задокументированная «ложь» типов: см. комментарий к классу
    return this.todo as unknown as CreateTodoRequest;
  }
}
