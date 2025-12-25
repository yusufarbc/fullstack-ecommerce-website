# Backend Architecture

The backend follows a **Layered Architecture** adhering to **SOLID Principles**.

## Directory Structure
- `src/controllers`: Request handlers. Responsible for validation and response formatting.
- `src/services`: Business logic layer. No direct database access; uses Repositories.
- `src/repositories`: Data access layer. Uses Prisma ORM.
- `src/routes`: Express router definitions.

## Key Services
### ProductService
Handles business logic for product retrieval.
- `getAllProducts()`: Fetches products with categories.
- `getProductById(id)`: Fetches single product.

### OrderService (via Controller)
Order creation logic is currently in `orderController` but orchestrates:
1. `IyzicoService`: For payment processing.
2. `EmailService`: For transactional emails (Brevo).

### IyzicoService
Encapsulates Iyzico API interactions.

### EmailService
Encapsulates Brevo API interactions.
