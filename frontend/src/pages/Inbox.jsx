import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Inbox as InboxIcon, ChevronDown } from "lucide-react";
import EmailCard from "../components/EmailCard";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import { mockEmails, mockSent, mockDrafts } from "../data/mockEmails";

const PAGE_SIZE = 4;

const FOLDERS = {
  inbox: { title: "Inbox", data: mockEmails },
  sent: { title: "Sent", data: mockSent },
  drafts: { title: "Drafts", data: mockDrafts },
  trash: { title: "Trash", data: [] },
};

export default function Inbox({ folder: folderProp }) {
  const params = useParams();
  const folder = folderProp ?? params.folder ?? "inbox";
  const navigate = useNavigate();
  const config = FOLDERS[folder] ?? FOLDERS.inbox;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | unread | starred
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    let items = config.data.filter((e) =>
      (e.subject + e.sender + e.preview).toLowerCase().includes(query.toLowerCase())
    );
    if (filter === "unread") items = items.filter((e) => e.read === false);
    if (filter === "starred") items = items.filter((e) => e.starred);
    if (sort === "oldest") items = [...items].reverse();
    return items;
  }, [config.data, query, filter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-800">{config.title}</h1>
          <p className="text-sm text-slate-400">{filtered.length} messages</p>
        </div>
        <SearchBar value={query} onChange={(v) => { setQuery(v); setPage(1); }} className="w-72" />
      </div>

      <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-6 py-2.5">
        <FilterSelect value={filter} onChange={setFilter} options={[["all", "All"], ["unread", "Unread"], ["starred", "Starred"]]} />
        <FilterSelect value={sort} onChange={setSort} options={[["newest", "Newest first"], ["oldest", "Oldest first"]]} />
      </div>

      <div className="thin-scroll flex-1 overflow-y-auto">
        {loading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : pageItems.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            title={query ? "No messages match your search" : `Nothing in ${config.title.toLowerCase()}`}
            description={query ? "Try a different sender, subject, or keyword." : "New messages will show up here as they arrive."}
          />
        ) : (
          pageItems.map((email) => (
            <EmailCard
              key={email.id}
              email={{ read: true, starred: false, security: "NONE", attachments: [], ...email }}
              onClick={() => folder === "inbox" && navigate(`/mail/${email.id}`)}
            />
          ))
        )}
      </div>

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-3">
          <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <PageButton disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</PageButton>
            <PageButton disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</PageButton>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 pr-8 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function PageButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}
