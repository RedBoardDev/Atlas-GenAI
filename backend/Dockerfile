FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY serverless.yml ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/serverless.yml ./

RUN npm install -g serverless@3

EXPOSE 3000

CMD ["serverless", "deploy", "--stage", "prod"]
