import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import Timeline from "../components/Timeline";
import { Mail, ShieldCheck, KeyRound } from "lucide-react";
import { keyManagerStatus, keyManagerLogs } from "../data/mockKeys";

// The right utility panel only makes sense next to the mail views —
// keep it out of full-width pages like Compose or Settings.
const HIDE_PANEL_ON = ["/compose", "/settings"];

export default function DashboardLayout() {
  const location = useLocation();
  const showPanel = !HIDE_PANEL_ON.some((p) => location.pathname.startsWith(p));

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="thin-scroll flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
        {showPanel && (
          <aside className="thin-scroll hidden w-72 shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-4 lg:block">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Today</p>
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Mail} label="Emails sent" value="18" tone="blue" />
              <StatCard icon={ShieldCheck} label="Quantum secured" value="12" tone="green" />
            </div>

            <div className="mt-5 rounded-xl border border-green-200 bg-green-50/60 p-3">
              <div className="flex items-center gap-2">
                <KeyRound size={14} className="text-green-600" />
                <p className="text-xs font-semibold text-green-700">Quantum Status</p>
              </div>
              <p className="mt-2 font-mono text-xs text-green-800">{keyManagerStatus.currentKeyId}</p>
              <p className="mt-1 text-xs text-green-600">{keyManagerStatus.remainingKeys} keys remaining today</p>
            </div>

            <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">Recent activity</p>
            <Timeline items={keyManagerLogs.slice(0, 4)} />
          </aside>
        )}
      </div>
    </div>
  );
}
