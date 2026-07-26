'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void | Promise<void>;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, title?: string) => void;
  confirm: (options: ConfirmOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmOptions | null>(null);
  const [confirming, setConfirming] = useState(false);

  const showToast = useCallback((type: ToastType, message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmModal(options);
  }, []);

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    setConfirming(true);
    try {
      await confirmModal.onConfirm();
    } catch (e) {
      console.error('Confirmation action error:', e);
    } finally {
      setConfirming(false);
      setConfirmModal(null);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}

      {/* Toast Notifications Container */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => {
          const bgColors = {
            success: 'bg-emerald-900/90 border-emerald-700/50 text-emerald-100',
            error: 'bg-rose-900/90 border-rose-700/50 text-rose-100',
            warning: 'bg-amber-900/90 border-amber-700/50 text-amber-100',
            info: 'bg-blue-900/90 border-blue-700/50 text-blue-100',
          };

          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
            error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
            info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all animate-in fade-in slide-in-from-top-4 ${bgColors[toast.type]}`}
            >
              {icons[toast.type]}
              <div className="flex-1 min-w-0">
                {toast.title && <h4 className="font-semibold text-sm mb-0.5">{toast.title}</h4>}
                <p className="text-xs leading-relaxed opacity-90">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                confirmModal.variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-[#FF7A00]'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0A1F44]">{confirmModal.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{confirmModal.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                disabled={confirming}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {confirmModal.cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={confirming}
                className={`px-5 py-2 text-sm font-medium text-white rounded-xl transition-all shadow-md ${
                  confirmModal.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                    : 'bg-[#FF7A00] hover:bg-[#e06b00] shadow-orange-500/20'
                }`}
              >
                {confirming ? 'Processing...' : (confirmModal.confirmText || 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
