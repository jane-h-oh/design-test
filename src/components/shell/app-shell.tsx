'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Archive, BookOpenText, CalendarDays, LogOut, Settings, Sparkles, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: '대시보드', icon: CalendarDays },
  { href: '/sermon-lab', label: '설교 연구소', icon: BookOpenText },
  { href: '/studio', label: '콘텐츠 스튜디오', icon: Sparkles },
  { href: '/archive', label: '사역 아카이브', icon: Archive },
  { href: '/settings', label: '설정', icon: Settings },
];

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();

  return (
    <div className="h-screen overflow-hidden bg-[var(--color-background)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col border-r border-[var(--color-border)] bg-white px-5 py-6 md:flex">
        <Link href="/dashboard" className="rounded-[24px] border border-[#d9e6ff] bg-[var(--color-primary-soft)] p-5">
          <p className="text-sm font-semibold text-[var(--color-primary)]">목회메이트</p>
          <p className="mt-2 text-[26px] font-semibold leading-8 tracking-tight text-[var(--color-copy)]">AI 콘텐츠 비서</p>
        </Link>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors',
                  isActive ? 'bg-[#0A0B10] text-white' : 'text-slate-500 hover:bg-[var(--color-primary-soft)] hover:text-[#0A0B10]'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[24px] border border-[var(--color-border)] bg-[#f7faff] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A0B10] text-white">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-copy)]">담임목사 프로필</p>
              <p className="text-xs text-slate-500">main@mokhoemate.ai</p>
            </div>
          </div>
          <button className="mt-4 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">
            로그아웃
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <main className="h-screen overflow-hidden pb-24 md:pl-[250px] md:pb-0">
        <div className="h-full p-4 md:p-6">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/80 bg-white/95 px-3 py-2 shadow-[0_-16px_40px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-medium',
                  isActive ? 'bg-slate-950 text-white' : 'text-slate-500'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
