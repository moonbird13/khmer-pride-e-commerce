# Khmer Pride API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. Register
**POST** `/auth/register`

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "isVerified": false
  }
}
```

**Error (409):**
```json
{
  "message": "Email already registered."
}
```

---

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Login successful.",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "isVerified": true
  }
}
```

**Cookies:** `refreshToken` (HttpOnly)

---

### 3. Refresh Token
**POST** `/auth/refresh`

**Cookies Required:** `refreshToken`

**Response (200):**
```json
{
  "message": "Access token refreshed.",
  "accessToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "isVerified": true
  }
}
```

---

### 4. Logout
**POST** `/auth/logout`

**Headers Required:**
```
Authorization: Bearer <accessToken>
```

**Cookies Required:** `refreshToken` (optional)

**Response (200):**
```json
{
  "message": "Logged out."
}
```

---

### 5. Change Password
**POST** `/auth/change-password`

**Headers Required:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully."
}
```

---

## Product Endpoints

### 1. List Products
**GET** `/products`

**Query Parameters:**
- `categoryId` (optional): Filter by category ID
- `search` (optional): Search products by name/description

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Silk Tote",
    "description": "Hand-woven and designed for modern daily carry.",
    "price": 42,
    "categoryId": 3,
    "category": {
      "id": 3,
      "name": "Clothing"
    },
    "slug": "silk-tote",
    "isFeatured": true,
    "isBestSeller": true,
    "isNewArrival": false,
    "salesCount": 15
  }
]
```

---

### 2. Get Product by ID
**GET** `/products/:id`

**Response (200):**
```json
{
  "id": 1,
  "name": "Silk Tote",
  "description": "Hand-woven and designed for modern daily carry.",
  "price": 42,
  "categoryId": 3,
  "category": {
    "id": 3,
    "name": "Clothing"
  },
  "slug": "silk-tote",
  "isFeatured": true,
  "isBestSeller": true,
  "isNewArrival": false,
  "salesCount": 15
}
```

**Error (404):**
```json
{
  "message": "Product not found."
}
```

---

## Category Endpoints

### 1. List Categories
**GET** `/categories`

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Food",
    "status": "Active"
  },
  {
    "id": 3,
    "name": "Clothing",
    "status": "Active"
  }
]
```

---

### 2. Get Category by ID
**GET** `/categories/:id`

**Response (200):**
```json
{
  "id": 3,
  "name": "Clothing",
  "status": "Active"
}
```

---

## Cart Endpoints

### 1. Get Cart
**GET** `/cart`

**Headers Required:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "id": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "product": {
        "id": 1,
        "name": "Silk Tote",
        "price": 42,
        "description": "Hand-woven and designed for modern daily carry."
      }
    }
  ]
}
```

---

### 2. Add to Cart
**POST** `/cart`

**Headers Required:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 1
}
```

**Response (200):**
```json
{
  "id": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "product": {
        "id": 1,
        "name": "Silk Tote",
        "price": 42,
        "description": "Hand-woven and designed for modern daily carry."
      }
    }
  ]
}
```

---

### 3. Update Cart Item Quantity
**PATCH** `/cart/items/:productId`

**Headers Required:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "id": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 3,
      "product": {
        "id": 1,
        "name": "Silk Tote",
        "price": 42,
        "description": "Hand-woven and designed for modern daily carry."
      }
    }
  ]
}
```

---

### 4. Remove Cart Item
**DELETE** `/cart/items/:productId`

**Headers Required:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "id": 1,
  "items": []
}
```

---

### 5. Clear Cart
**DELETE** `/cart`

**Headers Required:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "items": []
}
```

---

## Order Endpoints

### 1. Create Order
**POST** `/orders`

**Headers Required:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 42
    }
  ],
  "total": 84,
  "shippingAddress": "123 Main St",
  "shippingCity": "Phnom Penh",
  "paymentMethod": "card"
}
```

**Response (201):**
```json
{
  "id": "order-1234567890",
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 42
    }
  ],
  "total": 84,
  "status": "Pending",
  "createdAt": "2026-07-12T10:30:00Z"
}
```

---

### 2. List Orders (User's Orders)
**GET** `/orders`

**Headers Required:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
[
  {
    "id": "order-1234567890",
    "userId": 1,
    "total": 84,
    "status": "Pending",
    "createdAt": "2026-07-12T10:30:00Z"
  }
]
```

---

### 3. Get Order by ID
**GET** `/orders/:id`

**Headers Required:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "id": "order-1234567890",
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 42
    }
  ],
  "total": 84,
  "status": "Pending",
  "createdAt": "2026-07-12T10:30:00Z"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict (e.g., email already exists) |
| 500 | Internal Server Error |

---

## Error Response Format

```json
{
  "message": "Error description"
}
```

---

## Authentication

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <accessToken>
```

The JWT payload contains:
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "customer"
}
```

### Roles
- `customer`: Regular user
- `admin`: Administrator
- `staff`: Staff member
