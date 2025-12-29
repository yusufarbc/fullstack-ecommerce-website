# 🛒 E-Commerce Monorepo - Production Ready

Complete, production-ready monorepo structure for an E-Commerce application with Admin Panel.

## 🏗️ Architecture

![Architecture Diagram](./etrade_software_arch.png)

```
fullstack-ecommerce-website/
├── client/                 # React Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── lib/
│   │   │   └── axios.js   # Axios instance with JWT interceptor
│   │   ├── App.jsx        # Main application
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Tailwind styles
│   ├── Dockerfile
│   ├── vite.config.js     # Vite config with proxy
│   └── package.json
│
├── server/                # Node.js Backend (Express + AdminJS)
│   ├── src/
│   │   └── app.js        # Express app with AdminJS
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── seed.js       # Admin user seeding
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml     # Orchestration (DB + Backend + Frontend)
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🚀 Tech Stack

### 💻 Software Development Stack
This project is built using the **PERN Stack** (PostgreSQL, Express, React, Node.js), a robust full-stack solution for modern web applications.
[Learn more about PERN Stack](https://www.geeksforgeeks.org/node-js/what-is-pern-stack/)

### Backend
- **Node.js** 18 (Alpine)
- **Express.js** - Web framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL 15** - Database
- **AdminJS** - Auto-generated admin panel
- **bcrypt** - Password hashing
- **Session/Cookie** - Admin Authentication
- **Helmet** - Security headers
- **Zod** - Validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client with JWT interceptor
- **React Router** - Navigation
- **Lucide React** - Icons

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **PostgreSQL** - Persistent volumes

## 📦 Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Git

### 1. Clone & Setup

```bash
git clone <repository-url>
cd fullstack-ecommerce-website

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials (optional)
nano .env
```

### 2. Start with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

This will:
1. Start PostgreSQL database
2. Run Prisma migrations
3. Seed admin user
4. Start backend server (port 8080)
5. Start frontend dev server (port 3000)

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **Admin Panel**: http://localhost:8080/admin
- **Health Check**: http://localhost:8080/api/v1/health

### 4. Admin Login

Default admin credentials (change in `.env`):
- **Email**: admin@siten.com
- **Password**: Admin123!

## 🔧 Development

### Backend Development

```bash
cd server

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npm run prisma:seed

# Start dev server
npm run dev

# Open Prisma Studio
npx prisma studio
```

### Frontend Development

```bash
cd client

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce

# Backend
PORT=8080
DATABASE_URL=postgresql://postgres:postgres@db:5432/ecommerce?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars

# Admin User
ADMIN_EMAIL=admin@siten.com
ADMIN_PASSWORD=Admin123!

# Frontend
VITE_API_URL=http://localhost:8080
CLIENT_URL=http://localhost:3000
```

## 🗄️ Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  fullName  String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  ADMIN     // For Admin Panel access
  USER      // Unused / Reserved
  CUSTOMER  // Unused (Guest checkout only)
}
```

> **Note**: The `User` table is currently used primarily for Administrators. Customers do not have accounts.

## 🔐 Authentication & Checkout Flow

### 1. Admin Authentication (Admin Panel Only)
- The **Admin Panel** (`/admin`) is a completely separate service running in its own container.
- It handles its own session-based authentication for administrators.
- **Credentials**: Managed via environment variables or the database.

### 2. Customer Guest Checkout (Client)
- The **Client** application is a public-facing store that requires **NO authentication**.
- Customers browse products and checkout as **Guests**.
- No user registration or login functionality exists for customers.
- This ensures a fast, friction-free shopping experience.

## 🎨 Admin Panel
The Admin Panel runs independently on port `8081` (default).

- **URL**: `http://localhost:8081/admin`
- **Features**: Product management, Order viewing, Category management.
- **Technology**: AdminJS running on a dedicated Express server.
- **Independence**: It does not share session state with the Client or API.

## 🐳 Docker Services

### Database (PostgreSQL)
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Volume**: postgres_data (persistent)
- **Health check**: Automatic

### Backend (Node.js)
- **Port**: 8080
- **Depends on**: Database
- **Auto-runs**: Migrations + Seeding
- **Hot reload**: Enabled with volumes

### Frontend (React)
- **Port**: 3000
- **Proxy**: `/api` → `backend:8080`
- **Hot reload**: Enabled with volumes

## 📚 API Endpoints

### Health Check
```
GET /api/v1/health
```

Response:
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "adminPanel": "http://localhost:8080/admin"
}
```

## 🛠️ Useful Commands

### Docker

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Remove volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild specific service
docker-compose up -d --build backend
```

### Prisma

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database (⚠️ deletes data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## 🔒 Security Best Practices

- ✅ **Helmet.js** for security headers
- ✅ **CORS** properly configured
- ✅ **bcrypt** for password hashing (10 rounds)
- ✅ **JWT** for stateless authentication
- ✅ **Environment variables** for secrets
- ✅ **Zod** for input validation
- ⚠️ **Change default credentials** in production!
- ⚠️ **Use strong JWT_SECRET** (min 32 characters)

## 📁 MSC Architecture (Backend)

```
server/src/
├── controllers/    # Request handlers
├── services/       # Business logic
├── models/         # Prisma models
├── middleware/     # Auth, validation, etc.
├── routes/         # API routes
├── utils/          # Helper functions
└── app.js          # Express entry point
```

## 🚀 Production Deployment

### 1. Update Environment Variables

```env
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
DATABASE_URL=<production-database-url>
```

### 2. Build Frontend

```bash
cd client
npm run build
```

### 3. Deploy

- Use Docker Compose with production config
- Or deploy to cloud platforms (AWS, GCP, Azure)
- Configure reverse proxy (Nginx)
- Enable HTTPS with SSL certificates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Database Connection Error

```bash
# Check if database is running
docker-compose ps

# Restart database
docker-compose restart db

# Check logs
docker-compose logs db
```

### Port Already in Use

```bash
# Change ports in docker-compose.yml
ports:
  - "3001:3000"  # Frontend
  - "8081:8080"  # Backend
```

### Prisma Client Not Generated

```bash
cd server
npx prisma generate
```

---

**Built with ❤️ using modern web technologies**

For questions or support, please open an issue on GitHub.
