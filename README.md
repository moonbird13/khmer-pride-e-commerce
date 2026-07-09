# Khmer Pride

Khmer Pride is a full-stack marketplace for authentic Cambodian products. The project follows a simple MVC-style structure with a React frontend and an Express backend.

## Structure

- backend/src/server.js - API entry point
- backend/src/routes - route definitions
- backend/src/controllers - HTTP logic
- backend/src/middleware - auth middleware
- backend/src/models - Sequelize models
- frontend/src - React app pages, components, and context

## Backend setup

1. Open the backend folder.
2. Copy .env.example to .env and update values.
3. Install dependencies with npm install.
4. Start the server with npm run dev.

## Frontend setup

1. Open the frontend folder.
2. Install dependencies with npm install.
3. Start the app with npm run dev.
4. Open http://localhost:5173.

## Current capabilities

- User registration and login
- JWT-based authentication and refresh token support
- Email verification flow
- Forgot/reset/change password endpoints
- Role-based authorization middleware
- Swagger docs at /api-docs
- Demo-mode fallback when MySQL is unavailable
