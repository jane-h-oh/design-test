import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Button as PolarisButton } from '@polaris/ui';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'tertiary' | 'ghost' | 'dark' | 'ai' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const polarisVariant = {
      primary: 'primary',
      secondary: 'secondary',
      outline: 'outline',
      tertiary: 'tertiary',
      ghost: 'ghost',
      dark: 'dark',
      ai: 'ai',
      danger: 'danger',
    }[variant] as 'primary' | 'secondary' | 'outline' | 'tertiary' | 'ghost' | 'dark' | 'ai' | 'danger';

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
