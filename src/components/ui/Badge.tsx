import { HTMLAttributes, forwardRef } from 'react';
import { Badge as PolarisBadge } from '@polaris/ui';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const polarisVariant = {
      default: 'neutral',
      success: 'success',
      warning: 'warning',
      error: 'danger',
      outline: 'neutral',
    }[variant] as 'neutral' | 'success' | 'warning' | 'danger';

    return (
      <PolarisBadge
        ref={ref}
        variant={polarisVariant}
        tone={variant === 'outline' ? 'solid' : 'subtle'}
        className={cn(variant === 'outline' && 'border border-line-neutral bg-transparent', className)}
        {...props}
      >
        {children}
      </PolarisBadge>
    );
  }
);

Badge.displayName = 'Badge';
