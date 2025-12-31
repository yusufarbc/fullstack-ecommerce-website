# LuxeShop Monorepo 🛍️

**A production-ready, full-stack e-commerce solution built with the PERN stack (PostgreSQL, Express, React, Node.js).**

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://your-username.github.io/luxeshop-monorepo/)

![LuxeShop Architecture](./docs/etrade_software_arch.png)

## 🚀 Overview

LuxeShop is a modern e-commerce platform designed for speed, scalability, and a premium user experience. It features a completely custom React storefront with a "Luxe" industrial design theme, a robust REST API backend, and a dedicated AdminJS panel for comprehensive management.

**Key Features:**
*   **Storefront**: High-performance React application with a custom "LuxeShop" theme (Indigo/Pink palette), responsive design, and dynamic product filtering.
*   **Backend**: Secure Express.js REST API with Prisma ORM and Zod validation.
*   **Admin Panel**: Independent AdminJS service for managing products, orders, customers, and content.
*   **Payments**: Integrated Iyzico payment gateway (sandbox ready).
*   **Infrastructure**: Dockerized services with a production-ready `docker-compose` setup.

## 🏗️ Architecture

The repository is structured as a monorepo for easier development and deployment:

```
luxeshop-monorepo/
├── admin/                 # Admin Panel (AdminJS + Express)
├── api/                   # Backend API (Express + Prisma)
├── client/                # Storefront (React + Vite + Tailwind)
├── infra/                 # Infrastructure & Nginx configs
├── docker-compose.yml     # Container orchestration
└── .env.example           # Environment configuration
```

## 🛠️ Technology Stack

### Frontend (Client)
*   **React 18** & **Vite**: Fast development and building.
*   **Tailwind CSS**: Utility-first styling with a custom "Luxe" configuration.
*   **Axios**: Efficient HTTP requests.
*   **Lucide React**: Modern iconography.

### Backend (API)
*   **Node.js & Express**: Scalable server framework.
*   **Prisma ORM**: Type-safe database access for PostgreSQL.
*   **PostgreSQL 15**: Reliable relational database.
*   **Zod**: Runtime schema validation.
*   **JWT**: Secure stateless authentication.

### Admin Panel
*   **AdminJS**: Auto-generated admin interface.
*   **Express Session**: Secure session management for admins.

## 📦 Getting Started

### Prerequisites
*   **Docker & Docker Compose** (Recommended)
*   OR Node.js v18+ and PostgreSQL v15+ for local manual setup.

### Quick Start (Docker)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/luxeshop-monorepo.git
    cd luxeshop-monorepo
    ```

2.  **Configure Environment:**
    ```bash
    cp .env.example .env
    # Edit .env and update any placeholders (e.g., Database credentials, JWT secrets)
    ```

3.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    *This command builds all images (client, api, admin) and starts the database.*

4.  **Access the Services:**
    *   **Storefront**: [http://localhost:3000](http://localhost:3000)
    *   **API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
    *   **Admin Panel**: [http://localhost:8080/admin](http://localhost:8080/admin) (Proxied) or [http://localhost:8081/admin](http://localhost:8081/admin) (Direct)

### Default Admin Credentials
*   **Email**: `admin@example.com`
*   **Password**: `SecureAdminPassword!`
*(Please change these in your database or `.env` for production)*

## 🔧 Development

If you prefer running services individually without Docker:

**1. Database**
Ensure you have a PostgreSQL instance running and update `DATABASE_URL` in `.env`.

**2. Backend API**
```bash
cd api
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

**3. Client Storefront**
```bash
cd client
npm install
npm run dev
```

**4. Admin Panel**
```bash
cd admin
npm install
npx prisma generate
npm run dev
```

## 🔐 Security & Best Practices
*   **Helmet.js**: Applied for secure HTTP headers.
*   **Rate Limiting**: Configured for API endpoints.
*   **Input Validation**: All API inputs are validated using Zod schemas.
*   **Environment Variables**: Sensitive keys are never hardcoded.

## 📄 License

This project is open-sourced under the MIT License.
