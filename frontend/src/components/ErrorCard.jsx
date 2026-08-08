import { AlertTriangle } from "lucide-react";

export default function ErrorCard({ title = "Something went wrong", description, onRetry }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-700">{title}</p>
        {description && <p className="mt-0.5 text-sm text-red-600">{description}</p>}
        {onRetry && (
          <button onClick={onRetry} className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-800">
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
