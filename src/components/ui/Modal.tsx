import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-layer-overlay" onClick={onClose} />
      <div
        className={cn(
          'relative mx-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg overflow-auto rounded-polaris-md border border-line-neutral bg-layer-surface shadow-polaris-lg',
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-line-neutral px-6 py-4">
            <h2 className="text-polaris-heading4 text-label-normal">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-polaris-sm p-1 text-label-neutral transition-colors hover:bg-interaction-hover"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
