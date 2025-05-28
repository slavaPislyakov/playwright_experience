# My custom playwright framework

## Run tests:

```bash

```

### Run tests for specific project:

### Run `API` tests locally:

```bash
npx playwright test --project=API
```

### Run API tests in docker:

1. build docker image:

```bash
make docker-build
```

2. run make command:

```bash
make docker-run
```

### Run `VISUAL TESTING` locally:

1. Run visual testing tests:

```bash
npm run playwright:test:visual_testing
```

2. Update existing screenshots:

```bash
npm run playwright:test:visual_testing:update
```

# TODO:

- add playwright aria snapshot testing
- add snapshots/screenshots testing for a few pages
- add mobile testing like https://medium.com/the-testing-hub/testing-mobile-web-applications-with-playwright-8fc5214c6c2b
- fix all projects according to eslint rules

## API:

- докинуть для проверки схемы JSONSchemaType с AJV
- познакмиться с options для ajv

## UI:

- докинуть ui тесты

## Common:

- докинуть степы для аллюр репорта
- Подумать как можно облегчить образ для докера

## ESLint template

```js
export default [
  { ignores: ["**/.angular/*", "**/test/*"] },
  {
    files: ["**/*.ts"],
    languageOptions: {},
    plugins: {},
    rules: {},
  },
];
```

---

# Playwright: tips and tricks

1. `exceptionLogger` - фикстура для отлавливания ошибок на сайте в консоле
