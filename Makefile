.PHONY: test build rebuild test-report clean logs debug

test:
	docker compose up --build --abort-on-container-exit

test-no_oauth:
	TEST_SCRIPT=test:api:no_oauth docker compose up --build --abort-on-container-exit

test-ui:
	TEST_SCRIPT=test:ui docker compose up --build --abort-on-container-exit

test-smoke:
	TEST_SCRIPT=test:smoke docker compose up --build --abort-on-container-exit

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
	@echo "make test-no_oauth - запустить API-тесты без авторизацией"
	@echo "make test-ui       - запустить UI-тесты"
	@echo "make test-smoke    - запустить smoke-тесты (@smoke), API + UI"
	@echo "make build         - собрать Docker-образ"
	@echo "make test-report   - открыть HTML-отчёт Playwright"
	@echo "make clean         - удалить контейнеры, volumes и отчёт"
	@echo "make logs          - смотреть логи docker compose"
	@echo "make debug         - войти в контейнер в shell"
