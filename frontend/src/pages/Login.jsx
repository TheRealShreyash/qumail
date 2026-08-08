import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../components/Button";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    smtp: "smtp.qumail.io",
    imap: "imap.qumail.io",
    remember: true,
  });
  const [testState, setTestState] = useState("idle"); // idle | testing | success | error
  const [loggingIn, setLoggingIn] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const testConnection = () => {
    setTestState("testing");
    setTimeout(() => setTestState(Math.random() > 0.15 ? "success" : "error"), 1100);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setTimeout(() => navigate("/inbox"), 900);
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-slate-900 p-10 text-white md:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <ShieldCheck size={16} />
          </div>
          <span className="font-display text-lg font-semibold">QuMail</span>
        </div>
        <div>
          <p className="font-display text-3xl font-semibold leading-snug">
            Every email,<br />quantum secured.
          </p>
          <p className="mt-3 max-w-sm text-sm text-slate-400">
            Log in with your existing mail account. QuMail handles the quantum key exchange and
            encryption layer on top — your provider never sees the difference.
          </p>
        </div>
        <p className="text-xs text-slate-500">© 2026 QuMail · v0.9.2</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold text-slate-800">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Connect your mail account to continue.</p>

          <div className="mt-6 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
            <ShieldCheck size={15} className="mt-0.5 shrink-0" />
            Your credentials are used only to relay mail through SMTP/IMAP. Message content is
            encrypted locally before it ever reaches the server.
          </div>

          <div className="mt-5 space-y-4">
            <Field label="Email address" type="email" required value={form.email} onChange={update("email")} placeholder="you@qumail.io" />
            <Field label="Password" type="password" required value={form.password} onChange={update("password")} placeholder="••••••••" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="SMTP server" value={form.smtp} onChange={update("smtp")} />
              <Field label="IMAP server" value={form.imap} onChange={update("imap")} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-500">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>
            <button type="button" onClick={testConnection} className="text-sm font-medium text-blue-600 hover:underline">
              Test Connection
            </button>
          </div>

          {testState === "testing" && (
            <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <Loader2 size={13} className="animate-spin" /> Testing SMTP/IMAP connection…
            </p>
          )}
          {testState === "success" && (
            <p className="mt-2 flex items-center gap-2 text-xs text-green-600">
              <CheckCircle2 size={13} /> Connection successful. Servers reachable.
            </p>
          )}
          {testState === "error" && (
            <p className="mt-2 flex items-center gap-2 text-xs text-red-500">
              <XCircle size={13} /> Couldn't reach the mail server. Check the hostnames and try again.
            </p>
          )}

          <PrimaryButton type="submit" disabled={loggingIn} className="mt-6 w-full">
            {loggingIn ? <Loader2 size={16} className="animate-spin" /> : null}
            {loggingIn ? "Signing in…" : "Log in"}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => navigate("/inbox")} className="mt-2 w-full">
            Continue as demo user
          </SecondaryButton>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700
          placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
