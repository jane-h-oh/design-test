import { forwardRef, ComponentPropsWithoutRef } from 'react';
import { Checkbox as PolarisCheckbox } from '@polaris/ui';
import { cn } from '@/lib/utils';

export type CheckboxProps = ComponentPropsWithoutRef<typeof PolarisCheckbox>;

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <PolarisCheckbox ref={ref} className={cn(className)} {...props} />
  )
);

Checkbox.displayName = 'Checkbox';
