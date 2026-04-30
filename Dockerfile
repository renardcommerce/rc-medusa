FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --legacy-peer-deps
COPY . .
RUN npm install --legacy-peer-deps
EXPOSE 9000
ENV NODE_ENV=production
CMD npx medusa build && npx medusa db:migrate && cd /app/.medusa/server && npx medusa start
