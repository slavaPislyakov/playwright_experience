# 🎭 Playwright Tests<!-- omit from toc -->

## 📑 Содержание<!-- omit from toc -->

- [⚙️ Общие требования](#️-общие-требования)
- [🔗 API Tests Documentation](#-api-tests-documentation)
  - [🚀 Базовый запуск](#-базовый-запуск)
  - [🐳 Запуск через Docker Compose](#-запуск-через-docker-compose)
  - [🛠 Используемые технологии](#-используемые-технологии)
    - [📏 Валидация схем](#-валидация-схем)
      - [1️⃣ AJV (JSON Schema)](#1️⃣-ajv-json-schema)
      - [2️⃣ Zod (TypeScript-first)](#2️⃣-zod-typescript-first)
- [🖥 UI Tests Documentation](#-ui-tests-documentation)
- [📝 TODO](#-todo)

---

## ⚙️ Общие требования

```bash
# Установка зависимостей
npm install
```

---

## 🔗 API Tests Documentation

### 🚀 Базовый запуск

```bash
# Запуск всех API тестов
npm run test:api

# Запуск конкретного файла
npx playwright test api/tests/posts.spec.ts
```

### 🐳 Запуск через Docker Compose

```bash
# Запуск всех сервисов и тестов
make docker-compose-run

# Остановка и очистка контейнеров
make docker-compose-stop
```

---

### 🛠 Используемые технологии

#### 📏 Валидация схем

Фреймворк поддерживает две библиотеки для валидации JSON схем:

##### 1️⃣ AJV (JSON Schema)

Используется для валидации стандартных JSON Schema.

**Пример:** [`api/tests/posts.spec.ts`](../api/tests/posts.spec.ts)

```typescript
import { JSONSchemaType } from 'ajv';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const PostSchema: JSONSchemaType<Post> = {
  type: 'object',
  properties: {
    userId: { type: 'number' },
    id: { type: 'number' },
    title: { type: 'string' },
    body: { type: 'string' }
  },
  required: ['userId', 'id', 'title', 'body']
};

test('Get post by ID', async ({ request }) => {
  const response = await request.get('/posts/1');
  await validateAPIResponseAjv(PostSchema, response);
});
```

**Преимущества AJV:**
- Поддержка стандарта JSON Schema (RFC)
- Высокая производительность
- Широкая поддержка форматов (email, date, uri)
- Легкая миграция с других фреймворков

##### 2️⃣ Zod (TypeScript-first)

Современная библиотека для валидации с полной интеграцией с TypeScript.

**Пример:** [`api/tests/albums.spec.ts`](../api/tests/albums.spec.ts)

```typescript
import { z } from 'zod';

const AlbumSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
});

const AlbumsListSchema = z.array(AlbumSchema);

test('Get all albums', async ({ request }) => {
  const response = await request.get('/albums');
  await validateAPIResponse(AlbumsListSchema, response);
});
```

**Преимущества Zod:**
- TypeScript-first подход
- Автоматический вывод типов через z.infer
- Простая композиция и переиспользование схем
- Отличные сообщения об ошибках
- Схема — единственный источник истины

---

## 🖥 UI Tests Documentation

_В процессе разработки..._

---

## 📝 TODO
- [ ] привести все проекты к eslint rules
- [ ] добавить allure report как статичный файл на GitHub Pages ([ссылка](https://habr.com/ru/articles/914614/))
- [ ] проверить что консоль чиста (нет ошибок)
- [ ] разобраться дотошно с фикстурами
- [ ] добавить сохранение логина в сессию
- [ ] проверки консоли на ошибки ([ссылка](https://www.youtube.com/watch?v=LKMwS_u_x8Y&ab_channel=Checkly))
- [ ] проверить snapshot ([ссылка](https://www.youtube.com/watch?v=h4EY9fYyrfY&ab_channel=Checkly))
- [ ] steps с декораторами ([ссылка](https://youtu.be/of1v9cycTdQ))
- [ ] добавить инфу о фейлинге тестов ([ссылка](https://www.youtube.com/watch?v=hegZS46J0rA&t=449s&ab_channel=Checkly))
- [ ] фейленые статус-коды файлов в нетворке ([ссылка](https://www.youtube.com/watch?v=sKpwE84K9fU&t=185s&ab_channel=Checkly))
- [ ] попробовать перейти на biome вместо eslint + prettier
- [ ] Сделать декораторы для степов
- [ ] Сделать проверки информационные (https://youtu.be/PYQBSpwAquw - взять за основу тут)
- [ ] Удалить весь закоменченный код

---