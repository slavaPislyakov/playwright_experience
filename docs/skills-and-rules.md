# Скиллы и правила проекта

Справочник отвечает на три вопроса о каждой детали проекта: **что это**, **как вызвать** и **за что отвечает**. Он написан и для человека, и для агента: человеку — карта и примеры, агенту — точные пути к первоисточникам.

Это пересказ, а не источник правды. Источники — файлы, на которые здесь стоят ссылки: `AGENTS.md`, скилл `write-autotests`, `eslint.config.mjs`, `tsconfig.json`. Если справочник разошёлся с ними, прав первоисточник, а справочник пора поправить.

Состояние на 25.11.2026. Сообщения компилятора и линтера в примерах настоящие: их получили, прогнав код-нарушитель командами проекта.

## Содержание

- [1. Карта проекта](#1-карта-проекта)
- [2. Как вызвать скилл](#2-как-вызвать-скилл)
- [3. Скиллы проекта](#3-скиллы-проекта)
- [4. Глобальные скиллы](#4-глобальные-скиллы)
- [5. Субагенты](#5-субагенты)
- [6. 20 рулов TypeScript](#6-20-рулов-typescript)
- [7. Компилятор](#7-компилятор)
- [8. Линтер](#8-линтер)
- [9. Конвенции кода](#9-конвенции-кода)
- [10. Правила работы](#10-правила-работы)
- [11. Гейт](#11-гейт)
- [12. Ловушки](#12-ловушки)
- [13. Где что лежит](#13-где-что-лежит)
- [14. Как добавить скилл или правило](#14-как-добавить-скилл-или-правило)
- [15. Служебные скиллы ZCode](#15-служебные-скиллы-zcode)

## 1. Карта проекта

| Что | Как вызвать | За что отвечает | Где лежит |
|---|---|---|---|
| Скилл `write-autotests` | `/write-autotests` или сам при любой правке в `api/` и `ui/` | Конвенции тестов: спеки, клиенты, схемы, степы, Page Objects | `.agents/skills/write-autotests/` |
| Скилл `reflect` | `/reflect`, в конце сессии | Разбор оркестрации: что пошло не так и что поправить в настройке агентов | `.agents/skills/reflect/` |
| Скилл `git-commit` | `/git-commit` | Коммит и сообщение к нему по правилам git | `~/.zcode/skills/git-commit/` |
| Скилл `review-changes` | `/review-changes <хеш, диапазон или ветка>` | Ревью изменений с приоритетами P0–P3 | `~/.zcode/skills/review-changes/` |
| Скилл `task-pipeline` | `/task-pipeline` | Конвейер «планнер → реализатор → ревьювер» с файлом плана | `~/.zcode/skills/task-pipeline/` |
| Субагенты `builder`, `reviewer`, `researcher` | Вызывает оркестратор, команды для пользователя нет | Пишут код, сверяют его с брифом, собирают факты | `.zcode/agents/` |
| Правила компилятора | `npm run typecheck` | 11 строгих флагов TypeScript | `tsconfig.json` |
| Правила линтера | `npm run lint`, `npm run lint:fix` | Стиль, гигиена, промисы, импорты, правила Playwright | `eslint.config.mjs` |
| Конвенции кода | Скилл `write-autotests`, ревьюер, гейт | То, что инструменты проверить не могут | `AGENTS.md`, скилл `write-autotests` |
| 20 рулов | — | Сводный список правил всех трёх слоёв | Раздел 6, `TYPESCRIPT_RULES.md` в корне |

## 2. Как вызвать скилл

Скилл — это инструкция для агента: файл `SKILL.md`, иногда с папкой `references/` для подробностей. Пока скилл не вызван, агент его не читает. Вызвали — агент прочитал и работает по нему.

**Явно** — написать в чате слеш-команду:

```text
/write-autotests
/review-changes HEAD~2..HEAD
/git-commit
/reflect
```

**Автоматически** — агент сам берёт скилл, когда задача подходит под его описание. На просьбу «добавь тест на GET /albums» он обязан прочитать `write-autotests`, даже если вы его не называли. Какие фразы включают какой скилл, написано в разделах 3 и 4.

| Папка | Чьи скиллы | Попадают в репозиторий |
|---|---|---|
| `.agents/skills/` | Проектные: действуют только в этом проекте | Да |
| `~/.zcode/skills/` | Глобальные: действуют во всех проектах | Нет |

Правила нельзя «вызвать» — они работают всегда. У них три слоя исполнения:

| Слой | Кто проверяет | Когда узнаёшь о нарушении |
|---|---|---|
| Компилятор | `npm run typecheck` | Сразу: код не компилируется |
| Линтер | `npm run lint` | Сразу: ошибка или предупреждение |
| Конвенция | Скилл, ревьюер, человек | На ревью: инструмент этого не видит |

## 3. Скиллы проекта

### 3.1. `write-autotests`: как писать тесты по конвенциям

**За что отвечает.** Объясняет, как писать API- и UI-автотесты так же, как написан остальной фреймворк: клиенты, фикстуры, схемы Zod, Page/Step/Component Objects, стиль, проверки качества.

**Как вызвать.** `/write-autotests`. Аргументы не нужны: это справочник, который прикладывается к текущей задаче. Обычно срабатывает сам — на любую задачу с файлами в `api/` или `ui/` и на фразы «добавь тест», «покрой эндпоинт», «напиши проверку для страницы».

**Кто обязан его прочитать.** Каждый, кто правит `api/` или `ui/`: это требование `AGENTS.md`, и оно же записано в правилах `builder`'а.

**Правило номер один.** Новый код пишется так же, как существующий. Прежде чем писать тест, найди похожий в `api/tests/` или `ui/tests/` и повтори его структуру.

**Золотые правила.** Они действуют и для API, и для UI.

| № | Правило | Подробно |
|---|---|---|
| 1 | Спек тонкий: только вызовы клиента или степов и ассерты. Сырой `expect` в спеке не используется | 9.1 |
| 2 | Всё обёрнуто в `test.step` внутри клиентов, степов и ассертов. В спеке вручную не добавляется | 9.2 |
| 3 | `test` импортируется только из фикстур проекта | 9.3 |
| 4 | Без магических чисел: статусы — enum `HttpStatusCode`, id — branded-конструкторы | 9.4 |
| 5 | Схемы строгие: `z.strictObject`, лишние поля отклоняются | 9.5 |
| 6 | `import type`, явный тип возврата, нет висящих промисов | 7, 8.3 |
| 7 | Двойные кавычки, точки с запятой, отступ 2, строка ≤ 120. Импорты расставляет `npm run lint:fix` | 8.2, 8.4 |
| 8 | Названия тестов и степов на английском. Комментарии «почему» можно по-русски | 9.1 |
| 9 | Новые `check*` регистрируются в `eslint.config.mjs` | 8.7 |
| 10 | `test.only` и `test.skip` запрещены; неизбежный `skip` — с причиной | 8.5 |

**Порядок добавления API-теста.** Шесть шагов, у каждого свой справочник. Читать нужно только тот, что относится к текущему шагу.

| Шаг | Что сделать | Справочник |
|---|---|---|
| 1 | Маршрут в `api/data/urls.ts` — функция-билдер с branded-параметром | `references/api/urls.md` |
| 2 | Типы запроса для POST/PUT/PATCH и схема ответа | `references/api/schemas.md` |
| 3 | Метод клиента внутри `test.step` | `references/api/clients.md` |
| 4 | Новый клиент — регистрация в `api/fixtures/fixtures.ts` через `createApiClient` | `references/api/fixtures.md` |
| 5 | Спек: запрос через клиента → `checkStatusCode` → `checkJSONResponseSchemaZod` | `references/api/spec.md`, `references/api/assertions.md` |
| 6 | Проверка | — |

```bash
npm run typecheck && npm run lint && npx playwright test <файл> --project=noOAuth
```

**Порядок добавления UI-теста.** Тоже шесть шагов.

| Шаг | Что сделать | Справочник |
|---|---|---|
| 1 | Локаторы — в Page Object `ui/pages/<страница>.ts` или Component Object `ui/components/...` | `references/ui/pages.md` |
| 2 | Степы в `ui/steps/...` и решение, где им жить | `references/ui/steps.md` |
| 3 | Фикстура степов в `ui/fixtures/fixture.ts`; опции `jsErrorAllowlist` и `failOnJSError` | `references/ui/fixtures.md` |
| 4 | Aria-снапшот контентного блока в `ui/data/snapshots/blocks.ts` | `references/ui/snapshots.md` |
| 5 | Спек: `test.beforeEach` с навигацией, тело — только степы | `references/ui/spec.md` |
| 6 | Проверка | — |

```bash
npm run typecheck && npm run lint && npx playwright test <файл> --project=ui
```

**Чего не делать:**

- Не вызывать `request.get` или `page.locator` из спека — только через клиент, степы, Page Object.
- Не инициализировать локаторы при объявлении поля — только в конструкторе (раздел 9.8).
- Не писать статус числом (раздел 9.4).
- Не ослаблять схемы без причины: `z.object` и `additionalProperties: true` под запретом (раздел 9.5).
- Не логировать секреты вручную: `ApiLogger` уже маскирует чувствительные заголовки.
- Не коммитить `.env` и не выносить URL в спеки — только `api/data/urls.ts` и переменные окружения.
- Не оставлять `test.fail` и `test.skip` как «документацию бага».

**Гейт.** `typecheck`, `lint` и прогон затронутых спеков. Если менялся только клиент или схема без нового теста, достаточно того же самого.

### 3.2. `reflect`: итог сессии

**За что отвечает.** Разбирает, как работала оркестрация в режиме «мозг и руки»: какие брифы вернулись `builder`'у и почему, где были лишние шаги, непонятные брифы, ошибки `builder` и `reviewer`, где оркестратор нарушил собственные правила. Для каждого сбоя предлагает одну минимальную правку настройки.

**Как вызвать.** Только явно и в конце сессии: `/reflect` или словами — «сделай reflect», «подведи итог сессии», «что улучшить в настройке». Сам не срабатывает.

**Что делает:**

1. Перечисляет, что шло не так.
2. Для каждого пункта предлагает одну минимальную правку в конкретный файл: `.zcode/agents/builder.md`, `.zcode/agents/reviewer.md`, раздел оркестратора в `AGENTS.md` или запись в `docs/`.
3. Что прошло хорошо, записывает одной строкой в `docs/decisions.md`.

**Чего не делает:**

- Это не отчёт о задаче: отчёт уже лежит в `docs/progress.md`.
- Ничего не меняет без вашего одобрения: сначала список предложений, потом правки строго по одобренным пунктам.
- Не предлагает правок «на всякий случай» — только то, что реально произошло в сессии.

## 4. Глобальные скиллы

Они лежат в `~/.zcode/skills/` и потому работают в любом проекте, а не только здесь.

### 4.1. `git-commit`: коммит по правилам

**За что отвечает.** Создаёт коммит по изменениям рабочего дерева и пишет короткое сообщение по практике документации git.

**Как вызвать.** `/git-commit` или словами: «закоммить», «сделай коммит», «сгенерируй commit message». Срабатывает, даже если слово git не произнесено. Если названы конкретные файлы, коммитит только их.

**По каким правилам работает:**

- Смотрит статус, дифф и историю и подстраивается под стиль проекта. Здесь приняты префиксы `type(scope):` и повелительное наклонение: `test(api): cover collection params and negatives`.
- Несвязанные изменения — отдельными коммитами. Если однозначно разделить нельзя, предложит разбивку и спросит.
- Тема — до 50 символов, без точки в конце. Тело объясняет, **почему** изменение сделано, а не **как**.
- Упавший pre-commit-хук — починить причину и повторить. `--no-verify` — только с вашего явного согласия.
- Никаких подписей агента вроде Co-Authored-By.

**Стоп-сигналы:**

- В изменениях есть `.env`, ключи или токены — останавливается и предупреждает.
- `git push`, `git commit --amend`, `git reset --hard` — только по явной просьбе.

### 4.2. `review-changes`: ревью изменений

**За что отвечает.** Коротко говорит, что сделано, какие гейты прошли, и перечисляет узкие места с приоритетами и конкретными решениями.

**Как вызвать.** `/review-changes` или словами: «сделай ревью», «посмотри дифф», «найди узкие места», «самари изменений». Аргумент задаёт объём:

| Аргумент | Что отревьюит |
|---|---|
| Без аргумента | Незакоммиченные изменения |
| `<хеш>` | Один коммит |
| `A..B` | Диапазон коммитов |
| `<ветка>` | Ветку против `master` |

**По каким правилам работает:**

- Только читает. Исправляет, если вы попросите это после отчёта.
- Гейты гоняет сам: быстрые (`typecheck`, `lint`) — всегда, полный набор тестов — когда менялся исполняемый код. В отчёт попадает только то, что реально прогнали в этой сессии.
- Каждая находка — это `file:line`, проблема, чем грозит и решение. Без этого находкой не считается.
- Максимум около десяти развёрнутых находок, мелочи — одним списком.
- «Узких мест нет» — нормальный результат.

**Приоритеты:**

| Приоритет | Что значит |
|---|---|
| P0 | Сломано сейчас: красный гейт, секрет, потеря данных. Чинить до коммита |
| P1 | Выстрелит потом: проглоченная ошибка, висящий промис, магическое значение |
| P2 | Расхождение с конвенциями, плохая читаемость |
| P3 | Мелочи |

Отчёт по умолчанию приходит в чат на вашем языке. По просьбе — файлом в `REVIEWS/`.

### 4.3. `task-pipeline`: конвейер из трёх агентов

**За что отвечает.** Реализует задачу тремя субагентами: планнер пишет план в файл, реализатор делает по нему, ревьювер проверяет. Один запуск конвейера — одна задача.

**Как вызвать.** `/task-pipeline` или словами: «реализуй», «сделай», «добавь», «напиши», «перепиши», «доработай». Не годится для вопросов по коду и правок в одну строку.

**Как устроен:**

| Стадия | Кто | Что делает |
|---|---|---|
| 0 | Скилл | Настраивает модели: при необходимости правит поле `model` в `~/.zcode/agents/task-planner.md`, `task-implementer.md`, `task-reviewer.md` |
| 1 | `task-planner` | Пишет план в `plans/<дата>-<имя>.md` |
| 2 | Вы | Подтверждаете план: «Подтвердить», «Скорректировать» или «Отменить» |
| 3 | `task-implementer` | Реализует шаг за шагом |
| 4 | `task-reviewer` | Выносит `PASS` или `FAIL`. После `FAIL` исправления идут тем же агентам, максимум три раунда |
| 5 | Скилл | Отчитывается |

На стадии 0 провайдер берётся по списку из самого скилла, и первым там стоит `zai-start-plan`.

### 4.4. Два конвейера: не перепутать

Задачу в этом проекте можно вести двумя способами. Роли в них похожи по названию, но это разные механизмы.

| | Цикл из `AGENTS.md` | `/task-pipeline` |
|---|---|---|
| Кто планирует | Оркестратор — главная сессия | `task-planner` |
| Где лежит план | В чате: план и брифы до 10 строк | Файл `plans/<дата>-<имя>.md` |
| Кто пишет код | `builder` | `task-implementer` |
| Кто проверяет | Оркестратор и `reviewer` | `task-reviewer` |
| Память проекта | `docs/` | Файл плана |

В этом репозитории действует схема из `AGENTS.md`: она загружается в каждую сессию как инструкция проекта. Оба конвейера срабатывают на одни и те же фразы — «сделай», «добавь», «напиши», — и их приоритет нигде не прописан. Если нужен конкретный, вызывайте его по имени.

## 5. Субагенты

Субагент — помощник на дешёвой модели, которого главная сессия (оркестратор) запускает через инструмент Agent. Пользователю отдельная команда не нужна: достаточно описать задачу, роли оркестратор распределит сам.

### 5.1. Кто есть кто

| Субагент | Модель | Инструменты | За что отвечает |
|---|---|---|---|
| `builder` | GLM-5.3-Flash, max | Чтение, правка и запись файлов, Bash | Пишет код и тесты по брифу и сам гоняет проверку из «Done when» |
| `reviewer` | GLM-5.3-Flash, max | Чтение, Bash | Сверяет изменения с брифом и конвенциями |
| `researcher` | GLM-5.3-Flash, max | Чтение, Bash, веб | Собирает факты по коду для плана |

Все три описаны в `.zcode/agents/<имя>.md` и работают на плане Z.AI Individual Coding Plan. Оркестратор код сам не пишет, исключение — правки в одну-две строки.

**Правила `builder`'а:**

- Делает ровно то, что в брифе. Не рефакторит и не трогает несвязанные файлы.
- Перед правкой в `api/` или `ui/` читает скилл `write-autotests`.
- Баг чинит тестом: сначала пишет регрессионный тест, который падает, потом фикс.
- Не говорит «готово», пока проверка из «Done when» не прошла.

**Правила `reviewer`'а.** Только читает. Сверяет с брифом по пунктам и ищет лишнее: изменения вне брифа и попутные рефакторинги. Вердикт один из трёх: `соответствует брифу`, `есть расхождения`, `бриф невыполним как написан`.

**Правила `researcher`'а.** Только читает. Каждый факт сообщает с путём к файлу и номером строки. Чего не нашёл, честно пишет «не нашёл».

### 5.2. Как устроен цикл

1. Задача приходит от вас или берётся из `docs/backlog.md`.
2. Оркестратор читает `docs/`. Не хватает фактов по коду — спрашивает `researcher`'а.
3. Оркестратор показывает вам план и брифы. Запуск — только после одобрения.
4. `builder` пишет код и сам гоняет «Done when». Независимые брифы идут параллельно.
5. Оркестратор сам повторяет проверку и гейт: словам `builder`'а не верят. Три возврата — стоп и вопрос вам.
6. `reviewer` сверяет diff с брифом.
7. Оркестратор записывает итог в `docs/` и отчитывается.

Развилки решаются панелью с вариантами: 2–4 варианта, рекомендованный — первым.

### 5.3. Три «ревьюера»: не путать

| Имя | Что это | Кто вызывает |
|---|---|---|
| `reviewer` | Проектный субагент | Оркестратор, после приёмки задачи |
| `/review-changes` | Глобальный скилл с прогоном гейтов | Вы |
| `task-reviewer` | Субагент конвейера `/task-pipeline` | Скилл `task-pipeline` |

## 6. 20 рулов TypeScript

«20 рулов» — свод правил, сформулированных по опыту этого репозитория. Полная версия с кейсами — в `TYPESCRIPT_RULES.md` в корне. Здесь каждое правило в одну строку: что требует и кто проверяет. Примеры — в разделах 7–9.

Из двадцати правил 12 проверяют инструменты автоматически, 7 держит ревью и 1 остаётся рекомендацией.

| № | Правило | Что требует | Слой |
|---|---|---|---|
| 1 | `strict: true` без послаблений | Ошибка компилятора — контракт, а не помеха. Флаги не отключать, за `@ts-ignore` не прятать | Компилятор |
| 2 | `exactOptionalPropertyTypes` | Поле `title?: string` нельзя явно положить `undefined`: либо строка, либо поля нет | Компилятор |
| 3 | `verbatimModuleSyntax` | Типы и значения импортируются по-разному: тип — только через `import type` | Компилятор |
| 4 | `noUncheckedIndexedAccess` | `items[0]` имеет тип `string \| undefined`: элемента может не быть | Компилятор |
| 5 | `noPropertyAccessFromIndexSignature` | Поле без явного объявления — только в скобках: `post["userId"]` | Компилятор |
| 6 | Гигиена | Мёртвый код и забытые ветки не живут: неиспользуемые переменные, потерянный `return`, `switch` без `break`, `console.log` | Компилятор, линтер |
| 7 | Никакого `any` | Неизвестное — `unknown`, дальше доказывай тип. `any` выключает проверку по всей цепочке | Линтер |
| 8 | Валидация на границе | Ответ API и переменные окружения проходят через схему до использования | Конвенция |
| 9 | Branded-типы для id | `PostId(1)` вместо голого числа: нельзя передать `userId` туда, где ждут `postId` | Конвенция, компилятор |
| 10 | `satisfies` вместо проверочного `as` | Проверить совместимость, не теряя точный тип | 💡 Рекомендация |
| 11 | Касты с обоснованием | `as unknown as T` — только с комментарием, почему это осознанно | Конвенция |
| 12 | Статусы и коды — enum | `HttpStatusCode.OK`, а не `200` | Конвенция |
| 13 | Каждый промис обработан | `await`, `.catch` или явный `void` | Линтер |
| 14 | `async` не там, где ждут sync | `async`-колбэк нельзя передать туда, где рассчитывают на синхронный | Линтер |
| 15 | Мёртвого `async` не бывает | Нет `async` без `await` и `await` не-промиса | Линтер |
| 16 | `import type` для типов | Чистые типы импортируются как типы | Компилятор, линтер |
| 17 | Порядок импортов — машине | Расстановка — только `npm run lint:fix`. Баррел-файлы не плодить | Линтер, конвенция |
| 18 | Исчерпывающий `switch` через `never` | Добавили вариант в enum — компилятор покажет каждый незакрытый `switch` | Конвенция, компилятор |
| 19 | Окружение читается лениво | `requireEnv` — в момент использования, а не при импорте модуля | Конвенция |
| 20 | Зависимости — через конструктор | Локаторы и остальные поля присваиваются в теле конструктора, а не при объявлении | Конвенция |

## 7. Компилятор

**Как вызвать:** `npm run typecheck` — это `tsc --noEmit`. Настройки лежат в `tsconfig.json`. Ошибка компилятора останавливает гейт.

| Флаг | Что значит | Нарушение | Что скажет компилятор |
|---|---|---|---|
| `strict` | Строгий режим целиком: нет неявных `any`, `null` и `undefined` — отдельные типы | `function parse(data) { return data; }` | `TS7006: Parameter 'data' implicitly has an 'any' type.` |
| `exactOptionalPropertyTypes` | Опциональному полю нельзя присвоить `undefined`, его можно только не задавать | `const patch: PatchPostRequest = { title: undefined };` | `TS2375: Type '{ title: undefined; }' is not assignable to type 'PatchPostRequest' with 'exactOptionalPropertyTypes: true'.` |
| `verbatimModuleSyntax` | Тип импортируется только как тип | `import { CreatePostRequest } from "./postRequests";`, хотя это интерфейс | `TS1484: 'CreatePostRequest' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.` |
| `noUncheckedIndexedAccess` | Чтение по индексу даёт `T \| undefined` | `return items[0];` там, где ждут `string` | `TS2322: Type 'string \| undefined' is not assignable to type 'string'.` |
| `noPropertyAccessFromIndexSignature` | Поле без явного объявления — только в скобках | `post.userId = 1;`, где `post: Record<string, unknown>` | `TS4111: Property 'userId' comes from an index signature, so it must be accessed with ['userId'].` |
| `noUnusedLocals`, `noUnusedParameters` | Неиспользуемая переменная или параметр — ошибка | Параметр `n`, который нигде не читается | `TS6133: 'n' is declared but its value is never read.` |
| `noImplicitReturns` | Функция, возвращающая значение, обязана вернуть его на каждой ветке | `if (n > 0) { return 1; }` — и больше ничего | `TS2366: Function lacks ending return statement and return type does not include 'undefined'.` |
| `noFallthroughCasesInSwitch` | `case` не может провалиться в следующий без `break` | `case 1:` с кодом и без `break` перед `case 2:` | `TS7029: Fallthrough case in switch.` |
| `useUnknownInCatchVariables` | В `catch` пришло неизвестное: сначала проверь | `catch (e) { return e.message; }` | `TS18046: 'e' is of type 'unknown'.` |
| `noImplicitOverride` | Метод, перекрывающий родительский, — с `override` | Метод наследника без `override` | `TS4114: This member must have an 'override' modifier because it overrides a member in the base class 'Base'.` |

**Как это чинят:**

```ts
// exactOptionalPropertyTypes: поле не задаём вовсе
const patch: PatchPostRequest = {};

// noUncheckedIndexedAccess: сначала проверили, потом использовали
const first = items[0];
if (first === undefined) {
  throw new Error("Response is empty");
}

// useUnknownInCatchVariables
function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// noPropertyAccessFromIndexSignature
post["userId"] = userId;
```

Запрет `console` — не флаг компилятора, его держит линтер (раздел 8.2).

## 8. Линтер

### 8.1. Что линтится и что значат уровни

```bash
npm run lint       # только проверить
npm run lint:fix   # поправить то, что чинится автоматически
```

- Настройки — `eslint.config.mjs`.
- Линтятся `ui/**/*.ts`, `api/**/*.ts`, `playwright.config.ts`, `eslint.config.mjs`. Markdown не линтится.
- `error` делает гейт красным. `warn` виден в выводе, но гейт не роняет: в скрипте нет `--max-warnings 0`.
- Полный список действующих правил для файла: `npx eslint --print-config <файл>`.

### 8.2. Стиль

| Что | Требование |
|---|---|
| Кавычки | Только двойные. Одинарные — чтобы не экранировать двойные внутри строки |
| Точки с запятой | Всегда |
| Отступ | 2 пробела |
| Запятые | В конце каждого элемента многострочной конструкции |
| Длина строки | ≤ 120, уровень `warn`. Линтер не проверяет строки, где есть текст в кавычках, шаблон или комментарий, поэтому длинный импорт пройдёт молча |
| Скобки у стрелочных функций | Всегда: `(x) => ...` |
| Переносы строк | Оператор — в конце строки. Объект, массив и аргументы вызова — либо в одну строку, либо по элементу на строку |

Правила стиля, кроме длины строки, чинятся автоматически, поэтому учить их наизусть не нужно: после написания кода запустите `npm run lint:fix`.

Из базовых правил стоит знать три:

- `no-console` — `console.log` запрещён, `Unexpected console statement`. Логи API — через `ApiLogger`.
- `no-shadow` — переменная во вложенной области не может заслонять внешнюю.
- `prefer-template` — шаблонная строка вместо конкатенации через `+`.

Имена тестов, степов и сообщений — на английском: `Check 'GET /albums' endpoint`, `Select 'find' button`. Комментарии-объяснения «почему» можно писать по-русски.

### 8.3. TypeScript

| Правило | Уровень | Что ловит | Что скажет линтер |
|---|---|---|---|
| `explicit-function-return-type` | error | Функция без типа возврата | `Missing return type on function` |
| `no-explicit-any` | error | `any` | `Unexpected any. Specify a different type` |
| `no-floating-promises` | error | Промис, который никто не ждёт | `Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the 'void' operator` |
| `await-thenable` | error | `await` не-промиса | `Unexpected 'await' of a non-Promise (non-"Thenable") value` |
| `no-misused-promises` | error | `async`-колбэк там, где ждут синхронный | `Promise returned in function argument where a void return was expected` |
| `no-unused-vars` | error | Неиспользуемый импорт или переменная | `'HttpStatusCode' is defined but never used` |
| `consistent-type-imports` | error | Тип импортирован как значение | `All imports in the declaration are only used as types. Use 'import type'` |
| `no-unsafe-return` | error | Возврат значения типа `any` из функции | — |
| `no-unnecessary-type-assertion` | error | Лишний `as` | — |
| `require-await` | warn | `async` без `await` | `Async arrow function has no 'await' expression` |

Промисы — на примере:

```ts
// ❌ no-floating-promises: промис никто не ждёт
async function cleanup(): Promise<void> {
  deleteTempFiles();
}

// ✅ дождались
async function cleanup(): Promise<void> {
  await deleteTempFiles();
}

// ✅ намеренно не ждём результат — помечаем явно
function cleanup(): void {
  void deleteTempFiles();
}
```

Два уточнения:

- Явный тип возврата нужен функциям и методам. Колбэки тестов `test("...", async ({ page }) => { ... })` линтер не помечает.
- `npm run lint:fix` сам заменяет `any` на `unknown`.

### 8.4. Импорты

`import-x/order` требует определённый порядок, и между группами — пустую строку:

1. Пакеты: `@playwright/test`, `zod`.
2. Модули проекта через алиас `@@/`. Для API: `fixtures` → `clients` → `assertions` → `data` → `types` → `utils`. Для UI: `fixtures` → `steps` → `pages` → `components`.

Имена внутри фигурных скобок идут по алфавиту.

Расставлять импорты руками не нужно: их ставит `npm run lint:fix`.

| Правило | Уровень | Что ловит |
|---|---|---|
| `import-x/order` | error | Неправильный порядок или нет пустой строки: `There should be at least one empty line between import groups` |
| `import-x/newline-after-import` | error | Нет пустой строки после импортов |
| `import-x/no-unresolved` | error | Импорт из несуществующего модуля |
| `import-x/no-duplicates` | warn | Два импорта из одного модуля |

### 8.5. Playwright

Правила приходят из рекомендованного набора `eslint-plugin-playwright`: 37 правил. Самые заметные:

| Уровень | Правило | Что ловит |
|---|---|---|
| error | `no-focused-test` | `test.only` в коде: `Unexpected focused test` |
| error | `no-standalone-expect` | `expect` вне теста и хука |
| error | `prefer-web-first-assertions` | `expect(await locator.isVisible())` вместо `expect(locator).toBeVisible()` |
| error | `valid-expect`, `valid-title`, `valid-test-tags` | Ошибки в написании `expect`, названий тестов и тегов |
| error | `no-networkidle`, `no-wait-for-navigation` | Устаревшие и ненадёжные ожидания |
| error | `missing-playwright-await` | Забытый `await` у вызова Playwright |
| error | `no-unused-locators` | Результат `page.locator(...)` не используется |
| warn | `no-skipped-test` | `test.skip`: ``Unexpected use of the `.skip()` annotation`` |
| warn | `expect-expect` | В тесте нет ни одной проверки: `Test has no assertions` |
| warn | `no-wait-for-timeout`, `no-page-pause` | Жёсткие ожидания и паузы |
| warn | `no-conditional-in-test` | Условная логика в тесте |

`test.only` и `test.skip` запрещены. Если `skip` неизбежен, с Playwright 1.65 указывайте причину — она попадает в отчёт:

```ts
test.skip("Not implemented yet");
```

### 8.6. JSON

Файлы `{ui,api}/**/*.json` оформляются теми же привычками: двойные кавычки, отступ 2, ключи в кавычках, без запятых в конце. Сейчас таких файлов в проекте нет.

### 8.7. Регистрация `check*` в `assertFunctionPatterns`

Линтер Playwright следит, чтобы в каждом тесте была проверка. Он узнаёт проверки по именам: `expect` плюс список в `eslint.config.mjs` → `playwright/expect-expect` → `assertFunctionPatterns`.

Новый `check*` нужно добавить в этот список. Иначе каждый тест, где есть только этот метод, получит предупреждение `Test has no assertions`:

```ts
// тест отреагирует предупреждением: checkSomething в списке нет
test("with check-named call", async () => {
  checkSomething();
});
```

Правило включено с уровнем `warn`, поэтому забытая регистрация гейт не роняет. Регистрировать всё равно обязательно. Имя добавляют в нужный раздел массива — `// API assertions` или `// UI assertions`:

```js
"playwright/expect-expect": [
  "warn",
  {
    assertFunctionPatterns: [
      // API assertions
      "checkStatusCode",
      "checkJSONResponseSchemaZod",
      // ...
      // UI assertions
      "checkBlockOnPage",
      // ...
    ],
  },
],
```

Сейчас в списке 27 имён: 7 для API и 20 для UI.

## 9. Конвенции кода

Эти правила инструменты не проверяют или проверяют лишь частично. Их держат скилл `write-autotests`, `reviewer` и люди на ревью.

### 9.1. Спек тонкий

Тело теста — только вызовы клиента или степов и ассерты. В спеке нет `request.get`, `page.locator` и сырого `expect`. Так спек читается как сценарий, а техническое живёт в клиентах и степах, где его переиспользуют.

API, `api/tests/noAuth/posts.spec.ts`:

```ts
test("Check 'GET /posts' endpoint @smoke", async ({ postsApiClient, requestAssertions }) => {
  const response = await postsApiClient.getAllPosts();
  await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.OK);
  await requestAssertions.checkJSONResponseSchemaZod(PostsArraySchema, response);
});
```

UI, `ui/tests/main/searchJob.spec.ts`:

```ts
import { liveSiteConsoleNoise } from "@@/ui/data/consoleNoise";

import { test } from "@@/ui/fixtures/fixture";

test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] });

test.describe("Search jobs and check browser console", () => {
  test.beforeEach(async ({ mainPageSteps }) => {
    await mainPageSteps.navigateToPage();
    await mainPageSteps.cookieBannerSteps.acceptCookiesPolicyIfVisible();
  });

  test("Search 'Javascript' jobs", async ({ mainPageSteps }) => {
    await mainPageSteps.typeTextInSearchField("Javascript");
    await mainPageSteps.selectFindButton();
    await mainPageSteps.registrationModalSteps.selectModalCloseButton();
    await mainPageSteps.checkCurrentUrl("Javascript");
  });
});
```

А так выглядит нарушение — сразу трёх правил:

```ts
// ❌ запрос мимо клиента, сырой expect, статус числом
test("Check posts", async ({ request }) => {
  const response = await request.get("https://jsonplaceholder.typicode.com/posts");
  expect(response.status()).toBe(200);
});
```

**Имена.** Для API `describe` называется `Check 'POSTS' endpoint (Zod validation)`, мутации выносятся в отдельный `describe` с припиской `mutations`. Тест повторяет метод и путь: `Check 'GET /todos' endpoint`. Негативный сценарий — отдельный тест: `Check 'GET /todos/{id}' with non-existing todo returns error`. Для UI `describe` — имя страницы, `"Main page:"`, или название сценария.

### 9.2. `test.step` внутри, а не в спеке

Клиенты оборачивают запросы, степы — действия и проверки, ассерты — сами проверки. Благодаря этому отчёт получается деревом шагов. В спеке `test.step` вручную не добавляют: выйдет вложенный дубль.

Клиент, `api/clients/postsApiClient.ts`:

```ts
getPostById(id: PostId): Promise<APIResponse> {
  return test.step(`Get post by id "${id}" request`, () => this.getMethod(URLS.POSTS.POSTS_ID(id)), {
    subtitle: URLS.POSTS.POSTS_ID(id),
    params: { id },
  });
}
```

Ассерт, `api/assertions/RequestAssertions.ts`:

```ts
async checkStatusCode(actualStatusCode: number, expectedStatusCode: HttpStatusCode): Promise<void> {
  await test.step(`Check status code should be equal to: ${expectedStatusCode}`, () => {
    this.expect(actualStatusCode).toEqual(expectedStatusCode);
  });
}
```

Степ, `ui/steps/pages/searchResultsPage.steps.ts`:

```ts
async checkResultsHeaderContains(text: string): Promise<void> {
  await test.step(`Check search results header contains "${text}"`, async () => {
    const headerText = await this.searchResultsPage.getSearchResultsHeaderText();

    expect(headerText).toContain(text);
  }, { params: { text } });
}
```

Третий аргумент `test.step` — метаданные для отчёта:

- `subtitle` — путь запроса. В UI не используется.
- `params` — аргументы метода, ключи называются как параметры. Аргументов нет — `params` не добавляют. Нескалярные значения вроде `Locator` или `Page` туда не передают.

Запрос и ответ в отчёт аттачатся автоматически в `BaseApiClient`.

**Имена методов клиента:** `get*`, `create*` для POST, `update*` для PUT, `patch*` для PATCH, `delete*` для DELETE. Клиент ничего не проверяет: парсинг и проверки — работа ассертов.

### 9.3. `test` только из фикстур проекта

| Слой | Откуда импортировать `test` |
|---|---|
| API | `@@/api/fixtures/fixtures` — во множественном числе |
| UI | `@@/ui/fixtures/fixture` — в единственном |

Импортировать `test` в спеке из `@playwright/test` нельзя. Фикстуры добавляют то, без чего тест не работает: клиентов (`postsApiClient`), ассерты (`requestAssertions`), наборы степов (`mainPageSteps`), а для UI — ещё и мониторинг ошибок страницы.

В степах и клиентах `test` импортируется из `@playwright/test`: он нужен там ради `test.step`.

### 9.4. Статусы — enum, id — branded

```ts
// ❌ магические числа
await requestAssertions.checkStatusCode(response.status(), 200);
const response = await todosApiClient.getTodoById(999999);

// ✅
await requestAssertions.checkStatusCode(response.status(), HttpStatusCode.NOT_FOUND);
const response = await todosApiClient.getTodoById(TodoId(999999));
```

Статус числом компилятор пропустит, поэтому это конвенция. Enum `HttpStatusCode` лежит в `api/types/common/httpStatusCode.ts` и содержит 12 значений: от `OK = 200` до `SERVICE_UNAVAILABLE = 503`.

Branded-типы — в `api/types/common/brandedTypes.ts`, их шесть: `AlbumId`, `CommentId`, `PhotoId`, `PostId`, `TodoId`, `UserId`.

```ts
export type PostId = number & { readonly __brand: unique symbol };

export const PostId = (id: number): PostId => {
  assertPositiveIntId("PostId", id);

  return id as PostId;
};
```

Бренд не даёт перепутать аргументы: `getTodoById(1)` не скомпилируется, потому что функция ждёт `TodoId`. Конструктор заодно проверяет значение в рантайме — id обязан быть целым числом не меньше 1.

### 9.5. Схемы строгие: `z.strictObject`

```ts
export const PostSchema = z.strictObject({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export type Post = z.infer<typeof PostSchema>;
```

Строгая схема падает на любом лишнем поле. `z.object` лишнее поле молча выкинет, и «протечку» никто не заметит. Если поле нужно игнорировать, это осознанное решение, а не дефолт.

- Схемы ответов: `api/types/response/<провайдер>/<ресурс>/zod/<ресурс>Schemas.ts`. Рядом тип через `z.infer`, массив — отдельной схемой.
- Пустой ответ описывают явно: `z.strictObject({})`.
- Типы запросов: `api/types/request/<провайдер>/<ресурс>/<ресурс>Requests.ts`, только для POST, PUT и PATCH.
- Перед тем как писать схему, посмотрите реальный ответ: в логах `ApiLogger`, через curl или в существующих спеках.

### 9.6. URL только в `api/data/urls.ts`

```ts
export const URLS = {
  POSTS: {
    POSTS_ALL: "/posts",
    POSTS_ID: (id: PostId): string => `/posts/${id}`,
  },
} as const;
```

Спек никогда не содержит URL, только вызов метода клиента. Путь с параметром собирает функция-билдер, а не конкатенация строк в клиенте.

### 9.7. UI: тест → степы → Page Object

| Слой | Папка | Что умеет | Чего не умеет |
|---|---|---|---|
| Спек | `ui/tests/<страница>/<фича>.spec.ts` | Вызывать степы | Локаторы, `expect`, `page.*` |
| Степы | `ui/steps/` | Действия и проверки в `test.step` | Хранить локаторы |
| Page Object | `ui/pages/` | Селекторы страницы и простые методы | Ассерты, `test.step` |
| Component Object | `ui/components/` | Селекторы переиспользуемого блока | Ассерты, `test.step` |

**Имена методов.** В Page Object: `get*` — прочитать, `select*` — кликнуть, `typeTextIn*` — ввести, `wait*` — дождаться. В степах: `check*` — проверка, `select*` — клик, `typeTextIn*` — ввод, `navigateToPage` — навигация.

**Где живут степы компонента:**

- Компонент есть на всех страницах — в `CommonSteps`: `navigationSteps`, `registrationModalSteps`, `cookieBannerSteps`.
- На нескольких, но не на всех, — точечно в степах нужных страниц.
- Только на этой странице — степы страницы работают напрямую с её Page Object.

Степы страницы наследуют `CommonSteps` и объявляют `readonly url: string` — путь относительно `baseURL`. `navigateToPage()` и `checkCurrentUrl(url)` уже есть в `CommonSteps`.

**Приоритет локаторов:** сначала `[data-qa='...']`, затем `getByRole` и `getByText`, потом CSS по стабильным атрибутам. XPath — крайняя мера.

Component Object создаётся внутри степов, а не в спеке.

### 9.8. Локаторы только в конструкторе

```ts
// ❌ падает в рантайме, хотя линт и компилятор зелёные
export class SearchResultsPage extends BasePage {
  readonly nextResultsButton = this.page.locator("[data-qa='pager-next']");
}

// ✅
export class SearchResultsPage extends BasePage {
  readonly nextResultsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nextResultsButton = this.page.locator("[data-qa='pager-next']");
  }
}
```

При `target: ESNext` в `tsconfig.json` поля класса инициализируются до тела конструктора. Значение при объявлении прочитает `this.page` до того, как оно присвоено, и упадёт с `TypeError`. Это рул 20, и линт его не ловит.

### 9.9. Aria-снапшоты вместо пикселей

Живой сайт с динамическим контентом: пиксельные диффы на нём флакали бы. Снапшот фиксирует структуру блока — роли, тексты, уровни заголовков — и не зависит от вёрстки.

```ts
// ui/data/snapshots/searchResultBlocks.ts
export const searchResultBlocks: Record<SearchResultBlockName, string> = {
  emptySearchBlock: `
    - img
    - heading "Ничего не нашлось" [level=2]
    - text: Попробуйте изменить запрос или фильтры
  `,
};
```

```ts
// ui/steps/pages/searchResultsPage.steps.ts
async checkBlockOnPage(blockName: SearchResultBlockName): Promise<void> {
  await test.step(`Check block ${blockName} using snapshots`, async () => {
    const block = this.searchResultsPage.getBlock(blockName);

    await expect(block).toMatchAriaSnapshot(searchResultBlocks[blockName]);
  }, { params: { blockName } });
}
```

Текущий снапшот блока получают через `locator.ariaSnapshot()` или codegen. Если тест упал, правьте `blocks.ts` осознанно, а не вслепую копируя новую выдачу.

### 9.10. Переменные окружения

Переменные читают только через утилиты из `api/utils/envUtils.ts`:

```ts
export const optionalEnv = (name: string): string | undefined => process.env[name];

export const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`❌ Missing required env var: ${name}`);
  }
  return value;
};
```

- `.env` не коммитится. Шаблон — `.env.example`.
- `requireEnv` вызывается в момент использования, а не при импорте модуля. Иначе запуск `--project=ui` потребовал бы переменные всех проектов.
- `API_KEY` нужен только для роли `UserRole.AUTHORIZED`.
- К `process.env` обращаются только в скобках: `process.env["API_KEY"]`. Это рул 5.

### 9.11. Исчерпывающий `switch` через `never`

```ts
default: {
  const _exhaustive: never = role;
  throw new Error(`Unknown: ${_exhaustive}`);
}
```

Добавите вариант в enum — и компилятор покажет каждый `switch`, который его не учёл. Эталон в проекте — `getAuthHeaders` в `api/utils/headerUtils.ts`.

### 9.12. Касты с обоснованием

Прямой `as` уместен, когда типы пересекаются. Двойной `as unknown as T` — только с комментарием, почему это осознанно.

Билдеры тел запросов нарушают тип намеренно, чтобы собирать негативные сценарии, и честно об этом пишут:

```ts
public build(): CreatePostRequest {
  // Задокументированная «ложь» типов: см. комментарий к классу
  return this.post as unknown as CreatePostRequest;
}
```

По той же причине билдеры пишут `this.post["userId"] = userId;` в скобках: рул 5.

### 9.13. Ошибки живого сайта

Две фикстуры в `ui/fixtures/fixture.ts` следят за здоровьем страницы и роняют тест:

- `pageWithMonitoring` собирает ответы со статусом ≥ 400. После теста аттачит `failed-requests.json` и падает. Списка исключений для HTTP нет.
- Переопределённая `page` собирает непойманные JS-ошибки и ошибки консоли. Ошибки из `jsErrorAllowlist` уходят в аттач `allowed-console-errors.json`, остальные — в `failOnConsole.json`, после чего тест падает, если включён `failOnJSError`.

Шум глушат `allowlist`-ом с комментарием-обоснованием, а не выключением `failOnJSError`. Отключение — крайняя мера на случай, когда шум не выражается регуляркой.

```ts
import { liveSiteConsoleNoise } from "@@/ui/data/consoleNoise";

test.use({ jsErrorAllowlist: [liveSiteConsoleNoise] });
```

Всё известное шума сайта уже собрано одним общим RegExp в `ui/data/consoleNoise.ts`. Новый шум добавляйте туда, а не в спек.

## 10. Правила работы

Эти правила про процесс, а не про код. Полная версия — в `AGENTS.md`.

| Правило | Что значит |
|---|---|
| Использовать существующие компоненты | Не изобретать второй `BaseApiClient` |
| Не добавлять зависимости без согласования | Сначала спросить |
| Баг — с регрессионным тестом | Сначала тест, который падает, потом фикс |
| Не менять несвязанный код | Попутный рефакторинг — отдельной задачей |
| Показывать план до запуска | План и брифы — на одобрение пользователю |
| Приёмка — по своему прогону | Оркестратор сам повторяет проверку `builder`'а |
| Держать контекст чистым | Большие файлы читает `researcher`, а не оркестратор |
| Отчитаться в финале | Изменённые файлы и результаты проверок |

Память проекта — `docs/`, её ведёт оркестратор:

| Файл | Что в нём |
|---|---|
| `progress.md` | Что сделано |
| `decisions.md` | Решения и причины |
| `known-issues.md` | Ловушки и обходы |
| `backlog.md` | Очередь задач |

## 11. Гейт

| Команда | Что проверяет | Когда |
|---|---|---|
| `npm run typecheck` | Правила компилятора | Всегда перед сдачей |
| `npm run lint` | Правила линтера | Всегда перед сдачей |
| `npm run lint:fix` | Автофикс стиля и порядка импортов | После написания кода |
| `npx playwright test <файл> --project=<проект>` | Затронутые спеки | На каждой итерации |
| `npm run test:api:no_oauth` | Все API-тесты, проект `noOAuth` | Перед сдачей |
| `npm run test:ui` | Все UI-тесты: живой сайт, медленно | Перед сдачей |
| `npm run test:smoke` | Только тесты с `@smoke`, API и UI | Быстрая проверка |
| `npm run test:all` | Оба проекта | Финальный прогон |

Каждый скрипт `test:*` перед запуском стирает `allure-results`.

**Перед коммитом** husky запускает `lint-staged`: для индексируемых `.ts` и `.json` — `typecheck`, для `.ts`, `.json` и `.mjs` — `eslint --fix`.

**В CI** job `static-checks` гоняет `typecheck` и `lint`, затем тесты обоих проектов идут в Docker.

## 12. Ловушки

| Симптом | Причина | Обход |
|---|---|---|
| Тест падает с `TypeError`, хотя линт и компилятор зелёные | Локатор объявлен при поле: Playwright 1.65 плюс `target: ESNext` | Присваивать локаторы в конструкторе, раздел 9.8 |
| `test.use({ jsErrorAllowlist: [a, b] })` молча теряет второй RegExp | Playwright 1.65 трактует массив из двух элементов как кортеж значения и настроек | Один объединённый RegExp: `liveSiteConsoleNoise`, раздел 9.13 |
| `post.userId` не компилируется | `noPropertyAccessFromIndexSignature` | `post["userId"]`, рул 5 |
| Строка длиннее 120 прошла линт | `max-len` — `warn`, и он не смотрит строки с текстом в кавычках, шаблоном или комментарием | Всё равно держать ≤ 120 |
| Забытая регистрация `check*` не роняет линт | `expect-expect` стоит как `warn` | Регистрировать всегда, раздел 8.7 |
| Линтер ругается на условный клик в степе | `no-conditional-in-test`, уровень `warn` | Оправдать осознанно: `eslint-disable-next-line` с комментарием «почему». Так сделано в `cookieBanner.steps.ts` |
| UI-тест упал на сторонний ответ ≥ 400 | `pageWithMonitoring` не имеет исключений для HTTP | Известное ограничение, записано в `docs/known-issues.md` |

## 13. Где что лежит

| Путь | Что там |
|---|---|
| `AGENTS.md` | Правила работы агента, схема «мозг и руки», жёсткие конвенции |
| `.agents/skills/write-autotests/` | Скилл конвенций: `SKILL.md` и 11 справочников в `references/` |
| `.agents/skills/reflect/SKILL.md` | Скилл итога сессии |
| `.zcode/agents/` | Субагенты `builder`, `reviewer`, `researcher` |
| `docs/` | Память проекта: `progress`, `decisions`, `known-issues`, `backlog` |
| `tsconfig.json` | Флаги компилятора |
| `eslint.config.mjs` | Правила линтера, `assertFunctionPatterns`, порядок импортов |
| `package.json` | Скрипты и `lint-staged` |
| `playwright.config.ts` | Проекты `noOAuth` и `ui`, репортеры, таймауты |
| `.env.example` | Шаблон переменных окружения |
| `api/utils/envUtils.ts` | `optionalEnv` и `requireEnv` |
| `api/types/common/httpStatusCode.ts` | enum статусов |
| `api/types/common/brandedTypes.ts` | Branded-типы id |
| `ui/data/consoleNoise.ts` | Общий RegExp шума живого сайта |
| `ui/data/snapshots/` | Aria-снапшоты |
| `ui/fixtures/fixture.ts` | Фикстуры UI и мониторинг ошибок |
| `README.md`, `ui/Readme.md` | Архитектура, запуск, иерархия UI |
| `TYPESCRIPT_RULES.md`, `SKILLS_IDEAS.md` в корне | 20 рулов с кейсами и 20 идей скиллов |
| `~/.zcode/skills/` | Глобальные скиллы `git-commit`, `review-changes`, `task-pipeline` |

## 14. Как добавить скилл или правило

| Что добавить | Куда | Что учесть |
|---|---|---|
| Проектный скилл | `.agents/skills/<имя>/SKILL.md` | Подробности — в папке `references/` |
| Глобальный скилл | `~/.zcode/skills/<имя>/SKILL.md` | В репозиторий не попадёт |
| Субагент | `.zcode/agents/<имя>.md` | Описание, модель, уровень и инструменты — в шапке файла |
| Новый `check*` | `eslint.config.mjs`, `assertFunctionPatterns` | Раздел 8.7 |
| Флаг компилятора | `tsconfig.json` | Плюс строка в `TYPESCRIPT_RULES.md` |
| Правило линтера | `eslint.config.mjs` | Проверить на коде-нарушителе |

Если создали или изменили скилл, а агент его не видит, начните новую сессию: скиллы подхватываются при старте.

Создать или поправить скилл помогает служебный скилл `skill-creator`.

Идеи новых скиллов — в `SKILLS_IDEAS.md` в корне: 20 идей, две реализованы (`git-commit`, `review-changes`), 18 ждут очереди. Для этого репозитория файл советует начинать с `flaky-hunter`, затем `root-cause-debug`, `release-notes-digest` и `regression-on-bug`.

## 15. Служебные скиллы ZCode

Кроме проектных и глобальных, агент видит встроенные скиллы плагинов ZCode. Большинство к тестам отношения не имеет: документы, таблицы, презентации, PDF, браузер. Для настройки проекта полезны три:

| Скилл | За что отвечает |
|---|---|
| `skill-creator` | Создать новый скилл или поправить существующий |
| `zcode-configuration-guide` | Где что настраивается: скиллы, хуки, MCP, `AGENTS.md` |
| `zcode-guide:diagnosing-*` | Диагностика, когда скилл, команда, хук, MCP или плагин не работают |
