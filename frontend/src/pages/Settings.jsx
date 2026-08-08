import { useState } from "react";
import { Moon, Sun, Bell, ShieldCheck, User, LogOut, AlertCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { showToast } = useToast();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    newMail: true,
    keyExpiry: true,
    kmDown: true,
  });
  const [defaultLevel, setDefaultLevel] = useState("QAES");

  const save = () => showToast("Settings saved", "success");

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch {
      showToast("Sign out failed", "error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-6">
      <h1 className="font-display text-xl font-semibold text-slate-800">Settings</h1>
      <p className="mb-6 text-sm text-slate-400">
        Manage your profile, appearance, notifications, and email preferences.
      </p>

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div className="flex items-center gap-4">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-14 w-14 rounded-full border-2 border-blue-200 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
              {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "QM"}
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-800">{user?.name || "Not signed in"}</p>
            <p className="text-sm text-slate-500">{user?.email || "—"}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
              <ShieldCheck size={11} /> Google OAuth Active
            </p>
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={Moon}>
        <p className="mb-3 text-xs text-slate-400">
          Toggle between light and dark mode. Your preference is saved automatically.
        </p>
        <div className="flex gap-3">
          <ToggleCard
            active={theme === "light"}
            icon={Sun}
            label="Light"
            onClick={() => { setTheme("light"); showToast("Switched to Light mode", "info"); }}
          />
          <ToggleCard
            active={theme === "dark"}
            icon={Moon}
            label="Dark"
            onClick={() => { setTheme("dark"); showToast("Switched to Dark mode", "info"); }}
          />
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <div className="space-y-1">
          <CheckRow
            label="New mail alerts"
            desc="Get notified when a new encrypted message arrives"
            checked={notifications.newMail}
            onChange={(v) => setNotifications((n) => ({ ...n, newMail: v }))}
          />
          <CheckRow
            label="Quantum key nearing expiry"
            desc="Warns when a key is about to expire or be consumed"
            checked={notifications.keyExpiry}
            onChange={(v) => setNotifications((n) => ({ ...n, keyExpiry: v }))}
          />
          <CheckRow
            label="Key Manager unreachable"
            desc="Alert if the KM node stops responding"
            checked={notifications.kmDown}
            onChange={(v) => setNotifications((n) => ({ ...n, kmDown: v }))}
          />
        </div>
      </Section>

      {/* Email Preferences */}
      <Section title="Email preferences" icon={ShieldCheck}>
        <label className="block text-sm text-slate-600">
          Default quantum security level for new messages
          <select
            value={defaultLevel}
            onChange={(e) => setDefaultLevel(e.target.value)}
            className="input mt-2 block w-full"
          >
            <option value="OTP">Quantum Secure (OTP — One Time Pad)</option>
            <option value="QAES">Quantum-Aided AES-256</option>
            <option value="PQC">Post-Quantum Crypto (CRYSTALS-Kyber)</option>
            <option value="NONE">Standard Email (No Encryption)</option>
          </select>
        </label>
        <p className="mt-2 text-xs text-slate-400">
          ETSI GS QKD 014 compliant. Keys are managed by your QuMail Key Manager node.
        </p>
      </Section>

      {/* About */}
      <Section title="About QuMail" icon={AlertCircle}>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Version" value="0.9.2" />
          <Info label="Security Model" value="ETSI GS QKD 014" />
          <Info label="Key Algorithm" value="AES-256-GCM + Kyber-1024" />
          <Info label="Build" value="SIH 2026 Hackathon" />
        </div>
      </Section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save changes
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon size={16} className="text-blue-500" />}
        <p className="text-sm font-semibold text-slate-700">{title}</p>
      </div>
      {children}
    </div>
  );
}

function ToggleCard({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
        active
          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
          : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );
}

function CheckRow({ label, desc, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between rounded-lg py-2.5 hover:bg-slate-50 px-2">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {desc && <p className="text-xs text-slate-400">{desc}</p>}
      </div>
      <div className="relative ml-4 mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`h-5 w-9 rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-slate-200"}`}
          onClick={() => onChange(!checked)}
        >
          <div className={`h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
        </div>
      </div>
    </label>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}
