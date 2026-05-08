import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Button as PolarisButton } from '@polaris/ui';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const polarisVariant = {
      primary: 'primary',
      secondary: 'secondary',
      outline: 'outline',
      ghost: 'ghost',
      danger: 'danger',
    }[variant] as 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

    return (
      <PolarisButton
        ref={ref}
        variant={polarisVariant}
        size={size}
        className={cn('gap-2', className)}
        {...props}
      >
        {children}
      </PolarisButton>
    );
  }
);

Button.displayName = 'Button';
