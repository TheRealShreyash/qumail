import { useEffect, useState } from "react";
import { ScrollText, RefreshCw } from "lucide-react";
import StatusChip from "../components/StatusChip";
import EmptyState from "../components/EmptyState";
import { apiRequest } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

export default function SecurityLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const email = user?.email || "";
      const res = await apiRequest(`/api/km/logs?email=${encodeURIComponent(email)}`);
      if (res.data) setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-800">Security Logs</h1>
          <p className="text-sm text-slate-400">Live cryptographic audit trail from Neon PostgreSQL DB.</p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Logs
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {logs.length === 0 ? (
          <EmptyState icon={ScrollText} title="No security audit logs yet" description="Generate keys or send encrypted emails to generate logs." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">User</th>
                <th className="px-4 py-2.5">Action</th>
                <th className="px-4 py-2.5">Key ID</th>
                <th className="px-4 py-2.5">Algorithm</th>
                <th className="px-4 py-2.5">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-slate-700 text-xs font-medium">{log.userEmail}</td>
                  <td className="px-4 py-2.5">
                    <StatusChip status={log.action.includes("UNAUTHORIZED") ? "warning" : "success"}>
                      {log.action}
                    </StatusChip>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-blue-600">{log.keyId || "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{log.algorithm || "QAES-Kyber1024"}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-slate-400">{log.ipAddress || "127.0.0.1"}</td>
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
