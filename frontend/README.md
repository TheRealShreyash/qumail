# 🎨 QuMail Frontend Web Application

> **React 19 + Vite + TailwindCSS v4 Quantum Mail Interface**

The QuMail frontend provides a modern single-page application (SPA) for email composition, post-quantum key management, security log auditing, and Google OAuth login.

---

## 🚀 Key Client Services & Architecture

### 1. Same-Origin API Proxying (Vercel Rewrites)
To prevent cross-domain cookie stripping on `*.vercel.app` subdomains (caused by the Public Suffix List), all production API calls hit `/api/*` on the frontend domain (`qumail-nine.vercel.app`). `vercel.json` proxies these calls server-to-server to the backend.

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://qumail-backend-rho.vercel.app/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 2. Client Authentication (`src/lib/auth-client.js`)
Uses `better-auth/react` to manage authentication state and Google OAuth sign-in flows cleanly.

### 3. Local Web Cryptography (`src/lib/crypto.js`)
Performs client-side encryption using AES-256-GCM with quantum-generated key material before email content leaves the browser.

---

## 📁 Frontend Project Structure

```
frontend/
├── public/                    # Static Assets
├── src/
│   ├── assets/                # Logos & Icons
│   ├── components/            # UI Components (Buttons, Modals, Badges, GoogleSignInButton)
│   ├── context/               # Global Contexts (AuthContext, ThemeContext, ToastContext)
│   ├── data/                  # Mock Email & Log Data Fallbacks
│   ├── hooks/                 # Custom Hooks (useAuth, useTheme, useToast)
│   ├── layouts/               # DashboardLayout (Navbar, Sidebar, Right Panel)
│   ├── lib/
│   │   ├── api.js             # API Request Client Wrapper
│   │   ├── auth-client.js     # Better-Auth Client Setup
│   │   └── crypto.js          # Web Crypto Encryption Utilities
│   ├── pages/                 # Route Page Components
│   ├── routes/                # React Router AppRoutes Definition
│   ├── App.jsx                # Main Application Provider Wrapper
│   ├── main.jsx               # React DOM Root Mounting
│   └── index.css              # TailwindCSS Styles & Custom Design System
├── package.json
├── vercel.json                # Production Same-Origin Rewrites
└── vite.config.js             # Development Server Proxy
```

---

## 🗺️ Page Route Map

| Route | Component | Description | Access |
|---|---|---|---|
| `/` | `Welcome.jsx` | Product Landing & Feature Showcase | Public |
| `/login` | `Login.jsx` | Google OAuth & SMTP/IMAP Credentials Form | Public |
| `/inbox` | `Inbox.jsx` | Encrypted Inbox & Folder Mail Lists | Protected |
| `/sent` | `Inbox.jsx` | Sent Mail Folder | Protected |
| `/drafts` | `Inbox.jsx` | Drafts Folder | Protected |
| `/trash` | `Inbox.jsx` | Deleted Items | Protected |
| `/mail/:id` | `EmailReading.jsx` | Email Viewer with Decryption Status | Protected |
| `/compose` | `Compose.jsx` | Email Composer with Encryption Picker | Protected |
| `/security` | `SecurityConfig.jsx` | Standalone Security Level Selector | Protected |
| `/keys` | `KeyManager.jsx` | Quantum Key Management Dashboard | Protected |
| `/logs` | `SecurityLogs.jsx` | Real-time Audit & Security Event Logs | Protected |
| `/settings` | `Settings.jsx` | User Preferences & Server Configurations | Protected |

---

## ⚙️ Environment Variables

Create `.env` in `frontend/`:

```env
# In Local Dev: set to http://localhost:8080 (or leave empty to use Vite proxy)
# In Production on Vercel: set to https://qumail-nine.vercel.app (or leave empty)
VITE_BACKEND_URL=http://localhost:8080
```

---

## 💻 Local Development & Build Scripts

```bash
# Install dependencies
npm install

# Start Vite dev server with proxy
npm run dev

# Run Oxlint for code linting
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```
