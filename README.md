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
    - [📏 Полезные утилиты:](#-полезные-утилиты)
      - [1️⃣ Сравнение двух объектов:](#1️⃣-сравнение-двух-объектов)
- [🖥 UI Tests Documentation](#-ui-tests-documentation)
  - [🚀 Базовый запуск (UI тесты)](#-базовый-запуск-ui-тесты)
  - [🎯 Доступные фикстуры](#-доступные-фикстуры)
    - [📌 `pageWithMonitoring`](#-pagewithmonitoring)
    - [🔕 `failOnJSError`](#-failonjserror)
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


#### 📏 Полезные утилиты:

##### 1️⃣ Сравнение двух объектов:
Используется для сравнение двух объектов (к примеру JSON ответа фактического и ожидаемого).

**Пример:** [`api/utils/prettiObjectDiff.ts`](../api/utils/prettiObjectDiff.ts)

```typescript
export function diffObjectsPretty(expected: JSONObject, actual: JSONObject): void {
  compareObjectsPretty(expected, actual, "");

  console.log("--- Ожидаемый объект ---");
  console.dir(expected, { depth: null });

  console.log("--- Фактический объект ---");
  console.dir(actual, { depth: null });
}
```
---

## 🖥 UI Tests Documentation

### 🚀 Базовый запуск (UI тесты)

```bash
# Запуск всех UI тестов
npm run test:ui

# Запуск тестов конкретной страницы
npx playwright test ui/tests/pages/login.spec.ts

# Запуск тестов в headed режиме (видно браузер)
npx playwright test ui/tests/pages/login.spec.ts --headed

# Запуск в debug режиме
npx playwright test ui/tests/pages/login.spec.ts --debug

# Запуск с UI интерфейсом
npx playwright test ui/tests/pages/login.spec.ts --ui

# Запуск на конкретном браузере
npx playwright test ui/tests/pages/login.spec.ts --project=chromium
```
---
### 🎯 Доступные фикстуры

Проект содержит набор кастомных фикстур для улучшения опыта написания UI тестов.

#### 📌 `pageWithMonitoring`
Описание: Расширенная фикстура страницы с встроенным мониторингом упавших запросов



#### 🔕 `failOnJSError`
Описание: Фикстура для отлавливания ошибок JS в консоле браузера: можно отключить, установив параметру занчение `false`
```typescript
test.use({ failOnJSError: false });
```
---

## 📝 TODO
- [ ] добавить allure report как статичный файл на GitHub Pages ([ссылка](https://habr.com/ru/articles/914614/))
- [ ] разобраться дотошно с фикстурами
- [ ] добавить сохранение логина в сессию
- [ ] добавить инфу о фейлинге тестов ([ссылка](https://www.youtube.com/watch?v=hegZS46J0rA&t=449s&ab_channel=Checkly))
- [ ] Сделать проверки информационные (https://youtu.be/PYQBSpwAquw - взять за основу тут)
- [ ] Создать докер файл для запуска апи и юай тестов
- [ ] докер компоуз такой же
- [ ] подумать что написать для апи и юай в мейк файле или как сделать универсальным
- [ ] запустить тесты в гитхабе (прописать переменный энв)
- [ ] опубликовать аллюр гитхаб пейдже
---