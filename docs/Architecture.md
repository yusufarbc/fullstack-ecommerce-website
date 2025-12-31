# System Architecture

The application adopts a **Microservices-based Architecture** running on Docker, ensuring separation of concerns, scalability, and ease of deployment.

## High-Level Overview

![LuxeShop Architecture](./etrade_software_arch.png)

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

## Security Architecture

This architecture shifts from traditional monolithic risks to a "Defense in Depth" strategy:

### 1. Cloudflare: Outer Defense & Origin Cloaking
acting as a shield before traffic reaches the server:
- **IP Cloaking**: Attackers only see Cloudflare's Edge IPs. The origin server (Hetzner) remains hidden, preventing direct DDoS or brute-force attacks.
- **WAF & DDoS Protection**: Malicious bots and common vulnerabilities (SQLi, XSS) are filtered at the network edge by Cloudflare's Web Application Firewall.

### 2. Containerized Isolation (Sandboxing)
Services run in isolated Docker containers:
- **Blast Radius Control**: If a vulnerability compromises the API container, the attacker is trapped within that specific runtime. They cannot access the host OS or other containers (e.g., Database).
- **Least Privilege**: Containers contain *only* the binaries needed to run the app, significantly reducing the toolkit available to an intruder.

### 3. Prisma ORM: SQL Injection Immunity
- **Parameterized Queries**: By using Prisma ORM instead of raw SQL strings, all database inputs are automatically sanitized and treated as data, not executable code. This effectively eliminates SQL Injection vectors.

### 4. Cloudflare R2: Secure Asset Storage
Offloading user uploads to Object Storage (R2) instead of the local filesystem:
- **RCE Prevention**: A common attack vector is uploading a "Web Shell" (malicious script) as an image. Since files are stored in R2 (external storage) and not on the application server's disk, these scripts cannot be executed by the backend.
- **Access Control**: Eliminates the need for complex file permission management on the server.

### 5. Externalized Sensitive Operations
- **Payment Security (Iyzico)**: Credit card data enters the Payment Gateway's iframe directly. Raw card data **never** touches our backend, ensuring PCI-DSS compliance and reducing liability.
- **Email Security (Brevo)**: Using an external SMTP provider prevents our server IP from being blacklisted for spam and protects against phishing vectors associated with open relays.

### 6. Disaster Recovery & Ransomware Protection
- **Offsite Backups**: An automated cron job sends encrypted Docker Volume snapshots to **Google Drive** every 12 hours.
- **Resilience**: Even in a catastrophic event (Hardware failure or Ransomware encryption of the VPS), business operations can be restored from the external backup with minimal data loss.

## Future Recommendations: Zero Trust Network (Cloudflare Tunnel)

To further harden the infrastructure, implementing **Cloudflare Tunnel (Argo Tunnel)** is recommended to privatize the API access completely:

### 1. Reduced Attack Surface
- **Port Closing**: Standard ports (80, 443) on the Hetzner VPS can be closed to the public internet. The API runs only on `localhost`.
- **Anti-scanning**: Prevents "opportunistic" attacks from scanners (Shodan, Nmap) as no open ports are visible to the outside world.

### 2. Implementation Strategy
- **Cloudflared Container**: Run a lightweight daemon (`cloudflared`) inside the Docker network. It establishes a secure outbound connection to Cloudflare's Edge.
- **Firewall Rules**: Configure UFW to block **all** inbound traffic, allowing only SSH (preferably on a custom port/VPN).

### 3. Benefits
- **DDoS Immunity**: Direct IP attacks become impossible since the origin server rejects all non-tunnel traffic.
- **Bot & Scraper Control**: Prevents competitors from scraping sensitive pricing data by enforcing strict Cloudflare bot verification policies before traffic enters the tunnel.
- **Zero Trust Admin Access**: The Admin Panel can be placed behind Cloudflare Access, adding an identity provider (SSO) layer before the login page is even reachable.
