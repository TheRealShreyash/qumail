import { Star, Paperclip } from "lucide-react";
import SecurityBadge from "./SecurityBadge";

// Deterministic gradient per sender so avatars stay visually distinct without any backend data.
const AVATAR_GRADIENTS = [
  "from-indigo-400 to-violet-500",
  "from-sky-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-purple-400 to-fuchsia-500",
];

function gradientFor(name) {
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

export default function EmailCard({ email, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors
        ${active ? "bg-indigo-50" : "hover:bg-slate-50"}`}
    >
      <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-xs font-semibold text-white ${gradientFor(email.sender)}`}>
        {email.sender.split(" ").map((w) => w[0]).slice(0, 2).join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={`truncate text-sm ${email.read ? "font-normal text-slate-600" : "font-semibold text-slate-800"}`}>
            {email.sender}
          </p>
          <span className="shrink-0 font-mono text-xs text-slate-400">{email.time}</span>
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
          {!email.read && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
        </div>
      </div>
      {email.starred && <Star size={14} className="mt-1 shrink-0 fill-amber-400 text-amber-400" />}
    </button>
  );
}
