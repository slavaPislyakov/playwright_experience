# Known issues — ловушки и обходы

> Как обходили грабли. Оркестратор дописывает, когда наткнулся и обошёл: симптом → причина → обход. Смысл — не наступить дважды.

<!-- - <симптом> → <причина> → <обход>. -->

- ~~Легаси в `eslint.config.mjs` → `assertFunctionPatterns`: зарегистрированы `partialCompareTwoObjects`, `fullComparingTwoObjects`, `validateResponse` — таких методов в коде нет (нашёл researcher 2026-11-19). Не мешает работе; при чистке конфига удалить мёртвые паттерны, чтобы список ассертов не врал.~~ — устранено: паттернов в конфиге нет (grep 25.11.2026).
- ~~Длинные однострочные `import type {...}` в `api/clients/commentsApiClient.ts:8` (149 симв.), `todosApiClient.ts:8` (134), `photosApiClient.ts:10` (~139) — warn `@stylistic/max-len`; гейт не блокирует (lint без `--max-warnings 0`). При чистке — разбить на несколько строк.~~ — warn больше нет: строки на месте, но `max-len` с `ignoreStrings`/`ignoreTemplateLiterals` не проверяет импорты и вызовы с текстом (25.11.2026: `npm run lint` — 0 предупреждений).
- Субагенты (Flash, thoughtLevel: max) систематически обрываются по таймауту неактивности 600с — 5 из 6 запусков 23.11, похоже на длинные reasoning-паузы. Лечение: SendMessage-continuation тому же агенту с состоянием по git — стабильно спасает. Кандидат на mitigation: `thoughtLevel: high` у субагентов (решение за пользователем). 24.11: + ночной сбой потока модели («Model stream stalled 900000ms») и ещё 2 таймаута — паттерн продолжается; см. также decisions о возвратах.
- Гоча Playwright 1.65: `test.use({ jsErrorAllowlist: [a, b] })` с 2+ RegExp молча ломается (эвристика кортежа фикстуры берёт только первый элемент) — всегда один объединённый RegExp; см. `ui/data/consoleNoise.ts`.
- Рекламные премиум-карточки выдачи ведут на ВНЕШНИЙ hh.ru (ломают региональный фильтр) — переход из выдачи только по rabota.by-href (`getFirstVacancyTitleHrefOnSite`); на hh.ru-страницах lazy-блок похожих не монтируется jump-скроллом.
- Кнопки «ещё» на rabota.by НЕ существует — пагинация постраничная (`pager-next`); проверено таймлайном: счётчик карточек константен после гидрации.
- Мобильная разметка rabota.by — отдельный DOM-контур (desktop-`data-qa` отсутствуют) — responsive-тесты требуют mobile-PO; задача в бэклоге.
- `pageWithMonitoring` НЕ имеет http-allowlist: прогрессивный скролл вакансий будит яндекс-виджеты → 403 `api-maps.yandex.ru` роняет тест — кандидат на доработку фикстуры (опция httpNoiseAllowlist).
- Новые ассерты коллекций: `checkItemsSortedBy` и `checkEveryItemContainsTextInFields` на ПУСТОМ массиве проходят вакуумно (Array.every → true); пустой ответ ловится только `checkResponseItemsCount` при expectedCount > 0 — держать пары ассертов вместе.
- `POSTS_SEARCH_FILTER` не URL-энкодит `q=${term}` — безопасно для текущего термина «voluptate»; при поиске со спецсимволами (%&#+) — добавить encodeURIComponent.
- ~~Строки >120 в новом коде (warn `@stylistic/max-len`, не блокирует): клиенты comments:8/todos:8/photos:10/posts:8/41/70/104, RequestAssertions.ts:22/78, posts.spec.ts:51/156. При чистке — привести к ≤120.~~ — warn больше нет, та же причина (25.11.2026).
- Зелёный `npm run lint` не значит «предупреждений нет»: `playwright/expect-expect` и `@stylistic/max-len` включены как `warn`, а `--max-warnings 0` в скрипте нет. Забытая регистрация `check*` (`Test has no assertions`) и длинная строка гейт не роняют. Обход: смотреть вывод lint, не только exit code. Проверено на коде-нарушителе 25.11.2026.
- `@stylistic/max-len` молчит там, где есть текст: `ignoreStrings`/`ignoreTemplateLiterals`/`ignoreComments`. Импорт в 149 симв. (`commentsApiClient.ts:8`) проходит без warn, строка кода без кавычек в 136 симв. — warn.

## Расхождения документации с кодом (найдены 25.11.2026 при написании `docs/skills-and-rules.md`)

По одобрению пользователя (25.11.2026) поправлены проектные файлы: `AGENTS.md` («Готчи»: `fullyParallel: false` — на уровне проекта `ui`; «Жёсткие конвенции»: `expect-expect` — `warn`; ссылка на справочник в «Документах репозитория»), `.agents/skills/write-autotests/SKILL.md` (эталонный UI-спек приведён к реальному `searchJob.spec.ts`, `import/order` → `import-x/order`), `references/api/urls.md` (пример `TodoId` и заметка о валидации), `TYPESCRIPT_RULES.md` (строка 17: ссылка на правило 16; строка 41: конструктор branded-типов валидирует значение — целое ≥ 1). Осталось без правок — решение за пользователем:

- `~/.zcode/skills/task-pipeline/SKILL.md:21`: приоритет провайдеров начинается с `zai-start-plan`; по памяти проекта для оркестрации выбран Individual Coding Plan (Start не использовать) — стоит сверить.

## Известные ловушки фреймворка (из AGENTS.md, дублировать не нужно)

- Playwright ≥ 1.65: локаторы PO/CO только в теле конструктора, не field-initializer'ом.
- UI-проект: живой сайт, `fullyParallel: false`, шум ловит `pageWithMonitoring`.
- Новые `check*`-ассерты регистрируются в `eslint.config.mjs` → `assertFunctionPatterns`.
