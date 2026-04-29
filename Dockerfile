FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm install --legacy-peer-deps

COPY . .

RUN npx medusa build

EXPOSE 9000

ENV NODE_ENV=production

CMD npx medusa db:migrate && npx medusa start
