export const APP_NAME = '목회메이트';
export const APP_DESCRIPTION = '목회자를 위한 사역 지원 서비스';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  MEMBERS: '/members',
  MEMBER_DETAIL: '/members/:id',
  MEMBER_NEW: '/members/new',
  WORSHIP: '/worship',
  WORSHIP_DETAIL: '/worship/:id',
  FINANCE: '/finance',
  DOCUMENTS: '/documents',
  SCHEDULE: '/schedule',
} as const;

export const MEMBER_ROLES = {
  PASTOR: ' pastor',
  ELDER: 'elder',
  DEACON: 'deacon',
  MEMBER: 'member',
  VISITOR: 'visitor',
} as const;

export const WORSHIP_TYPES = {
  SUNDAY: 'sunday',
  WEDNESDAY: 'wednesday',
  SPECIAL: 'special',
  CELL: 'cell',
} as const;

export const FINANCE_CATEGORIES = {
  OFFERING: 'offering',
  TITHE: 'tithe',
  MISSION: 'mission',
  BUILDING: 'building',
  OTHER: 'other',
} as const;

export const PAGE_SIZE = 20;
export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;
export const HEADER_HEIGHT = 64;