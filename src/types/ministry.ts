export type MinistryCategory = 'worship' | 'care' | 'wedding' | 'education' | 'admin' | 'sermon';
export type MinistryStatus = 'preparing' | 'done' | 'delayed';

export type ScheduleItem = {
  id: string;
  title: string;
  startAt: string;
  endAt?: string;
  category: MinistryCategory;
  members: string[];
  memo: string;
  status: MinistryStatus;
  aiNote: string;
  keywords: string[];
};

export type ScheduleFormState = {
  id?: string;
  title: string;
  startAt: string;
  endAt: string;
  category: MinistryCategory;
  memberTags: string;
  memo: string;
  status: MinistryStatus;
  keywordTags: string;
};

export const CATEGORY_OPTIONS = [
  { value: 'worship', label: '예배' },
  { value: 'care', label: '심방' },
  { value: 'wedding', label: '결혼식' },
  { value: 'education', label: '교육' },
  { value: 'admin', label: '행정' },
  { value: 'sermon', label: '설교 준비' },
] satisfies Array<{ value: MinistryCategory; label: string }>;

export const STATUS_OPTIONS = [
  { value: 'preparing', label: '준비중' },
  { value: 'done', label: '완료' },
  { value: 'delayed', label: '지연' },
] satisfies Array<{ value: MinistryStatus; label: string }>;

export const STATUS_LABEL: Record<MinistryStatus, string> = {
  preparing: '준비중',
  done: '완료',
  delayed: '확인 필요',
};

export const CATEGORY_LABEL: Record<MinistryCategory, string> = {
  worship: '예배',
  care: '심방',
  wedding: '결혼식',
  education: '교육',
  admin: '행정',
  sermon: '설교 준비',
};

export const STATUS_TONE: Record<MinistryStatus, string> = {
  preparing: 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200',
  done: 'bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200',
  delayed: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
};

export const CATEGORY_TONE: Record<MinistryCategory, string> = {
  worship: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  care: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  wedding: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
  education: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  admin: 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-200',
  sermon: 'bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-200',
};

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function formatTimeRange(startAt: string, endAt?: string) {
  const start = new Date(startAt);
  const startText = start.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
  if (!endAt) return startText;
  const end = new Date(endAt);
  const endText = end.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
  return `${startText} - ${endText}`;
}

export function formatCompactTime(startAt: string) {
  return new Date(startAt).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
}

export function differenceInDays(from: Date, to: Date) {
  const oneDay = 1000 * 60 * 60 * 24;
  const fromStart = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const toStart = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.ceil((toStart - fromStart) / oneDay);
}

export function buildMessageScript(schedule: ScheduleItem | undefined) {
  if (!schedule) return '오늘 진행할 주요 일정이 없습니다.';
  return [
    `[${CATEGORY_LABEL[schedule.category]} 공지] ${schedule.title}`,
    `${new Date(schedule.startAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })} ${formatTimeRange(schedule.startAt, schedule.endAt)}`,
    schedule.members && schedule.members.length ? `함께 챙길 분: ${schedule.members.join(', ')}` : '',
    schedule.memo,
  ]
    .filter(Boolean)
    .join('\n');
}
