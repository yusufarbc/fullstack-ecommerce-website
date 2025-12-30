# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate

# Stage 2: Runner
FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma

EXPOSE 8081
CMD ["node", "src/server.js"]
