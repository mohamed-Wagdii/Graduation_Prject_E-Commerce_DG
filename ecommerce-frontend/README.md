# Maison — E-commerce Frontend

A production-grade React + Tailwind CSS frontend for your Node.js e-commerce backend.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client with JWT interceptors |
| react-hot-toast | Toast notifications |
| lucide-react | Icon set |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local → set REACT_APP_API_URL to your backend URL

# 3. Start development server
npm start
```

The app runs on **http://localhost:3000** by default.

---

## Project Structure

```
src/
├── services/
│   └── api.js              # All API calls, axios instance + JWT interceptors
├── context/
│   ├── AuthContext.jsx     # Global auth state (login, register, logout)
│   └── CartContext.jsx     # Global cart state (add, update, remove)
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx      # Top navigation, search overlay, user menu
│   │   ├── Footer.jsx      # Site footer
│   │   └── ProtectedRoute.jsx  # Auth guard, admin-only guard
│   └── product/
│       └── ProductCard.jsx # Reusable product card with hover actions
└── pages/
    ├── HomePage.jsx        # Landing: hero, categories, featured products
    ├── ProductsPage.jsx    # Listing: search, filters, sort, pagination
    ├── ProductDetailPage.jsx  # Single product with images, add to cart
    ├── CartPage.jsx        # Cart items, quantities, order summary, checkout
    ├── AuthPages.jsx       # LoginPage + RegisterPage
    ├── ProfilePage.jsx     # Profile edit, orders history, change password
    └── AdminDashboard.jsx  # Stats, products CRUD, orders management, users
```

---

## Backend API Contract

The frontend expects your Node.js backend to expose these endpoints.  
Base URL is set via `REACT_APP_API_URL` (default: `http://localhost:5000/api`).

### Auth
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/auth/login` | `{ email, password }` | `{ token, user }` |
| POST | `/auth/register` | `{ name, email, password }` | `{ token, user }` |
| GET | `/auth/me` | — | `{ user }` |
| POST | `/auth/logout` | — | `{}` |

**User object shape:**
```json
{ "_id": "...", "name": "Jane", "email": "jane@example.com", "role": "user" | "admin" }
```

### Products
| Method | Endpoint | Params / Body | Response |
|--------|----------|---------------|----------|
| GET | `/products` | `?page=1&limit=12&sort=newest&category=X&search=Y&minPrice=Z&maxPrice=W` | `{ products: [...], totalPages }` |
| GET | `/products/featured` | — | `{ products: [...] }` |
| GET | `/products/categories` | — | `{ categories: ["Living", "Apparel", ...] }` |
| GET | `/products/:id` | — | `{ product: {...} }` |
| POST | `/products` | product data | `{ product }` (admin) |
| PUT | `/products/:id` | product data | `{ product }` (admin) |
| DELETE | `/products/:id` | — | `{}` (admin) |

**Product object shape:**
```json
{
  "_id": "...",
  "name": "Product Name",
  "description": "...",
  "price": 49.99,
  "originalPrice": 69.99,
  "category": "Living",
  "images": ["https://..."],
  "stock": 42,
  "isNew": true
}
```

### Cart
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/cart` | — | `{ items: [...] }` |
| POST | `/cart/items` | `{ productId, quantity }` | `{ items: [...] }` |
| PUT | `/cart/items/:itemId` | `{ quantity }` | `{ items: [...] }` |
| DELETE | `/cart/items/:itemId` | — | `{ items: [...] }` |
| DELETE | `/cart` | — | `{}` |

**Cart item shape:**
```json
{
  "_id": "...",
  "productId": "...",
  "product": { "_id": "...", "name": "...", "images": [...] },
  "price": 49.99,
  "quantity": 2
}
```

### Orders
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/orders/me` | — | `{ orders: [...] }` |
| GET | `/orders/:id` | — | `{ order }` |
| POST | `/orders` | `{ items, shipping, total }` | `{ order }` |
| GET | `/orders` | `?page=1&limit=20` | `{ orders: [...] }` (admin) |
| PUT | `/orders/:id/status` | `{ status }` | `{ order }` (admin) |

**Order status values:** `pending` · `processing` · `shipped` · `delivered` · `cancelled`

### Users
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/users/me` | — | `{ user }` |
| PUT | `/users/me` | `{ name, email }` | `{ user }` |
| PUT | `/users/me/password` | `{ currentPassword, newPassword }` | `{}` |
| GET | `/users` | `?page=1&limit=20` | `{ users: [...] }` (admin) |
| PUT | `/users/:id` | user data | `{ user }` (admin) |
| DELETE | `/users/:id` | — | `{}` (admin) |

### Admin Stats
| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/admin/stats` | `{ revenue, totalOrders, totalProducts, totalUsers }` |

---

## Authentication Flow

1. User logs in → backend returns `{ token, user }`
2. Token stored in `localStorage` as `"token"`
3. Every Axios request automatically attaches `Authorization: Bearer <token>`
4. On `401` response → token cleared, user redirected to `/login`
5. Admin routes check `user.role === "admin"` and redirect if not

---

## Routing

| Path | Page | Auth Required |
|------|------|---------------|
| `/` | Home | Public |
| `/products` | Product listing | Public |
| `/products/:id` | Product detail | Public |
| `/cart` | Shopping cart | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/profile` | User profile + orders | ✅ Logged in |
| `/admin` | Admin dashboard | ✅ Admin only |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:5000/api` | Backend API base URL |

---

## Build for Production

```bash
npm run build
```

Output goes to `build/`. Deploy to any static host (Vercel, Netlify, S3, etc.)  
For Vercel/Netlify, add a rewrite rule: all routes → `index.html`.

---

## Customization

- **Brand name / logo**: Search for `Maison` across files and replace
- **Color palette**: Edit `tailwind.config.js` → `theme.extend.colors`
- **Fonts**: Edit `tailwind.config.js` → `theme.extend.fontFamily` and update the Google Fonts import in `src/index.css`
- **API base URL**: Set `REACT_APP_API_URL` in `.env.local`
