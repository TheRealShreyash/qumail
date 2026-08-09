# 🛡️ QuMail — Quantum-Secured Email & Key Management Platform

> **Quantum-Safe Post-Quantum Cryptography (PQC) & QKD-Enabled Mail Client**  
> QuMail equips legacy email infrastructures (Gmail, standard SMTP/IMAP) with quantum key distribution (QKD) integration, hybrid AES-256-GCM encryption, post-quantum key management, and seamless Google OAuth 2.0 authentication.

---

## 📸 Overview

QuMail protects sensitive communications against future quantum computer decryption attacks ("Harvest Now, Decrypt Later"). It wraps end-to-end encryption around existing email accounts without requiring mail servers to change.

### Key Capabilities
- ⚛️ **Quantum Key Management (KM):** Simulates ETSI GS QKD 014 REST key management interface for generating, exchanging, and auditing post-quantum encryption keys.
- 🔒 **Hybrid Client-Side Encryption:** Messages are encrypted before hitting the wire using AES-GCM-256 with quantum-seeded key material.
- 🔑 **Google OAuth 2.0 Integration:** Powered by `better-auth` with Google Gmail API scopes (`gmail.send`, `gmail.readonly`).
- 🌐 **Vercel Same-Origin Proxying:** Built with reverse-proxy rewrites preventing cross-domain cookie stripping on `*.vercel.app` deployments.
- 🗄️ **Serverless Relational Storage:** Powered by Drizzle ORM and Neon Serverless PostgreSQL.

---

## 🏗️ System Architecture

```
+-------------------------------------------------------------------------+
|                              USER BROWSER                               |
|                  (QuMail React 19 + TailwindCSS v4 SPA)                 |
+-------------------------------------------------------------------------+
                                    |
                                    | Same-Origin API Calls (/api/*)
                                    v
+-------------------------------------------------------------------------+
|                          VERCEL EDGE PROXY                              |
|                    (https://qumail-nine.vercel.app)                     |
+-------------------------------------------------------------------------+
                                    |
                                    | Reverse Proxy Rewrites
                                    v
+-------------------------------------------------------------------------+
|                           EXPRESS BACKEND                               |
|                 (https://qumail-backend-rho.vercel.app)                 |
|                                                                         |
|  +-------------------+   +--------------------+   +------------------+  |
|  | Better-Auth OAuth |   | Key Manager (KM)   |   | Email Router     |  |
|  +-------------------+   +--------------------+   +------------------+  |
+-------------------------------------------------------------------------+
           |                                  |
           v                                  v
+-----------------------+          +-----------------------+
|  Neon Serverless PG   |          |    Google OAuth 2.0   |
| (Users, Keys, Logs)   |          |  & Gmail API Services  |
+-----------------------+          +-----------------------+
```

---

## 📁 Repository Structure

```
qumail/
├── backend/                  # Express Node.js/Bun API Server
│   ├── api/                  # Vercel Serverless Entry Point
│   ├── drizzle/              # Database Schema & Migrations
│   ├── src/
│   │   ├── app/
│   │   │   ├── common/       # Middleware, Utils, Better-Auth Config
│   │   │   ├── modules/
│   │   │   │   ├── email/    # Email Sending/Fetching Services
│   │   │   │   └── km/       # Quantum Key Management Controller/Routes
│   │   └── db/               # Drizzle Database Connection & Schemas
│   ├── package.json
│   └── vercel.json           # Backend Serverless Rewrites
│
├── frontend/                 # React 19 + Vite + TailwindCSS v4 Frontend
│   ├── src/
│   │   ├── components/       # UI Components (Buttons, Modals, Badges)
│   │   ├── context/          # Auth, Theme, and Toast Contexts
│   │   ├── hooks/            # Custom Hooks (useAuth, useToast)
│   │   ├── lib/              # Auth Client, API Client, Crypto Utilities
│   │   ├── pages/            # Inbox, Compose, KeyManager, SecurityLogs, Settings
│   │   └── routes/           # React Router AppRoutes
│   ├── package.json
│   ├── vercel.json           # Same-Origin API Proxy Rewrites
│   └── vite.config.js        # Vite Dev Server Proxy Setup
└── README.md
```

---

## ⚙️ Environment Variables Setup

### 1. Backend (`backend/.env`)

```env
# Database
DATABASE_URL="postgresql://user:pass@ep-dry-rice-az4zrimr-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Auth Secrets & URLs
BETTER_AUTH_SECRET="your-32-character-secret"
BETTER_AUTH_URL="http://localhost:8080"      # Local dev
FRONTEND_URL="http://localhost:5173"        # Local dev frontend

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-google-client-secret"
```

### 2. Frontend (`frontend/.env`)

```env
# In Local Dev: set to http://localhost:8080 (or leave empty to use Vite proxy)
# In Production on Vercel: set to https://qumail-nine.vercel.app (or leave empty)
VITE_BACKEND_URL=http://localhost:8080
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ or [Bun](https://bun.sh/)
- A free [Neon PostgreSQL](https://neon.tech/) database instance
- A Google Cloud Console OAuth 2.0 Client ID

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install   # or bun install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Database Migration

```bash
cd backend
npx drizzle-kit push
```

### Step 3: Start Development Servers

**Backend:**
```bash
cd backend
npm run dev   # Runs on http://localhost:8080
```

**Frontend:**
```bash
cd frontend
npm run dev   # Runs on http://localhost:5173
```

Visit `http://localhost:5173` to test the application locally.

---

## 🌐 Production Deployment (Vercel & Google Cloud)

### Step 1: Vercel Backend Project (`qumail-backend-rho`)
Add Environment Variables in Vercel Dashboard:
- `BETTER_AUTH_URL` = `https://qumail-nine.vercel.app`
- `FRONTEND_URL` = `https://qumail-nine.vercel.app`
- `BETTER_AUTH_SECRET` = `<your secret>`
- `DATABASE_URL` = `<your neon database connection string>`
- `GOOGLE_CLIENT_ID` = `<your client id>`
- `GOOGLE_CLIENT_SECRET` = `<your client secret>`

### Step 2: Vercel Frontend Project (`qumail-nine`)
Add Environment Variable in Vercel Dashboard:
- `VITE_BACKEND_URL` = `https://qumail-nine.vercel.app`

### Step 3: Google Cloud Console Configuration
Under **Authorized JavaScript origins**:
- `https://qumail-nine.vercel.app`
- `http://localhost:5173`

Under **Authorized redirect URIs**:
- `https://qumail-nine.vercel.app/api/auth/callback/google`
- `http://localhost:8080/api/auth/callback/google`

---

## 🔐 Security Architecture & Key Management

1. **Authentication:** Authenticates users via `better-auth` Google OAuth2, persisting sessions securely in PostgreSQL with HTTP-only SameSite cookies.
2. **Key Generation:** `/api/km/enc_keys` issues quantum key IDs mapped to sender-recipient pairs with expiration metadata.
3. **Session Proxying:** Requests routed through Same-Origin reverse proxying to protect state cookies from Public Suffix List restrictions on `*.vercel.app`.

---

## 📜 Sub-Project Documentation

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
