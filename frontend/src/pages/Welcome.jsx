import { Link } from "react-router-dom";
import { ShieldCheck, KeyRound, Lock, ArrowRight } from "lucide-react";

export default function Welcome() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex items-center gap-2 px-8 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <ShieldCheck size={16} />
        </div>
        <span className="font-display text-lg font-semibold text-slate-800">QuMail</span>
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="grid w-full max-w-5xl items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <span className="quantum-pulse h-1.5 w-1.5 rounded-full bg-green-500" />
              Built on ETSI GS QKD 014
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-slate-800 md:text-5xl">
              Quantum Secure<br />Email Communication
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-500">
              QuMail layers real quantum key distribution on top of the email you already use —
              Gmail, Yahoo, or your own server — with a choice of four security levels for every message you send.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <Link
                to="/keys"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                See Key Manager
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Live key exchange</p>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <KeyRound size={16} className="text-blue-600" /> Key Manager
              </div>
              <span className="quantum-pulse-blue h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <div className="mt-3 rounded-xl border border-slate-100 p-4 font-mono text-xs text-slate-500">
              QK-88A2-F91C-4D3E<br />256-bit · OTP-ready
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
              <Lock size={15} /> Message encrypted with One-Time Pad
            </div>
          </div>
        </div>
      </main>

      <footer className="px-8 py-5 text-center text-xs text-slate-400">
        QuMail v0.9.2 · Smart India Hackathon 2025 build
      </footer>
    </div>
  );
}
