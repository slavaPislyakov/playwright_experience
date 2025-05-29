# My custom playwright framework

## Run `API` tests

### Run API tests locally:

```bash
npm run test:api
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

3. Run docker-compose:

```bash
make docker-compose-run
```

1. Delete docker container after test-running:

```bash
make docker-compose-stop
```

## Run `visual` testing locally:

1. Run visual testing tests:

```bash
npm run playwright:test:visual_testing
```

2. Update existing screenshots:

```bash
npm run playwright:test:visual_testing:update
```

---

# TODO:

- add playwright aria snapshot testing
- add mobile testing like https://medium.com/the-testing-hub/testing-mobile-web-applications-with-playwright-8fc5214c6c2b
- fix all projects according to eslint rules
- add trace to report

## UI:

- докинуть ui тесты

## Common:

- докинуть степы для аллюр репорта
- Подумать как можно облегчить образ для докера

---

# Tips&Tricks

## Playwright: tips and tricks

1. `exceptionLogger` - фикстура для отлавливания ошибок на сайте в консоле
