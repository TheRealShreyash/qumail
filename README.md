# 🛡️ QuMail — Quantum-Secured Email & Key Management Platform

> **Quantum-Safe Post-Quantum Cryptography (PQC) & QKD-Enabled Mail Client**  
> QuMail equips legacy email infrastructures (Gmail, standard SMTP/IMAP) with a 4-tier quantum security model — from mathematically unbreakable One-Time Pad (OTP) encryption to standard TLS transport — all without requiring mail servers to change.

---

## 📸 Overview

QuMail protects sensitive communications against future quantum computer decryption attacks ("Harvest Now, Decrypt Later"). It wraps end-to-end encryption around existing Google accounts **before** messages leave the device, leaving the Gmail API as a blind transport layer.

### Key Capabilities

- 🛡️ **One-Time Pad (OTP) Encryption:** The highest tier of quantum security. Implements Claude Shannon's information-theoretically secure XOR stream cipher (`Ciphertext = Plaintext ⊕ Key`) using a single-use QKD key exactly as long as the message body — mathematically unbreakable by any supercomputer or quantum computer.
- 🔒 **Quantum-Aided AES-256-GCM (QAES):** Quantum-seeded AES-256-GCM block cipher encryption for high-speed secure messaging. Each email gets a unique single-use 256-bit key.
- 🧬 **Post-Quantum Crypto (PQC):** NIST-standardized CRYSTALS-Kyber / Dilithium algorithm tier for resilience when live quantum key channels are unavailable.
- 🌐 **Standard TLS (NONE):** Legacy mode — standard Gmail TLS 1.3 in-transit protection with no client-side payload encryption.
- ⚛️ **Quantum Key Management (KM):** ETSI GS QKD 014 REST API interface for generating, exchanging, and auditing quantum keys. Every key is single-use: `ACTIVE` → `CONSUMED` on first decryption.
- 🔑 **Google OAuth 2.0 Integration:** Powered by `better-auth` with Google Gmail API scopes (`gmail.send`, `gmail.readonly`).
- 🌐 **Vercel Same-Origin Proxying:** Reverse-proxy rewrites preventing cross-domain cookie stripping on `*.vercel.app` deployments.
- 🗄️ **Serverless Relational Storage:** Drizzle ORM + Neon Serverless PostgreSQL for keys, users, and security audit logs.

---

## 🔐 4-Tier Security Model

| Tier | Mode | Algorithm | Key Size | Security Guarantee | Badge |
|---|---|---|---|---|---|
| 🥇 **Tier 1** | `OTP` — One-Time Pad | Bitwise XOR Stream (`P ⊕ K`) | Dynamic (= message byte length) | **Information-Theoretic (Unbreakable)** | Green |
| 🥈 **Tier 2** | `QAES` — Quantum-Aided AES | AES-256-GCM + Quantum Seed | Fixed 256-bit (32 bytes) | Computational Security | Blue |
| 🥉 **Tier 3** | `PQC` — Post-Quantum Crypto | CRYSTALS-Kyber / Dilithium | NIST PQC Standard | Quantum-Resistant Computational | Purple |
| ⬜ **Tier 4** | `NONE` — Standard Email | Gmail TLS 1.3 (in-transit only) | N/A | Transport Security (no E2E) | Gray |

> **OTP Key Lifecycle:**  
> 1. Sender selects OTP → Client calculates body byte length.  
> 2. Backend KM generates `crypto.randomBytes(length)` — a QKD raw random stream matching message size.  
> 3. Client XOR-encrypts payload: `Ciphertext[i] = Plaintext[i] ⊕ Key[i]`.  
> 4. Encrypted ciphertext sent via Gmail API with `X-QuMail-Security: OTP` & `X-QuMail-Key-ID` headers.  
> 5. Recipient opens email → Key status `ACTIVE`. Clicks Decrypt → key consumed (`CONSUMED`), XOR-decrypted client-side.  
> 6. Audit log records `KEY_GENERATED_OTP` and `KEY_DECRYPTED` events in Neon DB.

---

## 🏗️ System Architecture

