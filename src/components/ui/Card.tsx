import { HTMLAttributes, forwardRef } from 'react';
import {
  Card as PolarisCard,
  CardHeader as PolarisCardHeader,
  CardTitle as PolarisCardTitle,
} from '@polaris/ui';
import { cn } from '@/lib/utils';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <PolarisCard
        ref={ref}
        variant="padded"
        className={cn('shadow-polaris-sm', className)}
        {...props}
      >
        {children}
      </PolarisCard>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <PolarisCardHeader
        ref={ref}
        className={cn('mb-4', className)}
        {...props}
      >
        {children}
      </PolarisCardHeader>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <PolarisCardTitle
        ref={ref}
        className={cn('text-polaris-heading4 text-label-normal', className)}
        {...props}
      >
        {children}
      </PolarisCardTitle>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';
