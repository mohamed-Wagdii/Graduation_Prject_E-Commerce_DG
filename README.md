# Micro Electronics - Backend API

A RESTful API for an e-commerce platform built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **File Upload:** Multer
- **Validation:** Joi
- **Email:** Nodemailer

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally

### Installation

```bash
npm install
```

### Environment Variables
Create a `.env` file in the root directory:



### Run the Server

```bash
node app.js
```

Server runs at `http://localhost:3000`

---

## API Endpoints

### Auth

| Method | URL | Description | Auth Required |
|--------|-----|-------------|---------------|
| POST | `/api/register` | Register a new user | No |
| POST | `/api/login` | Login and get token | No |
| POST | `/api/logout` | Logout user | No |
| GET | `/api/verify-email/:token` | Verify email address | No |

#### Register Body
```json
{
  "username": "John",
  "email": "john@example.com",
  "password": "123456",
  "role": "user"
}
```

#### Login Body
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

### Products

| Method | URL | Description | Auth Required |
|--------|-----|-------------|---------------|
| POST | `/api/product` | Add a new product (admin only) | Yes |
| GET | `/api/product` | Get all products | No |
| GET | `/api/search/:id` | Get product by ID | No |
| GET | `/api/details/:id` | Get product details | No |

#### Add Product Body (form-data)
```
name: "Arduino Uno"
price: 150
stock: 20
image: <file>
```

---

### Cart

| Method | URL | Description | Auth Required |
|--------|-----|-------------|---------------|
| POST | `/api/cart` | Add item to cart | Yes |
| GET | `/api/cart` | Get current user's cart | Yes |

#### Add to Cart Body
```json
{
  "productId": "product_id_here",
  "quantity": 2
}
```

---

### Orders

| Method | URL | Description | Auth Required |
|--------|-----|-------------|---------------|
| POST | `/api/orders` | Place an order from cart | Yes |
| GET | `/api/orders` | Get all orders (admin only) | Yes |
| GET | `/api/orders/my-orders` | Get current user's orders | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |
| PUT | `/api/orders/:id/cancel` | Cancel an order | Yes |

#### Place Order Body
```json
{
  "shippingAddress": "Cairo, Egypt",
  "paymentMethod": "cash_on_delivery"
}
```

> `paymentMethod` options: `cash_on_delivery`, `credit_card`, `paypal`

---

### Categories

| Method | URL | Description | Auth Required |
|--------|-----|-------------|---------------|
| POST | `/api/add` | Add a new category (admin only) | Yes |

#### Add Category Body (form-data)
```
name: "Microcontrollers"
image: <file>
```

---

## Authentication

All protected routes require a Bearer token in the request header:

```
Authorization: Bearer <your_token>
```

You get the token from the `/api/login` response.

---

## Order Status Flow

```
pending → confirmed → shipped → delivered
                                    ↓
                               cancelled
```
