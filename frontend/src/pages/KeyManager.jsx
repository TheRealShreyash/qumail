import { useState, useEffect } from "react";
import { KeyRound, RefreshCw, Wifi, Copy, Check } from "lucide-react";
import StatCard from "../components/StatCard";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import Timeline from "../components/Timeline";
import { useToast } from "../context/ToastContext";
import { apiRequest } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

function CopyableId({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };
  return (
    <button onClick={copy} className="group inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-indigo-700 hover:text-indigo-800">
      {value}
      {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />}
    </button>
  );
}

export default function KeyManager() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState({ totalKeys: 0, activeKeys: 0, consumedKeys: 0, totalLogs: 0 });
  const [keysList, setKeysList] = useState([]);
  const [logsList, setLogsList] = useState([]);

  const loadKmData = async () => {
    try {
      setRefreshing(true);
      const email = user?.email || "";
      const [statusRes, keysRes, logsRes] = await Promise.all([
        apiRequest(`/api/km/status?email=${encodeURIComponent(email)}`),
        apiRequest(`/api/km/keys?email=${encodeURIComponent(email)}`),
        apiRequest(`/api/km/logs?email=${encodeURIComponent(email)}`),
      ]);

      if (statusRes.data) setStatus(statusRes.data);
      if (keysRes.data) setKeysList(keysRes.data);
      if (logsRes.data) setLogsList(logsRes.data);
    } catch (err) {
      console.error("Failed to load KM data:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadKmData();
  }, [user]);

  const fetchKey = async () => {
    setFetching(true);
    try {
      await apiRequest("/api/km/enc_keys", {
        method: "POST",
        body: JSON.stringify({
          senderEmail: user?.email || "alice.demo@gmail.com",
          recipientEmail: "bob.demo@gmail.com",
          algorithm: "QAES-Kyber1024",
        }),
      });
      showToast("New quantum key allocated and stored in DB!", "success");
      loadKmData();
    } catch (err) {
      showToast(`Key fetch failed: ${err.message}`, "error");
    } finally {
      setFetching(false);
    }
  };

  const timelineItems = logsList.slice(0, 5).map((l) => ({
    id: l.id,
    title: l.action.replace(/_/g, " "),
    time: new Date(l.createdAt).toLocaleTimeString(),
    desc: `User: ${l.userEmail} · Key: ${l.keyId || "N/A"} · IP: ${l.ipAddress || "127.0.0.1"}`,
    status: l.action.includes("UNAUTHORIZED") ? "warning" : "success",
  }));

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-800">Quantum Key Manager</h1>
          <p className="text-sm text-slate-400">ETSI GS QKD 014 REST API · Connected to PostgreSQL</p>
        </div>
        <div className="flex gap-2">
          <SecondaryButton onClick={loadKmData} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
          </SecondaryButton>
          <PrimaryButton onClick={fetchKey} disabled={fetching}>
            <KeyRound size={14} /> {fetching ? "Allocating…" : "Allocate Quantum Key"}
          </PrimaryButton>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-green-200 bg-green-50/50 p-5">
        <div className="flex items-center gap-2">
          <span className="quantum-pulse flex h-2.5 w-2.5 rounded-full bg-green-500" />
          <p className="text-sm font-semibold text-green-700">KM Node Operational</p>
          <span className="font-mono text-xs text-green-500">
            · {(import.meta.env.VITE_BACKEND_URL || "http://localhost:8080").replace(/\/api\/?$/, "").replace(/\/$/, "")}/api/km
          </span>
        </div>
        <p className="mt-1 text-xs text-green-600">Database connected & sync active</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={KeyRound} label="Total Keys" value={status.totalKeys} tone="indigo" />
        <StatCard icon={Wifi} label="Active Keys" value={status.activeKeys} tone="green" />
        <StatCard icon={KeyRound} label="Consumed Keys" value={status.consumedKeys} tone="slate" />
        <StatCard icon={KeyRound} label="Audit Logs" value={status.totalLogs} tone="purple" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">Quantum Key Registry</p>
          <div className="thin-scroll space-y-2 max-h-72 overflow-y-auto pr-1">
            {keysList.length === 0 ? (
              <p className="text-xs text-slate-400">No keys in database yet. Click Allocate Quantum Key to create one.</p>
            ) : (
              keysList.map((k) => (
                <div key={k.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 transition-colors hover:bg-slate-100">
                  <div className="min-w-0">
                    <CopyableId value={k.keyId} />
                    <p className="mt-0.5 truncate text-xs text-slate-500" title={`${k.senderEmail} ➔ ${k.recipientEmail}`}>{k.senderEmail} ➔ {k.recipientEmail}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${k.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
                      {k.status}
                    </span>
                    <p className="mt-0.5 text-[10px] text-slate-400">{k.algorithm}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">Real-Time Security Activity</p>
          {timelineItems.length === 0 ? (
            <p className="text-xs text-slate-400">No security events logged yet.</p>
          ) : (
            <Timeline items={timelineItems} />
          )}
        </div>
      </div>
    </div>
  );
}

