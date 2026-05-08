import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Archive,
  BookOpen,
  Cross,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import { MenuIcon, SettingsIcon } from '@polaris/ui/icons';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: '대시보드' },
  { path: '/sermon-lab', icon: BookOpen, label: '설교 연구소' },
  { path: '/studio', icon: Sparkles, label: '콘텐츠 스튜디오' },
  { path: '/archive', icon: Archive, label: '사역 아카이브' },
  { path: '/settings', icon: SettingsIcon, label: '설정' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 hidden h-screen flex-col bg-gradient-to-b from-primary to-primary-dark text-white shadow-xl transition-all duration-300 md:flex',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Cross className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div>
              <span className="block text-sm font-bold">목보메이트</span>
              <span className="text-xs text-white/60">AI 콘텐츠 비서</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 px-2 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'mb-1 flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200',
                isActive ? 'bg-white/20 shadow-lg backdrop-blur-sm' : 'hover:bg-white/10'
              )}
            >
              <item.icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-white' : 'text-white/70')} />
              {!collapsed && (
                <span className={cn('text-sm font-medium', isActive ? 'text-white' : 'text-white/70')}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg p-2 transition-colors hover:bg-white/10"
          aria-label="사이드바 접기"
        >
          <MenuIcon className="h-5 w-5 text-white/70" />
        </Button>
      </div>
    </aside>
  );
}

function MobileTabBar() {
  const location = useLocation();
  const mobileItems = menuItems;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {mobileItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-medium transition-colors',
                isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

interface HeaderProps {
  collapsed: boolean;
}

export function Header({ collapsed }: HeaderProps) {
  const location = useLocation();
  const currentMenu = menuItems.find((item) => location.pathname.startsWith(item.path));

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur transition-all duration-300 md:px-6',
        collapsed ? 'left-0 md:left-16' : 'left-0 md:left-60'
      )}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-primary">목회 AI 콘텐츠 비서</p>
        <h1 className="truncate text-base font-semibold text-gray-900 md:text-lg">
          {currentMenu?.label ?? '목보메이트'}
        </h1>
      </div>
      <div className="hidden items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 md:flex">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">AI Assistant</span>
      </div>
    </header>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <Header collapsed={sidebarCollapsed} />
      <MobileTabBar />
      <main
        className={cn(
          'min-h-screen pb-24 pt-16 transition-all duration-300 md:pb-0',
          sidebarCollapsed ? 'pl-0 md:pl-16' : 'pl-0 md:pl-60'
        )}
      >
        <div className="mx-auto max-w-7xl p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
