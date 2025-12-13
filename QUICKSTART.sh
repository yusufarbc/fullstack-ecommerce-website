# Copy environment variables
cp .env.example .env

# Start all services with Docker Compose
docker-compose up --build

# The application will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8080/api/v1
# - Admin Panel: http://localhost:8080/admin
# - Health Check: http://localhost:8080/api/v1/health

# Default admin credentials:
# Email: admin@siten.com
# Password: Admin123!
