import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ size = 18, className = "", label }) {
  return (
    <span className={`inline-flex items-center gap-2 text-slate-500 ${className}`}>
      <Loader2 size={size} className="animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </span>
  );
}
