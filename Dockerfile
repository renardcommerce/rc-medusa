FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm install --legacy-peer-deps

COPY . .

RUN npx medusa build

WORKDIR /app/.medusa/server

RUN npm install --legacy-peer-deps

EXPOSE 9000

ENV NODE_ENV=production

CMD cd /app && npx medusa db:migrate && cd /app/.medusa/server && npx medusa start
