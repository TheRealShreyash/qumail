# QuMail — Quantum Secure Email Client (Frontend)

Hackathon frontend for QuMail. React + Vite + Tailwind CSS v4. Mock data only —
no backend, auth, or real encryption yet (see "Next steps" below).

## Run it

```bash
npm install
npm run dev
```

Open the printed localhost URL. Start at `/` (Welcome) → "Get Started" → Login
("Continue as demo user" skips the form) → Inbox.

## Pages

| Route | Page |
|---|---|
| `/` | Welcome / landing |
| `/login` | Login (SMTP/IMAP fields, Test Connection) |
| `/inbox`, `/sent`, `/drafts`, `/trash` | Mail list views |
| `/mail/:id` | Email reading view |
| `/compose` | Compose (supports `?reply=`, `?replyAll=`, `?forward=` with an email id) |
| `/security` | Standalone security-level picker |
| `/keys` | Quantum Key Manager dashboard |
| `/logs` | Security logs |
| `/settings` | Settings |

## Folder structure

```
src/
  components/   reusable UI (Button, Modal, EmailCard, SecurityBadge, ...)
  pages/        one file per route
  layouts/      DashboardLayout (navbar + sidebar + right panel + outlet)
  routes/       AppRoutes.jsx — all route definitions
  context/      ToastContext (global toast notifications)
  data/         mock JSON-like data (emails, keys, logs, user)
```

## Next steps (backend integration)

- Swap `src/data/*` for real API calls (React Query or plain fetch + hooks).
- Wire the 4 security levels in `SecurityLevelPicker.jsx` to real encryption
  calls (OTP, quantum-seeded AES, PQC, none) instead of just setting local state.
- Point `/keys` at a real ETSI GS QKD 014 Key Manager REST endpoint.
- Add real auth (the Login page currently has no logic, by design).
