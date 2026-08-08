import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const styles = {
  success: "border-green-200 bg-white text-green-700",
  error: "border-red-200 bg-white text-red-600",
  info: "border-blue-200 bg-white text-blue-700",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg ${styles[t.type]} animate-[fadeIn_0.15s_ease-out]`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="ml-2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
