docker-build:
	docker build -t playwright-test .

docker-run:
	docker run --rm -d -v ${PWD}:/app -v ${PWD}/playwright-report:/app/playwright-report -w /app playwright-test

docker-compose-run:
	docker compose up -d

docker-compose-stop:
	docker compose down