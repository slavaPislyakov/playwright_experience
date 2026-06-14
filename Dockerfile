FROM mcr.microsoft.com/playwright:v1.60.0-noble

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Установка браузеров Playwright (обязательно при несовпадении версий)
RUN npx playwright install

COPY . .

ENV TZ=Europe/Minsk
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD npm run ${TEST_SCRIPT:-test:all}