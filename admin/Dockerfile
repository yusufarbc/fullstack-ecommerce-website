FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 8081

CMD ["npm", "start"]
