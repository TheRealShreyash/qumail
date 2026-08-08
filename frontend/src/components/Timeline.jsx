import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

const iconFor = {
  success: { Icon: CheckCircle2, cls: "text-green-500 bg-green-50" },
  warning: { Icon: AlertTriangle, cls: "text-amber-500 bg-amber-50" },
  error: { Icon: XCircle, cls: "text-red-500 bg-red-50" },
  info: { Icon: Info, cls: "text-blue-500 bg-blue-50" },
};

export default function Timeline({ items }) {
  return (
    <ol className="relative border-l border-slate-200 pl-5">
      {items.map((item, idx) => {
        const { Icon, cls } = iconFor[item.status] ?? iconFor.info;
        return (
          <li key={item.id} className={`relative ${idx !== items.length - 1 ? "pb-5" : ""}`}>
            <span className={`absolute -left-[27px] flex h-6 w-6 items-center justify-center rounded-full ${cls}`}>
              <Icon size={13} />
            </span>
            <p className="text-sm font-medium text-slate-700">{item.event}</p>
            <p className="mt-0.5 text-xs text-slate-400">{item.time}</p>
          </li>
        );
      })}
    </ol>
  );
}
