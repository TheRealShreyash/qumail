import { ShieldCheck, Lock, Cpu, Mail, Check } from "lucide-react";

export const LEVELS = [
  {
    id: "OTP",
    title: "Quantum Secure",
    subtitle: "One-Time Pad",
    description: "Uses a quantum key exactly once as a one-time pad. Mathematically unbreakable, even by a future quantum computer.",
    icon: ShieldCheck,
    color: "green",
  },
  {
    id: "QAES",
    title: "Quantum-Aided AES",
    subtitle: "Quantum-seeded AES-256",
    description: "Quantum keys seed a standard AES-256 cipher — strong, fast, and suited to attachments and large messages.",
    icon: Lock,
    color: "blue",
  },
  {
    id: "PQC",
    title: "Post-Quantum Crypto",
    subtitle: "CRYSTALS-Kyber / Dilithium",
    description: "Falls back to NIST-standardized quantum-resistant algorithms when a live quantum key isn't available.",
    icon: Cpu,
    color: "purple",
  },
  {
    id: "NONE",
    title: "Standard Email",
    subtitle: "No quantum protection",
    description: "Regular TLS-in-transit email, same as any conventional provider. Fastest, least protected.",
    icon: Mail,
    color: "gray",
  },
];

const ring = {
  green: "border-green-500 ring-green-100",
  blue: "border-blue-500 ring-blue-100",
  purple: "border-purple-500 ring-purple-100",
  gray: "border-slate-400 ring-slate-100",
};
const iconTone = {
  green: "bg-green-50 text-green-600",
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  gray: "bg-slate-100 text-slate-500",
};
const dot = {
  green: "bg-green-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  gray: "bg-slate-400",
};

export default function SecurityLevelPicker({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Security level" className="grid gap-3 sm:grid-cols-2">
      {LEVELS.map((lvl) => {
        const active = value === lvl.id;
        const Icon = lvl.icon;
        return (
          <button
            key={lvl.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(lvl.id)}
            className={`relative rounded-xl border p-4 text-left transition-all ${
              active ? `${ring[lvl.color]} ring-2 bg-white` : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {active && (
              <span className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-white ${dot[lvl.color]}`}>
                <Check size={12} />
              </span>
            )}
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconTone[lvl.color]}`}>
              <Icon size={17} />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800">{lvl.title}</p>
            <p className="text-xs font-medium text-slate-400">{lvl.subtitle}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{lvl.description}</p>
          </button>
        );
      })}
    </div>
  );
}
