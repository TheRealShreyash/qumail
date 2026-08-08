import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import { securityLogs } from "../data/mockLogs";
import StatusChip from "../components/StatusChip";
import EmptyState from "../components/EmptyState";

const statusMap = { success: "success", warning: "warning", error: "error" };

export default function SecurityLogs() {
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return securityLogs.filter((l) => {
      if (levelFilter !== "all" && l.level !== levelFilter) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      return true;
    });
  }, [levelFilter, statusFilter]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <h1 className="font-display text-xl font-semibold text-slate-800">Security Logs</h1>
      <p className="text-sm text-slate-400">Every encryption, key exchange, and verification event, in order.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={levelFilter === "all"} onClick={() => setLevelFilter("all")}>All levels</Chip>
        {["OTP", "QAES", "PQC"].map((l) => (
          <Chip key={l} active={levelFilter === l} onClick={() => setLevelFilter(l)}>{l}</Chip>
        ))}
        <span className="mx-1 h-5 w-px bg-slate-200" />
        <Chip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>Any status</Chip>
        {["success", "warning", "error"].map((s) => (
          <Chip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>{s}</Chip>
        ))}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {filtered.length === 0 ? (
          <EmptyState icon={ScrollText} title="No matching log entries" description="Try clearing a filter above." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Event</th>
                <th className="px-4 py-2.5">Level</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 last:border-0">
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-500">{log.time}</td>
                  <td className="px-4 py-2.5 text-slate-700">{log.event}</td>
                  <td className="px-4 py-2.5 text-slate-500">{log.level}</td>
                  <td className="px-4 py-2.5"><StatusChip status={statusMap[log.status]}>{log.status}</StatusChip></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Chip({ active, children, ...props }) {
  return (
    <button
      {...props}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
