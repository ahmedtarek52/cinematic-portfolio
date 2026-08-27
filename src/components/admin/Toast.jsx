import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-5 py-3 rounded-xl text-sm font-medium shadow-2xl border backdrop-blur-md animate-[slideInRight_0.3s_ease-out] ${
              t.type === "success"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : t.type === "error"
                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                  : "bg-accent/20 text-accent border-accent/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {t.type === "success" && <span>✓</span>}
              {t.type === "error" && <span>✕</span>}
              {t.type === "info" && <span>ℹ</span>}
              <span>{t.message}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
