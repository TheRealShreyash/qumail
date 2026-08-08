import { useState } from "react";
import { KeyRound, RefreshCw, Download, Wifi } from "lucide-react";
import { keyManagerStatus, keyManagerLogs, keyHistory } from "../data/mockKeys";
import StatCard from "../components/StatCard";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import Timeline from "../components/Timeline";
import { useToast } from "../context/ToastContext";

export default function KeyManager() {
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [fetching, setFetching] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); showToast("Key Manager status refreshed", "info"); }, 800);
  };
  const fetchKey = () => {
    setFetching(true);
    setTimeout(() => { setFetching(false); showToast("New quantum key block fetched", "success"); }, 900);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-800">Quantum Key Manager</h1>
          <p className="text-sm text-slate-400">{keyManagerStatus.protocol} · REST key delivery API</p>
        </div>
        <div className="flex gap-2">
          <SecondaryButton onClick={refresh} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
          </SecondaryButton>
          <PrimaryButton onClick={fetchKey} disabled={fetching}>
            <KeyRound size={14} /> {fetching ? "Fetching…" : "Fetch Key"}
          </PrimaryButton>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-green-200 bg-green-50/50 p-5">
        <div className="flex items-center gap-2">
          <span className="quantum-pulse flex h-2.5 w-2.5 rounded-full bg-green-500" />
          <p className="text-sm font-semibold text-green-700">Connected</p>
          <span className="text-xs text-green-500">· {keyManagerStatus.kmEndpoint}</span>
        </div>
        <p className="mt-1 text-xs text-green-600">Last refreshed {keyManagerStatus.lastRefreshed}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={KeyRound} label="Current Key ID" value={<span className="font-mono text-sm">{keyManagerStatus.currentKeyId.slice(0, 9)}…</span>} tone="green" />
        <StatCard icon={Wifi} label="Key length" value={`${keyManagerStatus.keyLengthBits}-bit`} tone="blue" />
        <StatCard icon={KeyRound} label="Remaining today" value={keyManagerStatus.remainingKeys} tone="slate" />
        <StatCard icon={KeyRound} label="Issued today" value={keyManagerStatus.totalKeysToday} tone="slate" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">Key consumption history</p>
          <div className="space-y-2">
            {keyHistory.map((k) => (
              <div key={k.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <div>
                  <p className="font-mono text-xs text-slate-600">{k.id}</p>
                  <p className="text-xs text-slate-400">{k.consumedBy}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{k.bits}-bit</p>
                  <p className="text-xs text-slate-400">{k.issued}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => showToast("Exporting key log as CSV", "info")} className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline">
            <Download size={13} /> Export key log
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">Connection logs</p>
          <Timeline items={keyManagerLogs} />
        </div>
      </div>
    </div>
  );
}
