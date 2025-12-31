# Setup & Deployment

## Prerequisites
- Docker & Docker Compose
- Node.js (for local tooling only)

## Local Development

The entire stack is containerized. To start the application:

```bash
# 1. Start all services
docker-compose up --build -d

# 2. Check logs
docker-compose logs -f
```

### Access Points
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:8080/api/v1/products](http://localhost:8080/api/v1/products)
- **Admin Panel**: [http://localhost:8081/admin](http://localhost:8081/admin)
  - **Login**: `admin@example.com`
  - **Password**: `SecureAdminPassword!`

## Database Management
The database is initialized automatically. To reset or seed data:

```bash
# Reset DB (dangers: data loss)
docker-compose down -v
docker-compose up -d
```

## Production Deployment (VPS)

1. **Clone Repository** on the remote server.
2. **Configure Environment**: Ensure `.env` or `docker-compose.yml` environment variables are set for production (secure secrets).
3. **Run Docker Compose**:
   ```bash
   docker-compose -f docker-compose.yml up --build -d
   ```
4. **Reverse Proxy**: Set up Nginx or Traefik to route domains (e.g., `api.store.com`, `admin.store.com`) to ports 8080 and 8081.
