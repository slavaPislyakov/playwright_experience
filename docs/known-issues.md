# Known issues — ловушки и обходы

> Как обходили грабли. Оркестратор дописывает, когда наткнулся и обошёл: симптом → причина → обход. Смысл — не наступить дважды.

<!-- - <симптом> → <причина> → <обход>. -->

- Легаси в `eslint.config.mjs` → `assertFunctionPatterns`: зарегистрированы `partialCompareTwoObjects`, `fullComparingTwoObjects`, `validateResponse` — таких методов в коде нет (нашёл researcher 2026-11-19). Не мешает работе; при чистке конфига удалить мёртвые паттерны, чтобы список ассертов не врал.
- Длинные однострочные `import type {...}` в `api/clients/commentsApiClient.ts:8` (149 симв.), `todosApiClient.ts:8` (134), `photosApiClient.ts:10` (~139) — warn `@stylistic/max-len`; гейт не блокирует (lint без `--max-warnings 0`). При чистке — разбить на несколько строк.
- Субагенты (Flash, thoughtLevel: max) систематически обрываются по таймауту неактивности 600с — 5 из 6 запусков 23.11, похоже на длинные reasoning-паузы. Лечение: SendMessage-continuation тому же агенту с состоянием по git — стабильно спасает. Кандидат на mitigation: `thoughtLevel: high` у субагентов (решение за пользователем). 24.11: + ночной сбой потока модели («Model stream stalled 900000ms») и ещё 2 таймаута — паттерн продолжается; см. также decisions о возвратах.
- Гоча Playwright 1.65: `test.use({ jsErrorAllowlist: [a, b] })` с 2+ RegExp молча ломается (эвристика кортежа фикстуры берёт только первый элемент) — всегда один объединённый RegExp; см. `ui/data/consoleNoise.ts`.
- Рекламные премиум-карточки выдачи ведут на ВНЕШНИЙ hh.ru (ломают региональный фильтр) — переход из выдачи только по rabota.by-href (`getFirstVacancyTitleHrefOnSite`); на hh.ru-страницах lazy-блок похожих не монтируется jump-скроллом.
- Кнопки «ещё» на rabota.by НЕ существует — пагинация постраничная (`pager-next`); проверено таймлайном: счётчик карточек константен после гидрации.
- Мобильная разметка rabota.by — отдельный DOM-контур (desktop-`data-qa` отсутствуют) — responsive-тесты требуют mobile-PO; задача в бэклоге.
- `pageWithMonitoring` НЕ имеет http-allowlist: прогрессивный скролл вакансий будит яндекс-виджеты → 403 `api-maps.yandex.ru` роняет тест — кандидат на доработку фикстуры (опция httpNoiseAllowlist).
- Новые ассерты коллекций: `checkItemsSortedBy` и `checkEveryItemContainsTextInFields` на ПУСТОМ массиве проходят вакуумно (Array.every → true); пустой ответ ловится только `checkResponseItemsCount` при expectedCount > 0 — держать пары ассертов вместе.
- `POSTS_SEARCH_FILTER` не URL-энкодит `q=${term}` — безопасно для текущего термина «voluptate»; при поиске со спецсимволами (%&#+) — добавить encodeURIComponent.
- Строки >120 в новом коде (warn `@stylistic/max-len`, не блокирует): клиенты comments:8/todos:8/photos:10/posts:8/41/70/104, RequestAssertions.ts:22/78, posts.spec.ts:51/156. При чистке — привести к ≤120.

## Известные ловушки фреймворка (из AGENTS.md, дублировать не нужно)

- Playwright ≥ 1.65: локаторы PO/CO только в теле конструктора, не field-initializer'ом.
- UI-проект: живой сайт, `fullyParallel: false`, шум ловит `pageWithMonitoring`.
- Новые `check*`-ассерты регистрируются в `eslint.config.mjs` → `assertFunctionPatterns`.
