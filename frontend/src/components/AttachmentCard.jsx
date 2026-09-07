import { FileText, Download } from "lucide-react";

export default function AttachmentCard({ name, size, onDownload }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-colors hover:border-slate-300">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <FileText size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-700">{name}</p>
        <p className="font-mono text-xs text-slate-400">{size}</p>
      </div>
      <button
        onClick={onDownload}
        aria-label={`Download ${name}`}
        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
      >
        <Download size={15} />
      </button>
    </div>
  );
}
