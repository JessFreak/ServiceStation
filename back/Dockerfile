# Stage 1
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2
FROM node:20-alpine
WORKDIR /app

RUN apk update && apk upgrade
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

CMD ["node", "dist/main.js"]