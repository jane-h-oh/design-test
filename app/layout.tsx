import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { PolarisProviders } from '@/components/providers/polaris-providers';
import './globals.css';

export const metadata: Metadata = {
  title: '목회메이트',
  description: '목회자를 위한 MCP 기반 AI 콘텐츠 비서',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko" data-theme="light">
      <body>
        <PolarisProviders>{children}</PolarisProviders>
      </body>
    </html>
  );
}
