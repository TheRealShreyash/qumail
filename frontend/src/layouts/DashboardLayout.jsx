import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import Timeline from "../components/Timeline";
import { KeyRound, ShieldCheck, ScrollText } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { apiRequest } from "../lib/api";

// The right utility panel only makes sense next to the mail views —
// keep it out of full-width pages like Compose or Settings.
const HIDE_PANEL_ON = ["/compose", "/settings"];

export default function DashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const showPanel = !HIDE_PANEL_ON.some((p) => location.pathname.startsWith(p));

  const [status, setStatus] = useState({ activeKeys: 0, consumedKeys: 0 });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!showPanel) return;
    const email = user?.email || "";
    Promise.all([
      apiRequest(`/api/km/status?email=${encodeURIComponent(email)}`),
      apiRequest(`/api/km/logs?email=${encodeURIComponent(email)}`),
    ])
      .then(([statusRes, logsRes]) => {
        if (statusRes.data) setStatus(statusRes.data);
        if (logsRes.data) setLogs(logsRes.data);
      })
      .catch((err) => console.error("Failed to load KM panel data:", err));
  }, [user?.email, showPanel]);

  const currentKeyId = logs.find((l) => l.keyId)?.keyId;
  const timelineItems = logs.slice(0, 4).map((l) => ({
    id: l.id,
    event: l.action.replace(/_/g, " "),
    time: new Date(l.createdAt).toLocaleTimeString(),
    status: l.action.includes("UNAUTHORIZED") ? "warning" : "success",
  }));

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
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Quantum key vault</p>
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={ShieldCheck} label="Active keys" value={status.activeKeys} tone="green" />
              <StatCard icon={ScrollText} label="Audit events" value={status.totalLogs ?? logs.length} tone="indigo" />
            </div>

            <div className="mt-5 rounded-xl border border-green-200 bg-green-50/60 p-3">
              <div className="flex items-center gap-2">
                <KeyRound size={14} className="text-green-600" />
                <p className="text-xs font-semibold text-green-700">Quantum Status</p>
              </div>
              <p className="mt-2 truncate font-mono text-xs text-green-800">{currentKeyId || "No keys allocated yet"}</p>
              <p className="mt-1 text-xs text-green-600">{status.consumedKeys ?? 0} keys consumed to date</p>
            </div>

            <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">Recent activity</p>
            {timelineItems.length > 0 ? (
              <Timeline items={timelineItems} />
            ) : (
              <p className="text-xs text-slate-400">No security events yet.</p>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
