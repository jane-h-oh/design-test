import { forwardRef, TextareaHTMLAttributes } from 'react';
import { Textarea as PolarisTextarea } from '@polaris/ui';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <PolarisTextarea
        ref={ref}
        className={cn(className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
