import { NavLink } from "react-router-dom";
import { Inbox, Send, FileEdit, Trash2, PenSquare, KeyRound, ScrollText, Settings } from "lucide-react";

const mailLinks = [
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/sent", label: "Sent", icon: Send },
  { to: "/drafts", label: "Drafts", icon: FileEdit },
  { to: "/trash", label: "Trash", icon: Trash2 },
];

const securityLinks = [
  { to: "/keys", label: "Quantum Keys", icon: KeyRound },
  { to: "/logs", label: "Security Logs", icon: ScrollText },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavItem({ to, label, icon: Icon, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
        }`
      }
    >
      <span className="flex items-center gap-2.5">
        <Icon size={16} />
        {label}
      </span>
      {badge && (
        <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col gap-6 border-r border-slate-200 bg-white px-3 py-4">
      <NavLink
        to="/compose"
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
      >
        <PenSquare size={16} /> Compose
      </NavLink>

      <nav className="flex flex-col gap-1">
        {mailLinks.map((l) => (
          <NavItem key={l.to} {...l} />
        ))}
      </nav>

      <div>
        <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Security</p>
        <nav className="mt-2 flex flex-col gap-1">
          {securityLinks.map((l) => (
            <NavItem key={l.to} {...l} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
