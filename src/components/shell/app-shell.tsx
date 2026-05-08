'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Archive,
  BookOpenText,
  CalendarDays,
  LogOut,
  Settings,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: '대시보드', icon: CalendarDays },
  { href: '/sermon-lab', label: '설교 연구실', icon: BookOpenText },
  { href: '/studio', label: '콘텐츠 스튜디오', icon: Sparkles },
  { href: '/archive', label: '사역 아카이브', icon: Archive },
  { href: '/settings', label: '설정', icon: Settings },
];

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background-base text-label-normal">
      <aside className="fixed inset-y-0 left-0 z-polaris-sticky hidden w-[264px] flex-col border-r border-line-neutral bg-layer-surface md:flex">
        <Link href="/dashboard" className="border-b border-line-neutral px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-polaris-md bg-accent-brand-normal text-static-white shadow-polaris-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-polaris-heading4 text-label-normal">목회메이트</p>
              <p className="text-polaris-caption1 text-label-assistive">Polaris Design System</p>
            </div>
          </div>
        </Link>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex h-11 items-center gap-3 rounded-polaris-sm px-3 text-polaris-body2 font-medium transition-colors',
                  isActive
                    ? 'bg-accent-brand-bg text-accent-brand-normal'
                    : 'text-label-neutral hover:bg-interaction-hover hover:text-label-normal'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line-neutral p-4">
          <div className="rounded-polaris-md bg-fill-neutral p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-polaris-pill bg-static-white text-label-neutral">
                <UserCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-polaris-body2 font-semibold text-label-normal">김다울 목사</p>
                <p className="truncate text-polaris-caption1 text-label-assistive">main@mokhoemate.ai</p>
              </div>
            </div>
          </div>
          <button className="mt-2 flex h-10 w-full items-center justify-between rounded-polaris-sm px-3 text-polaris-body2 font-medium text-label-neutral transition-colors hover:bg-interaction-hover hover:text-state-error">
            로그아웃
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <main className="min-h-screen pb-24 md:pl-[264px] md:pb-0">
        <div className="mx-auto max-w-[1440px] px-4 py-5 md:px-8 md:py-8">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-polaris-sticky border-t border-line-neutral bg-layer-surface/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-polaris-md backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex min-h-16 flex-col items-center justify-center gap-1 rounded-polaris-sm px-1 py-2 text-[11px] font-semibold transition-colors',
                  isActive ? 'bg-accent-brand-bg text-accent-brand-normal' : 'text-label-assistive'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
