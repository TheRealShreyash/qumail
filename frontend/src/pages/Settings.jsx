import { useState } from "react";
import { Moon, Sun, Bell, Mail, Network, Info } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { currentUser } from "../data/mockUser";

export default function Settings() {
  const { showToast } = useToast();
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({ newMail: true, keyExpiry: true, kmDown: true });
  const [defaultLevel, setDefaultLevel] = useState("QAES");
  const [kmEndpoint, setKmEndpoint] = useState("https://km-local.qumail.io/api/v1/keys");

  const save = () => showToast("Settings saved", "success");

  return (
    <div className="mx-auto max-w-2xl px-6 py-6">
      <h1 className="font-display text-xl font-semibold text-slate-800">Settings</h1>
      <p className="mb-6 text-sm text-slate-400">Manage how QuMail looks, notifies you, and talks to your Key Manager.</p>

      <Section title="Appearance">
        <div className="flex gap-2">
          <ToggleCard active={theme === "light"} icon={Sun} label="Light" onClick={() => setTheme("light")} />
          <ToggleCard active={theme === "dark"} icon={Moon} label="Dark" onClick={() => setTheme("dark")} />
        </div>
        <p className="mt-2 text-xs text-slate-400">Dark theme is in preview — some screens may still render light.</p>
      </Section>

      <Section title="Notifications">
        <CheckRow label="New mail" checked={notifications.newMail} onChange={(v) => setNotifications((n) => ({ ...n, newMail: v }))} />
        <CheckRow label="Quantum key nearing expiry" checked={notifications.keyExpiry} onChange={(v) => setNotifications((n) => ({ ...n, keyExpiry: v }))} />
        <CheckRow label="Key Manager unreachable" checked={notifications.kmDown} onChange={(v) => setNotifications((n) => ({ ...n, kmDown: v }))} />
      </Section>

      <Section title="Email preferences">
        <label className="block text-sm text-slate-600">
          Default security level for new messages
          <select value={defaultLevel} onChange={(e) => setDefaultLevel(e.target.value)} className="input mt-1">
            <option value="OTP">Quantum Secure (OTP)</option>
            <option value="QAES">Quantum-Aided AES</option>
            <option value="PQC">Post-Quantum Crypto</option>
            <option value="NONE">Standard Email</option>
          </select>
        </label>
      </Section>

      <Section title="Quantum network configuration">
        <label className="block text-sm text-slate-600">
          Key Manager endpoint
          <input value={kmEndpoint} onChange={(e) => setKmEndpoint(e.target.value)} className="input mt-1 font-mono text-xs" />
        </label>
        <p className="mt-1 text-xs text-slate-400">ETSI GS QKD 014 compliant REST endpoint.</p>
      </Section>

      <Section title="About QuMail">
        <div className="space-y-1 text-sm text-slate-600">
          <p>Version 0.9.2</p>
          <p className="text-slate-400">Developed for Smart India Hackathon 2025</p>
          <p className="text-slate-400">License: MIT</p>
        </div>
      </Section>

      <button onClick={save} className="mt-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
        Save changes
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
      <p className="mb-3 text-sm font-semibold text-slate-700">{title}</p>
      {children}
    </div>
  );
}

function ToggleCard({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
        active ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"
      }`}
    >
      <Icon size={15} /> {label}
    </button>
  );
}

function CheckRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between py-1.5 text-sm text-slate-600">
      {label}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
    </label>
  );
}
