# UI: фикстуры

Все фикстуры — в `ui/fixtures/fixture.ts` (единственное число — не перепутать с API, где `@@/api/fixtures/fixtures`). Спек импортирует `test` только отсюда: `import { test } from "@@/ui/fixtures/fixture"`.

## Фикстура степов новой страницы

Добавляется по образцу `mainPageSteps`: поле в `TFixtures` + инициализация:

```typescript
type TFixtures = {
  // ...
  vacancyPageSteps: VacancyPageSteps;
};

export const test = base.extend<TFixtures>({
  // ...
  vacancyPageSteps: async ({ page }, use) => {
    await use(new VacancyPageSteps(page));
  },
});
```

## Встроенные опции и фикстуры

| Фикстура/опция | Что делает |
|---|---|
| `page` | Переопределённая страница: JS-ошибки берёт из `page.pageErrors()` и `page.consoleMessages()` (встроенные буферы Playwright ≥ 1.56, до 200 последних записей; страница создаётся на тест, поэтому буфер — только события этого теста) |
| `failOnJSError` (default `true`) | Роняет тест при JS-ошибках в консоли |
| `jsErrorAllowlist` | Массив `RegExp` — известный шум; не роняет тест, аттачится в `allowed-console-errors.json` |
| `pageWithMonitoring` (`auto: true`) | Роняет тест при HTTP-ответах ≥ 400 (аттач `failed-requests.json`). Намеренно слушатель `response`, а не `page.requests()`: буфер того — 100 последних запросов, rabota.by делает ~90–100 за тест (замер 2026-11-12) — ранние ответы вытеснялись бы |

## Как глушить JS-шум

Allowlist с комментарием-обоснованием, а не `failOnJSError: false`:

```typescript
// Шум фингерпринт-скриптов сайта: попытки загрузить chrome-extension://-ресурсы
// для детекта установленных расширений браузера, а не ошибка самого сайта
const extensionProbeError: RegExp = /Fetch API cannot load chrome-extension:/;

test.use({ jsErrorAllowlist: [extensionProbeError] });
```

`failOnJSError: false` — последнее средство, когда шум нельзя выразить регулярками; в существующих спеках так помечены mainPage и jobInOtherCitiesBlock (известный долг из `ANALYSIS.md` — стремиться убрать).

`pageWithMonitoring` на живом сайте может флакать от сторонних баннеров/аналитики с ответом ≥ 400 — используй осознанно.
