// src/hooks/use-toast.ts
import { toast as sonnerToast } from 'sonner';

type ToastType = 'default' | 'destructive' | 'success';

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastType;
}

export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastProps) => {
    switch (variant) {
      case 'destructive':
        return sonnerToast.error(title, {
          description
        });
      case 'success':
        return sonnerToast.success(title, {
          description
        });
      default:
        return sonnerToast(title, {
          description
        });
    }
  };

  return { toast };
}