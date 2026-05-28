import { createContext } from 'react';

export type ToastVariant = 'default' | 'success' | 'error';

export interface ToastContextValue {
  toast: (params: { title: string; description?: string; variant?: ToastVariant }) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
