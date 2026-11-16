# Образ уже содержит браузеры ровно этой версии; @playwright/test в package.json
# зафиксирован точной версией (без ^) — при обновлении зависимости менять тег синхронно
FROM mcr.microsoft.com/playwright:v1.65.0-noble

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV TZ=Europe/Minsk
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD npm run ${TEST_SCRIPT:-test:all}