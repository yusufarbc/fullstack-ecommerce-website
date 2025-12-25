# API Documentation

## Base URL
`/api/v1`

## Products
- `GET /products`: List all products.
- `GET /products/:id`: Get product details.

## Categories
- `GET /categories`: List all categories.

## Orders
- `POST /orders/checkout`: Initialize checkout session.
  - Body:
    ```json
    {
      "items": [{ "id": "uuid", "quantity": 1 }],
      "guestInfo": { "name": "...", "email": "..." },
      "paymentInfo": { "card...": "..." }
    }
    ```
