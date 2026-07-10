**API Documentation**

Base URL: `http://localhost:5000` (default)

**Health & Docs**
- GET /health : Health check
- GET /api-docs : Swagger UI (OpenAPI)

**Auth (prefix: /api/auth)**
- POST /api/auth/register
  - Description: Register a new user
  - Auth: none
  - Body: { fullName, email, password }
  - Success: 201 Created — returns created user (id, fullName, email, role)

- POST /api/auth/login
  - Description: Login user
  - Auth: none
  - Body: { email, password }
  - Success: 200 OK — returns { accessToken, user }
  - Notes: Sets `refreshToken` cookie (httpOnly)

- POST /api/auth/refresh
  - Description: Exchange refresh token for new access token
  - Auth: requires `refreshToken` cookie
  - Success: 200 OK — returns { accessToken }

- POST /api/auth/logout
  - Description: Logout (clears refresh token)
  - Auth: expects `refreshToken` cookie
  - Success: 200 OK

- GET /api/auth/verify-email/:token
  - Description: Verify user email using token
  - Auth: none (token in URL)
  - Success: 200 OK

- POST /api/auth/forgot-password
  - Description: Request password reset (returns resetToken in demo)
  - Auth: none
  - Body: { email }
  - Success: 200 OK

- POST /api/auth/reset-password
  - Description: Reset password with token
  - Auth: none
  - Body: { token, newPassword }
  - Success: 200 OK

- POST /api/auth/change-password
  - Description: Change password for authenticated user
  - Auth: Bearer access token (Authorization: Bearer <token>)
  - Body: { currentPassword, newPassword }
  - Success: 200 OK

**Categories & Products (prefix: /api)**
- GET /api/categories
  - Description: List categories
  - Auth: none
  - Success: 200 OK — returns array of categories

- GET /api/categories/:id
  - Description: Get single category by id
  - Auth: none
  - Success: 200 OK — returns category or 404

- POST /api/categories
  - Description: Create a category
  - Auth: Bearer token + role `admin` or `staff`
  - Body: { name, description? }
  - Success: 201 Created — returns created category

- GET /api/products
  - Description: List products
  - Auth: none
  - Success: 200 OK — returns array of products

- GET /api/products/:id
  - Description: Get single product by id
  - Auth: none
  - Success: 200 OK — returns product or 404

- POST /api/products
  - Description: Create a product
  - Auth: Bearer token + role `admin` or `staff`
  - Body: { name, price, description?, categoryId }
  - Success: 201 Created — returns created product

**Cart & Orders (prefix: /api)**
- GET /api/cart
  - Description: Get current user's cart (in-memory demo)
  - Auth: Bearer access token
  - Success: 200 OK — returns cart object

- POST /api/cart
  - Description: Add item to cart
  - Auth: Bearer access token
  - Body: { productId, quantity }
  - Success: 200 OK — returns updated cart

- DELETE /api/cart
  - Description: Clear cart
  - Auth: Bearer access token
  - Success: 200 OK — returns empty cart

- GET /api/orders
  - Description: List orders for current user (in-memory demo)
  - Auth: Bearer access token
  - Success: 200 OK — returns array of orders

- GET /api/orders/:id
  - Description: Get order by id
  - Auth: Bearer access token
  - Success: 200 OK — returns order or 404

- POST /api/orders
  - Description: Create an order
  - Auth: Bearer access token
  - Body: { userId, items, total }
  - Success: 201 Created — returns created order

**Notes & Implementation Details**
- All routes listed under `/api` are mounted in `backend/src/server.js`.
- Authentication: endpoints marked require `Authorization: Bearer <accessToken>` header. Refresh flow uses `refreshToken` cookie.
- Role-based endpoints use `authorizeRoles('admin','staff')` middleware.
- `productRoutes.js` exists in the codebase and defines similar `/products` endpoints; currently the app mounts product routes via `productCategoryRoutes` at `/api`.
- For production, ensure environment variables are set: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, etc.

If you want, I can also generate a Swagger/OpenAPI spec file in `backend/src/docs/openapi.json` or add example request/response bodies for each endpoint. Which would you prefer next?
