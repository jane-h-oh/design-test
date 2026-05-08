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
  { value: 'wedding', label: '경조사' },
  { value: 'education', label: '교육' },
  { value: 'admin', label: '행정' },
  { value: 'sermon', label: '설교 준비' },
] satisfies Array<{ value: MinistryCategory; label: string }>;

export const STATUS_OPTIONS = [
  { value: 'preparing', label: '준비중' },
  { value: 'done', label: '완료' },
  { value: 'delayed', label: '확인 필요' },
] satisfies Array<{ value: MinistryStatus; label: string }>;

export const STATUS_LABEL: Record<MinistryStatus, string> = {
  preparing: '준비중',
  done: '완료',
  delayed: '확인 필요',
};

export const CATEGORY_LABEL: Record<MinistryCategory, string> = {
  worship: '예배',
  care: '심방',
  wedding: '경조사',
  education: '교육',
  admin: '행정',
  sermon: '설교 준비',
};

export const STATUS_TONE: Record<MinistryStatus, string> = {
  preparing: 'bg-state-info-bg text-state-info',
  done: 'bg-state-success-bg text-state-success',
  delayed: 'bg-state-error-bg text-state-error',
};

export const CATEGORY_TONE: Record<MinistryCategory, string> = {
  worship: 'bg-blue-05 text-blue-70',
  care: 'bg-green-10 text-green-70',
  wedding: 'bg-red-10 text-red-70',
  education: 'bg-yellow-10 text-yellow-70',
  admin: 'bg-gray-10 text-gray-70',
  sermon: 'bg-ai-hover text-ai-normal',
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
    `[${CATEGORY_LABEL[schedule.category]}] ${schedule.title}`,
    `${new Date(schedule.startAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })} ${formatTimeRange(schedule.startAt, schedule.endAt)}`,
    schedule.members.length ? `함께할 사람: ${schedule.members.join(', ')}` : '',
    schedule.memo,
  ]
    .filter(Boolean)
    .join('\n');
}
