# Blog App (Node.js + Express + MongoDB)

A simple RESTful blog API built with Express and Mongoose. It supports user authentication (JWT), creating and managing blog posts, and keyword-based search across title, content, and category.

## Features

- User registration and login with hashed passwords
- JWT-based authentication and `Bearer` token middleware
- Create, read, update, and delete blog posts
- Author-only update/delete permissions
- Keyword search across title, content, and category
- Environment-based configuration

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- JSON Web Tokens (JWT)
- dotenv, bcrypt
- nodemon (dev)

## Project Structure

```
blog-app/
  .env
  package.json
  server.js
  config/
    db.js
  controllers/
    authController.js
    blogController.js
  middlewares/
    authMiddleware.js
  models/
    blogModel.js
    userModel.js
  routes/
    authRoutes.js
    blogRoutes.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start MongoDB locally (default URI is `mongodb://localhost:XXXX/XXXX`) or set `MONGO_URI` in `.env`.

3. Create a `.env` file (see example below) and start the server:

```bash
npm run dev   # starts with nodemon
# or
npm start     # starts with node
```

Server starts on `PORT` from `.env` (defaults to 3000 if not set).

## Authentication

- Login returns a JWT.
- Protected routes require `Authorization: Bearer <token>` header.

Middleware: see `middlewares/authMiddleware.js`.

## Models

- User: `name`, `email` (unique), `password` (hashed), `createdAt`
- Blog: `title`, `content`, `category`, `author` (User ref), `isPublished` (boolean), `createdAt`, `updatedAt`

## API

Base URL: `http://localhost:<PORT>/api`

### Auth

- POST `/auth/register`
  - Body: `{ name, email, password }`
  - Response: user details (name, email)

- POST `/auth/login`
  - Body: `{ email, password }`
  - Response: `{ message, user: { name, email }, token }`

- GET `/auth/me` (protected)
  - Header: `Authorization: Bearer <token>`
  - Response: `{ user: { name, email, createdAt } }`

### Blogs

- POST `/blog/create` (protected)
  - Body: `{ title, content, category, isPublished }`
  - Validations: title ≥ 5 chars, content ≥ 10 chars, `isPublished` is boolean
  - Response: selected fields `{ title, content, category, isPublished, author }`

- GET `/blog/`
  - Response: list of blogs with selected fields `{ title, content, category, isPublished, author }`

- GET `/blog/:id`
  - Response: a single blog (selected fields, `_id` excluded in controller)

- PUT `/blog/:id` (protected)
  - Only the original `author` can update.
  - Body: `{ title, content, category, isPublished }`
  - Response: updated blog with selected fields

- DELETE `/blog/:id` (protected)
  - Only the original `author` can delete.
  - Response: deleted blog document

- GET `/blog/search?keyword=<text>`
  - Searches across `title`, `content`, and `category` (case-insensitive partial match)
  - Response: `{ success, count, keyword, blogs: [...] }`

## Quick Test (curl)

Register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

Create blog (replace TOKEN with the JWT from login):

```bash
curl -X POST http://localhost:5000/api/blog/create \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Post","content":"This is a great post.","category":"General","isPublished":true}'
```

Search blogs:

```bash
curl "http://localhost:5000/api/blog/search?keyword=first"
```

## Notes

- Ensure MongoDB is running and accessible by the configured `MONGO_URI`.
- Update `JWT_SECRET` with a strong random value in production.
- Responses from controllers intentionally exclude `createdAt`/`updatedAt` in blog payloads.
