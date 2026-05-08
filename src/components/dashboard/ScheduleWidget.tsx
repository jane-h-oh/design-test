'use client';

import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Hash, Plus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CATEGORY_LABEL,
  CATEGORY_TONE,
  ScheduleItem,
  STATUS_LABEL,
  STATUS_TONE,
  WEEKDAYS,
  formatTimeRange,
} from '@/types/ministry';

interface ScheduleWidgetProps {
  schedules: ScheduleItem[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onAddEvent: (date?: Date) => void;
  onEditEvent: (schedule: ScheduleItem) => void;
}

const CATEGORY_BAR: Record<string, string> = {
  worship: 'bg-blue-50',
  care: 'bg-green-50',
  wedding: 'bg-red-50',
  education: 'bg-yellow-50',
  admin: 'bg-gray-50',
  sermon: 'bg-ai-normal',
};

function toISODate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function ScheduleWidget({
  schedules,
  selectedDate,
  onDateChange,
  onAddEvent,
  onEditEvent,
}: ScheduleWidgetProps) {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  const todayISO = toISODate(new Date());
  const selectedISO = toISODate(selectedDate);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const monthCells: Array<Date | null> = [];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i += 1) monthCells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) monthCells.push(new Date(year, month, day));
  while (monthCells.length % 7 !== 0) monthCells.push(null);

  const weekStart = new Date(selectedDate);
  weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
  const weekCells = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });

  const cells = viewMode === 'monthly' ? monthCells : weekCells;
  const displayText =
    viewMode === 'monthly'
      ? `${year}년 ${month + 1}월`
      : `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 주간`;
  const daySchedules = schedules
    .filter((schedule) => schedule.startAt.slice(0, 10) === selectedISO)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));

  const movePeriod = (direction: -1 | 1) => {
    if (viewMode === 'monthly') {
      onDateChange(new Date(year, month + direction, 1));
      return;
    }
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + direction * 7);
    onDateChange(date);
  };

  return (
    <section className="flex h-full flex-col gap-5 rounded-polaris-lg border border-line-neutral bg-layer-surface p-5 shadow-polaris-sm">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-polaris-md bg-accent-brand-bg text-accent-brand-normal">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-polaris-heading4 text-label-normal">사역 일정</p>
            <p className="text-polaris-caption1 text-label-assistive">예배와 돌봄 흐름을 한눈에 확인</p>
          </div>
        </div>

        <div className="flex rounded-polaris-sm bg-fill-normal p-1">
          {(['weekly', 'monthly'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                'h-8 rounded-polaris-xs px-3 text-polaris-caption1 font-bold transition-colors',
                viewMode === mode
                  ? 'bg-layer-surface text-accent-brand-normal shadow-polaris-xs'
                  : 'text-label-alternative hover:text-label-normal'
              )}
            >
              {mode === 'weekly' ? 'Week' : 'Month'}
            </button>
          ))}
        </div>
      </header>

      <div className="flex items-center justify-between">
        <p className="text-polaris-body2 font-bold text-label-normal">{displayText}</p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDateChange(new Date())}
            className="h-8 rounded-polaris-xs bg-accent-brand-bg px-3 text-polaris-caption1 font-bold text-accent-brand-normal"
          >
            오늘
          </button>
          <button
            onClick={() => movePeriod(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-polaris-xs text-label-alternative hover:bg-interaction-hover"
            aria-label="이전 기간"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => movePeriod(1)}
            className="flex h-8 w-8 items-center justify-center rounded-polaris-xs text-label-alternative hover:bg-interaction-hover"
            aria-label="다음 기간"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        <div className="mb-2 grid grid-cols-7 text-center">
          {WEEKDAYS.map((weekday) => (
            <span key={weekday} className="text-polaris-caption2 font-bold text-label-assistive">
              {weekday}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {cells.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} />;
            const iso = toISODate(date);
            const isToday = iso === todayISO;
            const isSelected = iso === selectedISO;
            const hasEvents = schedules.some((schedule) => schedule.startAt.slice(0, 10) === iso);

            return (
              <button
                key={iso}
                onClick={() => onDateChange(date)}
                className={cn(
                  'relative mx-auto flex h-9 w-9 items-center justify-center rounded-polaris-pill text-polaris-body3 font-semibold transition-colors',
                  isSelected
                    ? 'bg-accent-brand-normal text-static-white shadow-polaris-sm'
                    : isToday
                      ? 'bg-accent-brand-bg text-accent-brand-normal'
                      : 'text-label-neutral hover:bg-interaction-hover'
                )}
              >
                {date.getDate()}
                {hasEvents && !isSelected && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-polaris-pill bg-accent-brand-normal" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="scrollbar-hide flex max-h-[500px] flex-col gap-3 overflow-y-auto pr-1">
        {daySchedules.length > 0 ? (
          daySchedules.map((schedule) => (
            <button
              key={schedule.id}
              onClick={() => onEditEvent(schedule)}
              className="group flex overflow-hidden rounded-polaris-md border border-line-neutral bg-background-alternative text-left transition-colors hover:border-line-strong hover:bg-layer-surface hover:shadow-polaris-sm"
            >
              <span className={cn('w-1.5 shrink-0', CATEGORY_BAR[schedule.category])} />
              <span className="flex-1 p-4">
                <span className="mb-2 flex items-start justify-between gap-3">
                  <span>
                    <span
                      className={cn(
                        'inline-flex rounded-polaris-xs px-2 py-0.5 text-polaris-caption1 font-bold',
                        CATEGORY_TONE[schedule.category]
                      )}
                    >
                      {CATEGORY_LABEL[schedule.category]}
                    </span>
                    <span className="mt-2 block text-polaris-body2 font-bold text-label-normal">
                      {schedule.title}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 rounded-polaris-xs px-2 py-0.5 text-polaris-caption1 font-bold',
                      STATUS_TONE[schedule.status]
                    )}
                  >
                    {STATUS_LABEL[schedule.status]}
                  </span>
                </span>

                <span className="block text-polaris-caption1 font-medium text-label-alternative">
                  {formatTimeRange(schedule.startAt, schedule.endAt)}
                </span>
                {schedule.memo && (
                  <span className="mt-2 block text-polaris-body3 leading-relaxed text-label-neutral">
                    {schedule.memo}
                  </span>
                )}

                <span className="mt-3 flex flex-wrap gap-1.5">
                  {schedule.members.map((member) => (
                    <span
                      key={member}
                      className="inline-flex items-center gap-1 rounded-polaris-xs bg-layer-surface px-2 py-0.5 text-polaris-caption1 font-bold text-label-alternative"
                    >
                      <Users className="h-3 w-3" />
                      {member}
                    </span>
                  ))}
                  {schedule.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 rounded-polaris-xs bg-accent-brand-bg px-2 py-0.5 text-polaris-caption1 font-bold text-accent-brand-normal"
                    >
                      <Hash className="h-3 w-3" />
                      {keyword}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          ))
        ) : (
          <div className="rounded-polaris-md border border-dashed border-line-normal bg-background-alternative px-4 py-10 text-center">
            <p className="text-polaris-body3 font-semibold text-label-neutral">등록된 일정이 없습니다.</p>
            <p className="mt-1 text-polaris-caption1 text-label-assistive">오늘의 사역 흐름을 추가해보세요.</p>
          </div>
        )}
      </div>

      <button
        onClick={() => onAddEvent(selectedDate)}
        className="mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-polaris-sm bg-accent-action-normal text-polaris-body2 font-bold text-static-white transition-colors hover:bg-accent-action-strong"
      >
        <Plus className="h-4 w-4" />
        일정 추가
      </button>
    </section>
  );
}
