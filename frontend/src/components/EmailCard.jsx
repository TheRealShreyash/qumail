import { Star, Paperclip } from "lucide-react";
import SecurityBadge from "./SecurityBadge";

export default function EmailCard({ email, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors
        ${active ? "bg-blue-50" : "hover:bg-slate-50"}`}
    >
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
        {email.sender.split(" ").map((w) => w[0]).slice(0, 2).join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={`truncate text-sm ${email.read ? "font-normal text-slate-600" : "font-semibold text-slate-800"}`}>
            {email.sender}
          </p>
          <span className="shrink-0 text-xs text-slate-400">{email.time}</span>
        </div>
        <p className={`mt-0.5 truncate text-sm ${email.read ? "text-slate-500" : "font-medium text-slate-700"}`}>
          {email.subject}
        </p>
        <p className="mt-0.5 truncate text-xs text-slate-400">{email.preview}</p>
        <div className="mt-2 flex items-center gap-2">
          <SecurityBadge level={email.security} />
          {email.attachments?.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Paperclip size={12} /> {email.attachments.length}
            </span>
          )}
          {!email.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
        </div>
      </div>
      {email.starred && <Star size={14} className="mt-1 shrink-0 fill-amber-400 text-amber-400" />}
    </button>
  );
}
