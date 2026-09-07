const TONES = {
  slate: "bg-slate-100 text-slate-600",
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  amber: "bg-amber-50 text-amber-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

export default function StatCard({ icon: Icon, label, value, sublabel, tone = "slate" }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60">
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${TONES[tone] ?? TONES.slate}`}>
          <Icon size={15} />
        </div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-slate-800">{value}</p>
      {sublabel && <p className="mt-0.5 text-xs text-slate-400">{sublabel}</p>}
    </div>
  );
}
