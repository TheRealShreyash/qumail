import { Link } from "react-router-dom";
import { ShieldCheck, KeyRound, Lock, ArrowRight, Cpu, Mail } from "lucide-react";

const TIERS = [
  { id: "OTP", label: "One-Time Pad", icon: ShieldCheck, tone: "text-green-600 bg-green-50 border-green-200" },
  { id: "QAES", label: "Quantum AES-256", icon: Lock, tone: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "PQC", label: "CRYSTALS-Kyber", icon: Cpu, tone: "text-purple-600 bg-purple-50 border-purple-200" },
  { id: "NONE", label: "Standard TLS", icon: Mail, tone: "text-slate-500 bg-slate-100 border-slate-200" },
];

export default function Welcome() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex items-center gap-2 px-8 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/30">
          <ShieldCheck size={16} />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight text-slate-800">QuMail</span>
      </header>

      <main className="quantum-grid relative flex flex-1 items-center justify-center px-6 py-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-linear-to-b from-indigo-100/50 to-transparent" />
        <div className="relative grid w-full max-w-5xl items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 font-mono text-xs font-medium text-green-700">
              <span className="quantum-pulse h-1.5 w-1.5 rounded-full bg-green-500" />
              BUILT ON ETSI GS QKD 014
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-slate-800 md:text-5xl">
              Quantum Secure<br />
              <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Email Communication</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-500">
              QuMail layers real quantum key distribution on top of the email you already use —
              Gmail, Yahoo, or your own server — with a choice of four security levels for every message you send.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-600/30 active:scale-[0.98]"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <Link
                to="/keys"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                See Key Manager
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {TIERS.map((t) => (
                <span key={t.id} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium ${t.tone}`}>
                  <t.icon size={12} /> {t.label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Live key exchange</p>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <KeyRound size={16} className="text-indigo-600" /> Key Manager
              </div>
              <span className="quantum-pulse-indigo h-2 w-2 rounded-full bg-indigo-500" />
            </div>
            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-900 p-4 font-mono text-xs text-green-400/90">
              qk_88a2f91c4d3e7b21<br />256-bit · OTP-ready
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
              <Lock size={15} /> Message encrypted with One-Time Pad
            </div>
          </div>
        </div>
      </main>

      <footer className="px-8 py-5 text-center font-mono text-xs text-slate-400">
        QuMail v0.9.2 · Smart India Hackathon 2025 build
      </footer>
    </div>
  );
}
