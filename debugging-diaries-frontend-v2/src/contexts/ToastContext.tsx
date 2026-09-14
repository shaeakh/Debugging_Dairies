import type { ToastVariant } from '@/types/components/toastTypes';
import { createContext } from 'react';

export interface ToastContextType {
  showToast: (
    variant: ToastVariant,
    title: string,
    details?: string,
    duration?: number
  ) => void;
  showSuccess: (title: string, details?: string) => void;
  showWarning: (title: string, details?: string) => void;
  showError: (title: string, details?: string) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);
