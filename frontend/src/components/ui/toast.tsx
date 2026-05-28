import {
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ToastContext, type ToastVariant } from './toastContext';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

const iconMap: Record<ToastVariant, typeof Info> = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
};

const colorMap: Record<ToastVariant, string> = {
  default: 'border-[var(--color-border)] bg-white text-[var(--color-text)]',
  success: 'border-[var(--color-success)]/30 bg-[var(--color-success-light)] text-[var(--color-success)]',
  error: 'border-[var(--color-destructive)]/30 bg-[var(--color-destructive-light)] text-[var(--color-destructive)]',
};

const iconColorMap: Record<ToastVariant, string> = {
  default: 'text-[var(--color-text-muted)]',
  success: 'text-[var(--color-success)]',
  error: 'text-[var(--color-destructive)]',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
    }: {
      title: string;
      description?: string;
      variant?: ToastVariant;
    }) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, title, description, variant }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((item) => {
          const Icon = iconMap[item.variant];
          return (
            <div
              key={item.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 animate-slide-up',
                colorMap[item.variant]
              )}
              style={{ boxShadow: '0 10px 40px -10px rgba(37, 99, 235, 0.08)' }}
              role="alert"
            >
              <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', iconColorMap[item.variant])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm opacity-80">{item.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="shrink-0 rounded-full p-0.5 opacity-60 hover:opacity-100"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
