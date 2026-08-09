# ⚙️ QuMail Backend Service API

> **Express API Engine for Authentication, Quantum Key Management, and Email Proxying**

The QuMail backend provides REST APIs for authentication (via `better-auth`), quantum key generation and verification, security audit logging, and email processing using Express, Drizzle ORM, and Neon PostgreSQL.

---

## 🛠️ Architecture & Services

The backend consists of three main service modules:

### 1. Authentication Service (`/api/auth/*`)
- **Engine:** `better-auth` v1.6+
- **Provider:** Google OAuth 2.0 (`openid`, `email`, `profile`, `gmail.send`, `gmail.readonly`)
- **Session Management:** Secure HTTP-only cookies with `SameSite=Lax` and `trustedProxyHeaders: true` for reverse-proxy compatibility.

### 2. Quantum Key Management (KM) Service (`/api/km/*`)
- **ETSI GS QKD 014 Simulation Interface:** Generates post-quantum encryption key IDs and seeds.
- **Key Store:** Neon PostgreSQL (`quantum_keys` table).
- **Audit Logs:** Log key usage and cryptographic operations in `security_logs`.

### 3. Email Proxy Service (`/api/email/*`)
- Handles encrypted email transmission and status monitoring.

---

## 📂 Backend File Structure

```
backend/
├── api/
│   └── index.ts               # Vercel Serverless Function Handler
├── drizzle.config.ts           # Drizzle Kit Configuration
├── package.json
├── vercel.json                 # Vercel Serverless Rewrites
└── src/
    ├── server.ts               # Main Server Entry Point
    ├── db/
    │   ├── index.ts           # Neon Postgres Client Connection
    │   └── schema.ts          # Drizzle Database Schemas & Relations
    └── app/
        ├── index.ts           # Express Application Setup & CORS Middleware
        ├── common/
        │   └── utils/         # Better-Auth Setup & API Response Helpers
        └── modules/
            ├── email/         # Email Routes & Controllers
            └── km/            # Key Manager Controller, Service & Routes
```

---

## 🔧 Environment Variables

Create `.env` in the `backend/` directory:

```env
# Relational Storage
DATABASE_URL="postgresql://user:pass@ep-dry-rice-az4zrimr-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Auth Configuration
BETTER_AUTH_SECRET="your-32-character-secret"
BETTER_AUTH_URL="http://localhost:8080"
FRONTEND_URL="http://localhost:5173"

# Google Credentials
GOOGLE_CLIENT_ID="626364519738-734upcquv7apvu56ejegbl3e4e6mce29.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-secret"
```

---

## 📡 API Endpoint Reference

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/sign-in/social` | Initiates Google OAuth login flow |
| `GET` | `/api/auth/callback/google` | OAuth callback handler |
| `GET` | `/api/auth/get-session` | Fetches active user session |
| `POST` | `/api/auth/sign-out` | Logs out the current user session |

---

### Key Manager Endpoints (`/api/km`)

#### `POST /api/km/enc_keys`
Generates encryption key material for a recipient.
- **Request Body:**
  ```json
  {
    "senderEmail": "alice@qumail.io",
    "recipientEmail": "bob@qumail.io",
    "algorithm": "KYBER-1024"
  }
  ```
- **Response:**
  ```json
  {
    "keyId": "qk-8f92a1...",
    "keyValue": "a7b3c2...",
    "status": "ACTIVE",
    "expiresAt": "2026-08-10T12:00:00Z"
  }
  ```

#### `GET /api/km/dec_keys?keyId=<KEY_ID>&userEmail=<EMAIL>`
Fetches decryption key material for an authorized user.

#### `GET /api/km/status?email=<EMAIL>`
Returns current KM operational status and active key counts.

#### `GET /api/km/keys?email=<EMAIL>`
Lists active quantum key records for a user.

#### `GET /api/km/logs?email=<EMAIL>`
Returns audit security logs.

---

### Email Endpoints (`/api/email`)

#### `POST /api/email/send`
Queues or relays an encrypted email.

#### `GET /api/email/inbox`
Fetches user email headers and messages.

---

## 🗄️ Database Commands

```bash
# Push schema changes to Neon Postgres
npm run db:push

# Generate Drizzle migration files
npm run db:generate

# Execute migrations
npm run db:migrate
```

---

## 🛠️ Running the Service

```bash
# Development mode (Bun)
bun run dev

# Development mode (Node)
npx tsx watch src/server.ts
```
