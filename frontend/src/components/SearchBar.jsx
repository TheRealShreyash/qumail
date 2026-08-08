import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search mail", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm
          text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none
          focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}
