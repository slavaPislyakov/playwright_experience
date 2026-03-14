# docker-build:
# 	docker build -t playwright-test .

# docker-run:
# 	docker run --rm -d -v ${PWD}:/app -v ${PWD}/playwright-report:/app/playwright-report -w /app playwright-test

# docker-compose-run:
# 	docker compose up -d

# docker-compose-stop:
# 	docker compose down


# ===new===
.PHONY: test test-oauth build rebuild test-report clean logs debug

test:
	docker compose up --build --abort-on-container-exit

test-oauth:
	TEST_SCRIPT=test:api:oauth docker compose up --build --abort-on-container-exit

test-no_oauth:
	TEST_SCRIPT=test:api:no_oauth docker compose up --build --abort-on-container-exit

test-ui:
	TEST_SCRIPT=test:ui docker compose up --build --abort-on-container-exit

build:
	docker compose build

rebuild:
	docker compose build --no-cache

test-report:
	npx playwright show-report playwright-report

clean:
	docker compose down -v
	rm -rf playwright-report

logs:
	docker compose logs -f

debug:
	docker compose run --rm playwright sh

help:
	@echo "make test          - запустить основную пачку тестов через docker compose"
	@echo "make test-oauth    - запустить API-тесты c авторизацией"
	@echo "make test-no_oauth - запустить API-тесты без авторизацией"
	@echo "make test-ui       - запустить UI-тесты"
	@echo "make build         - собрать Docker-образ"
	@echo "make test-report   - открыть HTML-отчёт Playwright"
	@echo "make clean         - удалить контейнеры, volumes и отчёт"
	@echo "make logs          - смотреть логи docker compose"
	@echo "make debug         - войти в контейнер в shell"
