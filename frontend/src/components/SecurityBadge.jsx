import { ShieldCheck, Lock, Cpu, Mail } from "lucide-react";
import { securityLevels } from "../data/securityLevels";

const styles = {
  green: "bg-green-50 text-green-700 border-green-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  gray: "bg-slate-100 text-slate-500 border-slate-200",
};

const icons = {
  OTP: ShieldCheck,
  QAES: Lock,
  PQC: Cpu,
  NONE: Mail,
};

export default function SecurityBadge({ level, size = "sm" }) {
  const meta = securityLevels[level] ?? securityLevels.NONE;
  const Icon = icons[meta.id];
  const pad = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${styles[meta.color]} ${pad}`}
      title={meta.label}
    >
      <Icon size={size === "sm" ? 12 : 14} />
      {meta.short}
    </span>
  );
}
