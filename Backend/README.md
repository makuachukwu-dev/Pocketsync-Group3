# TypeScript Authentication Backend

A modularized Express & Passport authentication backend built with TypeScript, featuring standard session-based registration/login (using bcryptjs) and Google OAuth2.0 integration.

---

## Features

- **Session-Based Auth:** Cookie-based session tracking via `express-session`.
- **Google OAuth2.0 Strategy:** Third-party OAuth flow using `passport` and `passport-google-oauth20`.
- **Clean Architecture:** Fully modularized MVC/Service codebase structure.
- **Type Safe:** Developed strictly with TypeScript.
- **Dockerized:** Out-of-the-box Docker multi-stage build support and `docker-compose` setups.

---

## Directory Structure

```
src/
├── app.ts                 # Express application & middleware setups
├── index.ts               # Server entry point
├── config/
│   ├── config.ts          # Central environment variable loading
│   └── passport.ts        # Passport strategies (Google Strategy)
├── controllers/
│   ├── auth.controller.ts # Login, register, logout, callback handlers
│   ├── user.controller.ts # User profile and dashboard handlers
│   └── web.controller.ts  # Endpoint list handler
├── middleware/
│   └── auth.middleware.ts # Protected route middleware (requireAuth)
├── routes/
│   ├── index.ts           # Master router
│   ├── auth.routes.ts     # Auth endpoints
│   ├── user.routes.ts     # Profile/Dashboard endpoints
│   └── web.routes.ts      # Health check/root endpoint
├── services/
│   └── user.service.ts    # Business logic & in-memory user database
└── types/
    └── auth.types.ts      # TypeScript declaration files
```

---

## Setup & Running Locally

### 1. Prerequisite Installations
Make sure you have [Node.js](https://nodejs.org) (v18+) and npm installed.

### 2. Configuration (`.env`)
Create a `.env` file in the root of the project (copying `.env.example` as a template):
```env
PORT=3000
SESSION_SECRET=your_generated_long_session_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

To generate a secure `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Compile TypeScript Build
```bash
npm run build
```

---

## Containerization (Docker)

To build and spin up the containerized application locally with single-command ease:

```bash
docker compose up --build
```
This builds the multi-stage image optimized for production and starts the API listening on port `3000`.

---

## API Documentation

For list of endpoints, JSON payloads, responses, and authorization details, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
