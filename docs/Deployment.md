# Deployment Strategy

The application follows a **Decoupled Architecture** designed for distinct scaling and security requirements.

## 1. Customer Storefront (Cloudflare Pages)
- **Role**: Public-facing e-commerce site.
- **Hosted On**: Cloudflare (Edge Network).
- **Tech Stack**: React (Vite), Tailwind CSS.
- **Access**: Public / Guest.
- **Features**:
  - High performance static asset delivery.
  - Product browsing, Search, Cart.
  - Guest Checkout (via API).
- **Security**: No administrative capabilities or logic included in the bundle.

## 2. Backend & Admin Panel (VPS)
- **Role**: API Server and Internal Backoffice.
- **Hosted On**: Virtual Private Server (VPS) via Docker.
- **Tech Stack**: Node.js, Express, AdminJS, PostgreSQL (Prisma).
- **Access**:
  - **API**: Publicly accessible endpoints (`/api/v1`) for the Storefront.
  - **Admin Panel**: Restricted access (`/admin`) for staff only.
- **Features**:
  - Database management.
  - Order processing and status updates.
  - Third-party integrations (Iyzico, Brevo).

## Diagram
```mermaid
graph TD
    User[Customer] -->|HTTPS| CF[Cloudflare Pages (Storefront)]
    Admin[Staff] -->|HTTPS| VPS[VPS (Node.js + AdminJS)]
    
    CF -->|API Calls (JSON)| VPS
    VPS -->|SQL| DB[(PostgreSQL)]
```
