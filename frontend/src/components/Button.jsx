export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5
        text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700
        hover:shadow-md hover:shadow-indigo-600/25 active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200
        bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all
        hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-red-200
        bg-white px-4 py-2.5 text-sm font-medium text-red-600 shadow-sm transition-all
        hover:bg-red-50 active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
