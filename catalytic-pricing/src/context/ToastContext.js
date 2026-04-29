'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error', 4000), [addToast]);
  const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: {
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
    text: 'text-emerald-300',
    bar: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    text: 'text-red-300',
    bar: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
    text: 'text-amber-300',
    bar: 'bg-amber-500',
  },
  info: {
    bg: 'bg-blue-500/15',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    text: 'text-blue-300',
    bar: 'bg-blue-500',
  },
};

function ToastItem({ toast, onClose }) {
  const Icon = iconMap[toast.type];
  const colors = colorMap[toast.type];

  return (
    <div
      className={`pointer-events-auto ${colors.bg} ${colors.border} border backdrop-blur-xl rounded-xl p-4 shadow-2xl shadow-black/30 flex items-start gap-3 animate-slide-in`}
    >
      <Icon className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
      <p className={`text-sm font-medium ${colors.text} flex-1`}>{toast.message}</p>
      <button
        onClick={onClose}
        className="text-slate-500 hover:text-white transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
