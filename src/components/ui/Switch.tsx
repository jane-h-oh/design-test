import { forwardRef, ComponentPropsWithoutRef } from 'react';
import { Switch as PolarisSwitch } from '@polaris/ui';
import { cn } from '@/lib/utils';

export type SwitchProps = ComponentPropsWithoutRef<typeof PolarisSwitch>;

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <PolarisSwitch ref={ref} className={cn(className)} {...props} />
  )
);

Switch.displayName = 'Switch';
