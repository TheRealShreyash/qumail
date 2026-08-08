import { FileText, Download } from "lucide-react";

export default function AttachmentCard({ name, size, onDownload }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <FileText size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-700">{name}</p>
        <p className="text-xs text-slate-400">{size}</p>
      </div>
      <button
        onClick={onDownload}
        aria-label={`Download ${name}`}
        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
      >
        <Download size={15} />
      </button>
    </div>
  );
}
