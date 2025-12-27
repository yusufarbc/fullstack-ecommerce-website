# System Architecture

The application adopts a **Microservices-based Architecture** running on Docker, ensuring separation of concerns, scalability, and ease of deployment.

## High-Level Overview

```mermaid
graph TD
    User[Customer] -->|HTTPS| Client[Client Service (React/Vite)]
    Staff[Admin] -->|HTTPS| Admin[Admin Service (Node.js/AdminJS)]
    
    Client -->|API Requests| API[API Service (Node.js/Express)]
    
    API -->|Read/Write| DB[(PostgreSQL Database)]
    Admin -->|Read/Write| DB
```

## Services

### 1. API Service (`/api`)
- **Role**: Public-facing REST API for the storefront.
- **Port**: 8080.
- **Responsibility**: Handles product listing, cart calculations, and guest checkout.
- **Design Pattern**: Controller-Service-Repository (SOLID).
    - **Controllers**: Handle HTTP requests/responses.
    - **Services**: Contain business logic (e.g., `OrderService`).
    - **Repositories**: Abstract database access (Prisma).
- **Security**: No authentication required for store endpoints.

### 2. Admin Service (`/admin`)
- **Role**: Internal Backoffice for staff.
- **Port**: 8081.
- **Responsibility**: Resource management (CRUD) for Products, Users, Orders.
- **Tech**: AdminJS with `@adminjs/prisma`.
- **Security**: Session-based authentication (`express-session`, `connect-pg-simple`) guarding all routes.
- **Design**: Modular configuration (`src/config/resources.js`, `src/config/auth.js`) adhering to SRP.

### 3. Database Service (`db`)
- **Role**: Shared persistence layer.
- **Tech**: PostgreSQL 15.
- **Schema**: Single schema shared by both API and Admin services. API handles schema migrations.

### 4. Client Service (`client`)
- **Role**: Frontend Storefront.
- **Tech**: React, Vite, Tailwind CSS.
- **Communication**: Proxies `/api` requests to the API container.

## Design Principles (SOLID)

- **Single Responsibility**: Each service (API vs Admin) has a single focus. Inside API, Classes (Service/Repo) have distinct duties.
- **Open/Closed**: `BaseRepository` allows extension without modification. `Container.js` allows swapping implementations (DI).
- **Dependency Inversion**: Controllers depend on Abstractions (injected Services), not concretions.
