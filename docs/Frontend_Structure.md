# Frontend Architecture

Built with **React (Vite)** and **Tailwind CSS**.

## State Management
- **CartContext**: Manages shopping cart state (items, total) and sidebar visibility. Persists to `localStorage`.

## Routing
- **React Router**:
  - `/`: Home (Product list + Search + Filter).
  - `/product/:id`: Product Details.
  - `/checkout`: Guest Checkout Form.

## Key Components
- `Header`: Contains Navigation, Search Bar, and Cart Trigger.
- `ProductCard`: Displays product summary.
- `CartSidebar`: Slide-out cart view.
- `CategoryFilter`: Filter products by category.
