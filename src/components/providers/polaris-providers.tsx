'use client';

import type { ReactNode } from 'react';
import {
  Toaster,
  ToastProvider,
  ToastViewport,
  TooltipProvider,
} from '@polaris/ui';

export function PolarisProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <TooltipProvider delayDuration={180}>
      <ToastProvider swipeDirection="right">
        {children}
        <Toaster />
        <ToastViewport position="bottom-right" />
      </ToastProvider>
    </TooltipProvider>
  );
}
