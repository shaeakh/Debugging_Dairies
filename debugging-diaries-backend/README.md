# Debugging Diaries — Backend

A production-ready REST API built with **Express.js** and **TypeScript** for the Debugging Diaries platform — a community space where developers share, document, and discuss their debugging experiences and technical stories.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Database Schema](#database-schema)
- [Available Scripts](#available-scripts)
- [Code Quality](#code-quality)
- [Contributing](#contributing)

---

## Overview

Debugging Diaries Backend is a RESTful API server that powers the Debugging Diaries web platform. It handles user registration and authentication (with email verification and OTP-based password reset), story creation with AI-generated summaries, category tagging, full-text search, and user profile management.

---

## Tech Stack

| Layer         | Technology                        |
| ------------- | --------------------------------- |
| Runtime       | `Node.js (v18+)`                  |
| Language      | `TypeScript 5.x`                  |
| Framework     | `Express.js 5.x`                  |
| ORM           | `Prisma 7.x`                      |
| Database      | `PostgreSQL`                      |
| DB Driver     | `pg` + `@prisma/adapter-pg`       |
| Auth          | JWT (`jsonwebtoken`) + `bcrypt`   |
| Email         | `Nodemailer (Gmail SMTP)`         |
| AI            | Google Gemini (`@google/genai`)   |
| Validation    | `Zod 4.x`                         |
| API Docs      | Swagger UI (`swagger-ui-express`) |
| Rate Limiting | `express-rate-limit`              |
| Linting       | `ESLint` + `TypeScript-ESLint`    |
| Formatting    | `Prettier`                        |
| Git Hooks     | `Husky`                           |
| Dev Server    | `Nodemon` + `tsx`                 |

---

## Features

- **JWT Authentication** — Stateless auth with HTTP-only cookies and configurable expiry
- **Email Verification** — Account activation via tokenised confirmation link
- **OTP Password Reset** — Time-limited 6-digit OTP sent to registered email
- **AI Story Summaries** — Automatic story summarisation via Google Gemini on creation
- **Story Management** — Full CRUD with soft-delete, category tagging, and pagination
- **Category System** — Pre-seeded developer category taxonomy (110+ tags)
- **Full-Text Search** — Search across users and stories simultaneously
- **User Profiles** — Public profile pages with authored story history
- **Role-Based Access Control** — `USER` and `ADMIN` roles with route-level enforcement
- **Rate Limiting** — Global and per-route request throttling
- **Request Validation** — Zod schema validation on all body, query, and param inputs
- **Swagger Docs** — Auto-generated interactive API docs at `/api-docs`
- **Soft Delete** — Users and stories are soft-deleted; data is retained in the database
- **Structured Error Handling** — Typed error classes with consistent HTTP responses

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **PostgreSQL** (v14+ recommended) — running locally or via a hosted provider
- A **Gmail account** (or other SMTP provider) for sending emails
- A **Google Gemini API key** for AI story summarisation

---

## Installation

### 1. Clone the repository

```bash
git  clone  https://github.com/shaeakh/debugging-diaries-backend.git
cd  debugging-diaries-backend
```

### 2. One-command setup

The `setup` script installs dependencies, generates the Prisma client, runs migrations, builds the project, and seeds the database:

```bash
npm  run  setup
```

Or run each step manually:

```bash
npm  install
npx  prisma  generate
npx  prisma  migrate  dev
npm  run  build
npx  prisma  db  seed
```

---

## Environment Variables

Create a `.env` file in the project root. A template is provided at `.env.example`:

```bash
cp  .env.example  .env
```

Then fill in each value:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DIRECT_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Authentication
JWT_SECRET=your_strong_random_secret_here

# Email (Gmail SMTP)
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_gmail_app_password

# URLs
FRONTEND_URL=http://localhost:5500
BACKEND_URL=http://localhost:3000

# AI (Google Gemini)
AI_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your_gemini_api_key
```

---

---

## Running the Server

### Development (hot reload)

```bash
npm  run  dev
```

Uses `nodemon` + `tsx` to watch `src/` and restart automatically on changes.

### Production

```bash
npm  run  build
npm  start
```

The server will be available at `http://localhost:PORT` (default `3000`).

Interactive API documentation is served at: `http://localhost:3000/api-docs`

---

## Project Directory

    project-root/
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.ts
    │   └── migrations/
    ├── src/
    │   ├── index.ts
    │   ├── api-doc/
    │   │   ├── swagger.ts
    │   │   └── swagger-output.json
    │   ├── config/
    │   │   └── db.ts
    │   ├── constants/
    │   ├── controllers/
    │   ├── dtos/
    │   ├── errors/
    │   │   ├── baseErrorClass.ts
    │   │   └── concreteErrors.ts
    │   ├── generated/prisma/
    │   ├── middlewares/
    │   │   ├── authenticateToken.ts
    │   │   ├── authorizeRoles.ts
    │   │   ├── errorHandler.ts
    │   │   ├── rateLimiter.ts
    │   │   └── requestValidator.ts
    │   ├── repositories/
    │   ├── routes/
    │   ├── services/
    │   ├── types/
    │   │   └── expressDefaultTypes.ts
    │   └── utils/
    │       ├── emailUtils.ts
    │       └── responseHandler.ts
    ├── .env.example
    ├── nodemon.json
    ├── prisma.config.ts
    ├── tsconfig.json
    ├── eslint.config.ts
    └── package.json

---

## API Reference

All API routes are prefixed with `/api`. Full interactive documentation is available at `/api-docs` when the server is running.

### Auth — `/api/auth`

| Method | Endpoint                | Auth        | Description                                         |
| ------ | ----------------------- | ----------- | --------------------------------------------------- |
| `POST` | `/signup`               | Public      | Register a new account. Sends a confirmation email. |
| `GET`  | `/confirm-email/:token` | Public      | Activate account via email token.                   |
| `POST` | `/signin`               | Public      | Sign in and receive a JWT cookie.                   |
| `POST` | `/change-password`      | 🔒 Required | Initiate password change — sends OTP to email.      |
| `POST` | `/verify-Otp`           | 🔒 Required | Submit OTP to complete password reset.              |

### Users — `/api/users`

| Method   | Endpoint | Auth           | Description                 |
| -------- | -------- | -------------- | --------------------------- |
| `GET`    | `/`      | 🔒 Required    | List all users (paginated). |
| `GET`    | `/:id`   | 🔒 Required    | Get user by ID.             |
| `PATCH`  | `/:id`   | 🔒 Owner/Admin | Update user fields.         |
| `DELETE` | `/:id`   | 🔒 Owner/Admin | Soft-delete a user.         |

### Stories — `/api/stories`

| Method   | Endpoint | Auth           | Description                                         |
| -------- | -------- | -------------- | --------------------------------------------------- |
| `GET`    | `/`      | 🔒 Required    | List all stories (paginated, sorted).               |
| `POST`   | `/`      | 🔒 Required    | Create a story. AI summary generated automatically. |
| `GET`    | `/:id`   | 🔒 Required    | Get a single story by ID.                           |
| `PATCH`  | `/:id`   | 🔒 Owner/Admin | Update a story.                                     |
| `DELETE` | `/:id`   | 🔒 Owner/Admin | Hard-delete a story.                                |

### Categories — `/api/categories`

| Method | Endpoint | Auth   | Description            |
| ------ | -------- | ------ | ---------------------- |
| `GET`  | `/`      | Public | List all categories.   |
| `POST` | `/`      | Public | Create a new category. |

### Search — `/api/search`

| Method | Endpoint | Auth        | Description                              |
| ------ | -------- | ----------- | ---------------------------------------- |
| `GET`  | `/`      | 🔒 Required | Search users and stories simultaneously. |

**Query parameters:** `search` (required), `page`, `limit`, `sortBy`, `sortOrder`

### Profile — `/api/profile`

| Method | Endpoint     | Auth        | Description                                     |
| ------ | ------------ | ----------- | ----------------------------------------------- |
| `GET`  | `/:username` | 🔒 Required | Get a user's public profile with their stories. |

---

## Authentication Flow

### Sign Up

```
POST /api/auth/signup

→ Creates User + Auth records
→ Sends confirmation email with a 30-minute JWT link
→ Returns a session JWT cookie (account inactive until email confirmed)
```

### Email Confirmation

```
GET /api/auth/confirm-email/:token

→ Verifies the 30-minute token
→ Sets user.is_active = true
→ Sends welcome email
→ Returns a new session JWT cookie
```

### Sign In

```

POST /api/auth/signin

→ Checks email, active status, and password hash
→ Returns a 30-day HTTP-only JWT cookie
```

### Password Reset (OTP flow)

```
POST /api/auth/change-password (requires auth)

→ Verifies current password
→ Generates 6-digit OTP (valid 5 minutes)
→ Hashes new password and stores it temporarily on the OTP record
→ Sends OTP to registered email
```

```
POST /api/auth/verify-Otp (requires auth)

→ Validates OTP code, type, and expiry
→ Writes the pre-hashed new password to the Auth record
→ Deletes the OTP record
```

---

## Available Scripts

| Script        | Command                 | Description                                                        |
| ------------- | ----------------------- | ------------------------------------------------------------------ |
| Setup         | `npm run setup`         | Install deps, generate Prisma client, run migrations, build & seed |
| Dev           | `npm run dev`           | Start dev server with hot reload (nodemon)                         |
| Build         | `npm run build`         | Compile TypeScript + resolve path aliases to `dist/`               |
| Start         | `npm start`             | Run the compiled production build                                  |
| Lint          | `npm run lint`          | Run ESLint across all source files                                 |
| Format        | `npm run format`        | Auto-format `.ts/.js/.json/.css/.md` files with Prettier           |
| Git Log       | `npm run gitlog`        | Pretty one-line git history (chronological)                        |
| Test          | `npm test`              | Run all tests once with Vitest                                     |
| Test Watch    | `npm run test:watch`    | Run tests in watch mode                                            |
| Test Coverage | `npm run test:coverage` | Run tests and generate coverage report                             |
| Test UI       | `npm run test:ui`       | Open Vitest interactive UI                                         |

## Code Quality

The project enforces consistent code quality automatically:

**ESLint** — TypeScript-aware linting with rules for unused vars, explicit any warnings, consistent quotes, brace style, and import spacing.

**Prettier** — Automatic code formatting. Run `npm run format` to apply.

**Husky pre-commit hook** — Runs lint checks before every commit to prevent bad code from entering the repo.

**TypeScript strict mode** — `strict: true`, `noImplicitAny`, `noUncheckedIndexedAccess`, and `verbatimModuleSyntax` are all enabled.

---

## Testing :

    npm run test:coverage

<img width="1014" height="472" alt="Screenshot 2026-03-02 120644" src="https://github.com/user-attachments/assets/73a4dc99-fa38-452c-b6fc-320beba6df32" />

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and ensure lint passes: `npm run lint`
4. Commit your changes: `git commit -m "feat: describe your change"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a Pull Request

Please follow the existing code style. All new routes should include Zod validation and use the existing service/repository pattern.

---

## Issues

If you encounter a bug or have a feature request, please open an issue on the [GitHub Issues](https://github.com/shaeakh/debugging-diaries-backend/issues) page.
