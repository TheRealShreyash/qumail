import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Inbox as InboxIcon, ChevronDown, RefreshCw } from "lucide-react";
import EmailCard from "../components/EmailCard";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { apiRequest } from "../lib/api";

const PAGE_SIZE = 10;

const FOLDER_TITLES = {
  inbox: "Inbox",
  sent: "Sent",
  drafts: "Drafts",
  trash: "Trash",
};

export default function Inbox({ folder: folderProp }) {
  const params = useParams();
  const folder = folderProp ?? params.folder ?? "inbox";
  const navigate = useNavigate();
  const { user } = useAuth();

  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const loadEmails = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      setError(null);
      const res = await apiRequest(
        `/api/email/inbox?email=${encodeURIComponent(user.email)}&folder=${folder}&limit=50`
      );
      setEmails(res.data || []);
    } catch (err) {
      console.error("Failed to load emails:", err);
      setError(err.message);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEmails([]);
    setPage(1);
    loadEmails();
  }, [folder, user?.email]);

  const filtered = useMemo(() => {
    let items = emails.filter((e) =>
      (e.subject + " " + e.sender + " " + e.preview).toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "oldest") items = [...items].reverse();
    return items;
  }, [emails, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const title = FOLDER_TITLES[folder] || "Inbox";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-800">{title}</h1>
          <p className="text-sm text-slate-400">
            {loading ? "Loading…" : `${filtered.length} messages`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar value={query} onChange={(v) => { setQuery(v); setPage(1); }} className="w-72" />
          <button
            onClick={loadEmails}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-6 py-2.5">
        <FilterSelect
          value={sort}
          onChange={setSort}
          options={[["newest", "Newest first"], ["oldest", "Oldest first"]]}
        />
      </div>

      <div className="thin-scroll flex-1 overflow-y-auto">
        {loading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-sm font-medium text-red-500">Failed to load emails</p>
            <p className="mt-1 text-xs text-slate-400">{error}</p>
            <button
              onClick={loadEmails}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : pageItems.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            title={query ? "No messages match your search" : `Nothing in ${title.toLowerCase()}`}
            description={query ? "Try a different sender or keyword." : "New messages will show up here."}
          />
        ) : (
          pageItems.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              onClick={() => navigate(`/mail/${email.id}`)}
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
    <div className="flex items-start gap-3 px-4 py-3 border-b border-slate-100">
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}
