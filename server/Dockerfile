FROM node:18-alpine3.17

# Set working directory
WORKDIR /app

# Install dependencies for native modules and OpenSSL for Prisma
RUN apk add --no-cache python3 make g++ openssl-dev openssl1.1-compat

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Start application
CMD ["npm", "run", "dev"]
