'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Archive, BookOpenText, CalendarDays, LogOut, Settings, Sparkles, UserCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col bg-white px-5 py-6 md:flex shadow-polaris-sm">
        <Link href="/dashboard" className="flex items-center gap-3 px-1 py-2 hover:opacity-80 transition-opacity">
          {/* Logo Icon — 십자가 × AI 대화 심볼 */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="url(#logoGradient)"/>
            {/* Cross */}
            <rect x="17" y="9" width="4" height="14" rx="2" fill="var(--polaris-static-white)"/>
            <rect x="11" y="15" width="16" height="4" rx="2" fill="var(--polaris-static-white)"/>
            {/* Chat bubble with minus — bottom right */}
            <rect x="20" y="24" width="12" height="9" rx="3" fill="var(--polaris-static-white)" fillOpacity="0.9"/>
            <rect x="23" y="28" width="6" height="1.8" rx="0.9" fill="var(--polaris-purple-50)"/>
            {/* Bubble tail */}
            <path d="M22 33 L20 36 L25 33Z" fill="var(--polaris-static-white)" fillOpacity="0.9"/>
            <defs>
              <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--polaris-violet-40)"/>
                <stop offset="1" stopColor="var(--polaris-purple-50)"/>
              </linearGradient>
            </defs>
          </svg>
          <div>
            <p className="text-base font-extrabold text-slate-900 leading-tight tracking-tight">목회메이트</p>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">Mokhoe Mate</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-gradient-to-r from-violet-500/10 to-blue-500/10 text-violet-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">김다울 목사</p>
              <p className="text-xs text-slate-500">main@mokhoemate.ai</p>
            </div>
          </div>
          <button className="mt-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors">
            로그아웃
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <main className="min-h-screen pb-24 md:pl-[250px] md:pb-0">
        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 bg-white/95 px-3 py-2 shadow-polaris-sm backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition-colors',
                  isActive ? 'text-primary-600' : 'text-slate-500'
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