```
+-------------------------------------------------------------------------+
|                              USER BROWSER                               |
|           (QuMail React 19 + TailwindCSS v4 SPA)                        |
|                                                                         |
|  Cryptography Layer (src/lib/crypto.js):                                |
|  ┌──────────────────────────────────────────────────────────────┐       |
|  │  encryptPayload(text, key, level)  ──►  OTP: XOR stream      │       |
|  │                                    ──►  QAES: AES-256-GCM    │       |
|  │  decryptPayload(cipher, key, level) ──► OTP: XOR stream      │       |
|  │                                    ──►  QAES: AES-256-GCM    │       |
|  └──────────────────────────────────────────────────────────────┘       |
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
|  +-------------------+   +---------------------+   +----------------+   |
|  | Better-Auth OAuth |   | Key Manager (KM)    |   | Email Router   |   |
|  |                   |   | ETSI GS QKD 014 API |   | Gmail API      |   |
|  |                   |   | OTP: randomBytes(N) |   | MIME Headers   |   |
|  |                   |   | QAES: randomBytes(32)|   | X-QuMail-*     |   |
|  +-------------------+   +---------------------+   +----------------+   |
+-------------------------------------------------------------------------+
           |                                  |
           v                                  v
+-----------------------+          +-----------------------+
|  Neon Serverless PG   |          |    Google OAuth 2.0   |
| (Users, Keys, Logs)   |          |  & Gmail API Services |
| quantumKeys table     |          |                       |
| securityLogs table    |          |                       |
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
│   │   │   │   │   ├── email.service.ts  # Gmail API, MIME header parsing
│   │   │   │   │   └── email.controller.ts
│   │   │   │   └── km/       # Quantum Key Management
│   │   │   │       ├── km.service.ts     # Key generation (OTP dynamic length, QAES 32-byte)
│   │   │   │       ├── km.controller.ts  # Handles keyLength param for OTP
│   │   │   │       ├── km.routes.ts
│   │   │   │       └── km.types.ts
│   │   └── db/               # Drizzle Database Connection & Schemas
│   ├── package.json
│   └── vercel.json           # Backend Serverless Rewrites
│
├── frontend/                 # React 19 + Vite + TailwindCSS v4 Frontend
│   ├── src/
│   │   ├── components/       # UI Components (Buttons, Modals, Badges)
│   │   │   ├── SecurityBadge.jsx       # OTP/QAES/PQC/NONE visual badges
│   │   │   └── SecurityLevelPicker.jsx # 4-tier security selector in Compose
│   │   ├── context/          # Auth, Theme, and Toast Contexts
│   │   ├── hooks/            # Custom Hooks (useAuth, useToast)
│   │   ├── lib/
│   │   │   ├── crypto.js     # encryptOTP, decryptOTP, encryptPayload, decryptPayload
│   │   │   └── api.js        # API client
│   │   ├── pages/
│   │   │   ├── Compose.jsx        # Security level selection & encrypted send
│   │   │   ├── EmailReading.jsx   # OTP/QAES/TLS visual banners & client decrypt
│   │   │   ├── KeyManager.jsx     # ETSI KM dashboard, key registry, audit logs
│   │   │   ├── SecurityLogs.jsx   # Real-time security event audit trail
│   │   │   └── SecurityConfig.jsx # Default security level configuration
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
bun install   # or npm install

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
bun run dev   # Runs on http://localhost:8080
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

### End-to-End Encryption Flow

```
SENDER (Browser)                    BACKEND KM                     RECIPIENT (Browser)
      │                                  │                                │
      │  POST /api/km/enc_keys           │                                │
      │  { algorithm, keyLength }  ────► │  crypto.randomBytes(N)         │
      │                            ◄──── │  Store key in DB (ACTIVE)       │
      │                                  │  Log KEY_GENERATED_OTP         │
      │  encryptPayload(body, key, level) │                                │
      │  OTP:  cipher = body XOR key     │                                │
      │  QAES: cipher = AES-GCM(body,key)│                                │
      │                                  │                                │
      │  POST /api/email/send            │                                │
      │  { body: cipher, keyId, level } ─┼──── Gmail API ────────────────►│
      │                                  │  X-QuMail-Security: OTP        │
      │                                  │  X-QuMail-Key-ID: qk_...       │
      │                                  │                                │
      │                                  │  GET /api/km/dec_keys          │
      │                                  │◄──────────────────────────────  │
      │                                  │  Authorize user                │
      │                                  │  Set status → CONSUMED         │
      │                                  │  Log KEY_DECRYPTED             │
      │                                  │  ─────────────────────────────►│
      │                                  │                                │
      │                                  │  decryptPayload(cipher, key, level)
      │                                  │                                │ OTP: plain = cipher XOR key
      │                                  │                                │ QAES: AES-GCM decrypt
```

### Key Properties

1. **Single-Use Keys:** Every email generates a unique key. Keys transition `ACTIVE → CONSUMED` on first decryption.
2. **Client-Side Only:** The plaintext message **never** reaches the backend. Encryption and decryption happen entirely in the browser.
3. **OTP Key Length:** For OTP tier, `keyLength = TextEncoder.encode(body).length` is sent to the backend, ensuring a 1:1 key-to-plaintext byte mapping as required by Shannon's theorem.
4. **Authentication:** Users authenticate via `better-auth` Google OAuth2 with HTTP-only SameSite session cookies in PostgreSQL.
5. **Access Control:** Key Manager verifies the requesting user is either the sender or recipient before releasing decryption keys. Unauthorized attempts are logged as `UNAUTHORIZED_ACCESS_ATTEMPT`.
6. **MIME Security Headers:** All encrypted emails carry `X-QuMail-Security` (tier identifier) and `X-QuMail-Key-ID` (key reference) custom MIME headers.

---

## 📜 Sub-Project Documentation

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)

---

## 👥 Team & Credits

Special thanks to everyone who contributed to building QuMail:

| Contributor | Role | GitHub Profile |
|---|---|---|
| **Shreyash Koshta** | Backend Engine & Integration | [@therealshreyash](https://github.com/TheRealShreyash) |
| **Rohit Sharma** | Frontend UI Development | [@rooohittt88](https://github.com/rooohittt88) |
| **Priyanshu Pandit** | Frontend UI Development | [@odenthegod](https://github.com/odenthegod) |

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
