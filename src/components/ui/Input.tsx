import { forwardRef, InputHTMLAttributes } from 'react';
import { Input as PolarisInput } from '@polaris/ui';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <PolarisInput
        ref={ref}
        className={cn(className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
