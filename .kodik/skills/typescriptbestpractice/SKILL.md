---
name: Typescript_best_practice
description: Набор правил и рекомендаций для написания чистого, безопасного и поддерживаемого кода на TypeScript на основе SOLID, KISS и официальных стандартов.
version: 2
---

## 1. Принципы проектирования

### KISS (Keep It Simple, Stupid)
*   **Правило:** Выбирай самое простое решение. Избегай «умных» абстракций и сложных типов, если они не нужны для текущих требований.
*   **Выгода:** Код легче читать, тестировать и поддерживать.

### YAGNI (You Aren’t Gonna Need It)
*   **Правило:** Не добавляй гибкость «на будущее». Если сейчас нет потребности в абстракции — не делай её. Не пиши код для сценариев, не описанных в требованиях.
*   **Выгода:** Меньше лишнего кода и ложной сложности.

### DRY (Don’t Repeat Yourself)
*   **Правило:** Выноси повторяющуюся логику в функции, утилиты и общие типы. Но не создавай слишком «умные» обобщения, которые сложнее, чем дублирование.
*   **Выгода:** Единая точка правки логики.

### SOLID
*   **S (SRP):** У модуля/функции должна быть одна причина для изменения.
*   **O (OCP):** Расширяй поведение через дженерики, композицию и стратегии, а не через правки в больших `switch/if`.
*   **L (LSP):** Подтипы должны работать там, где работают их базовые типы, без сбоев в контракте.
*   **I (ISP):** Лучше несколько маленьких интерфейсов, чем один «бог-тип». Клиенты не должны зависеть от методов, которые не используют.
*   **D (DIP):** Верхнеуровневая логика должна зависеть от абстракций (интерфейсов), а не от конкретных реализаций.

## 2. Базовые настройки и строгость
*   **Strict Mode:** Всегда используй `"strict": true` в `tsconfig.json`. Это включает строгую проверку типов и ловит баги на этапе компиляции.
*   **ESLint:** Используй TypeScript ESLint для проверки стиля и типобезопасности. Не ослабляй строгость без внятной причины.

## 3. Типизация и безопасность

### Избегай `any`, используй `unknown`
*   **Правило:** Не используй `any` для аргументов и возвращаемых значений. Для неизвестных данных используй `unknown` и сужай тип через Type Guards.
*   **Выгода:** Гарантированная типобезопасность внешних данных.

### `readonly` и `as const`
*   **Правило:** По умолчанию используй `readonly` для полей объектов. Для литералов и массивов используй `as const`, чтобы зафиксировать точные значения.
*   **Выгода:** Защита от случайных мутаций и более точные типы-литералы.

### Дискриминированные объединения (Discriminated Unions)
*   **Правило:** Вместо нескольких флагов используй юнионы с полем-дискриминатором (например, `type` или `status`).
*   **Выгода:** Безопасная и понятная логика обработки состояний.

### Оператор `satisfies` (TS 4.9+)
*   **Правило:** Используй `satisfies` для валидации структуры без потери специфичности типа.
*   **Выгода:** Сохранение точных типов ключей и значений при проверке на соответствие интерфейсу.

## 4. Функции и API

### Явные типы для публичных API
*   **Правило:** Для публичных функций, сервисов и API задавай явные сигнатуры. Внутренняя логика может полагаться на вывод типов.
*   **Выгода:** Стабильность контрактов и лучшая читаемость.

### Запрет на тип `Function`
*   **Правило:** Пиши конкретные сигнатуры: `(...args: unknown[]) => unknown`.
*   **Выгода:** Контроль над вызовами и аргументами.

## 5. Продвинутые типы и дженерики
*   **Дженерики:** Используй их везде, где это уместно, ограничивая через `extends`.
*   **Utility Types:** Активно используй `Partial`, `Pick`, `Omit`, `Readonly`, `ReturnType`, `Parameters`.
*   **Условные типы и `infer`:** Используй для извлечения типов из других структур (например, аргументов функции).

## Examples

### Плохо (Bad)
```typescript
// Нарушение KISS и SRP, использование any
function handle(data: any) {
  if (data.type === 'user') { /* ... */ }
  // логика сохранения, логика логгирования, логика UI - всё в одном
}
```

### Хорошо (Good)
```typescript
interface User {
  readonly id: string;
  readonly name: string;
}

type State = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User };

// Использование satisfies и Discriminated Union
const config = {
  endpoint: '/api/user',
  timeout: 5000
} satisfies Record<string, string | number>;

function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}

/**
 * Обрабатывает данные пользователя.
 * Следует принципу KISS и обеспечивает типобезопасность.
 */
function processUser(data: User): void {
  const { name } = data;
  console.log(name);
}

// Исчерпывающая проверка (Exhaustive Check)
type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; size: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.size ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```


### Хорошо (Good)
```typescript
interface User {
  readonly id: string;
  readonly name: string;
}

type State = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User };

// Использование satisfies и Discriminated Union
const config = {
  endpoint: '/api/user',
  timeout: 5000
} satisfies Record<string, string | number>;

function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
}
```

### Хорошо (Good)
```typescript
interface UserData {
  id: number;
  name: string;
}

/**
 * Обрабатывает данные пользователя.
 * Следует принципу KISS и обеспечивает типобезопасность.
 */
function processUser(data: UserData): void {
  const { name } = data;
  console.log(name);
}

// Исчерпывающая проверка
type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; size: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.size ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```
