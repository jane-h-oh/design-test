'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Users, Hash, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScheduleItem, WEEKDAYS, STATUS_LABEL, CATEGORY_LABEL } from '@/types/ministry';

interface ScheduleWidgetProps {
  schedules: ScheduleItem[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onAddEvent: (date?: Date) => void;
  onEditEvent: (schedule: ScheduleItem) => void;
}

// Category Specific Colors
const CATEGORY_STYLE: Record<string, { bar: string; bg: string; text: string; tag: string }> = {
  worship:   { bar: 'var(--polaris-blue-50)', bg: 'var(--polaris-state-info-bg)', text: 'var(--polaris-state-info)', tag: 'var(--polaris-blue-5)' }, // Blue
  care:      { bar: 'var(--polaris-green-50)', bg: 'var(--polaris-state-success-bg)', text: 'var(--polaris-state-success)', tag: 'var(--polaris-green-5)' }, // Green
  wedding:   { bar: 'var(--polaris-red-50)', bg: 'var(--polaris-state-error-bg)', text: 'var(--polaris-state-error)', tag: 'var(--polaris-red-5)' }, // Red
  education: { bar: 'var(--polaris-orange-50)', bg: 'var(--polaris-state-warning-bg)', text: 'var(--polaris-state-warning)', tag: 'var(--polaris-orange-5)' }, // Orange
  admin:     { bar: 'var(--polaris-neutral-500)', bg: 'var(--polaris-neutral-50)', text: 'var(--polaris-neutral-600)', tag: 'var(--polaris-neutral-200)' }, // Neutral
  sermon:    { bar: 'var(--polaris-orange-60)', bg: 'var(--polaris-orange-5)', text: 'var(--polaris-orange-60)', tag: 'var(--polaris-orange-10)' }, // Red Orange
};

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h >= 12 ? '오후' : '오전'} ${h % 12 || 12}:${m}`;
}

export function ScheduleWidget({ schedules, selectedDate, onDateChange, onAddEvent, onEditEvent }: ScheduleWidgetProps) {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  const toISODate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  };

  const todayISO    = toISODate(new Date());
  const selectedISO = toISODate(selectedDate);
  const Y = selectedDate.getFullYear();
  const M = selectedDate.getMonth();

  const prevPeriod = () => {
    if (viewMode === 'monthly') { onDateChange(new Date(Y, M-1, 1)); }
    else { const d=new Date(selectedDate); d.setDate(d.getDate()-7); onDateChange(d); }
  };
  const nextPeriod = () => {
    if (viewMode === 'monthly') { onDateChange(new Date(Y, M+1, 1)); }
    else { const d=new Date(selectedDate); d.setDate(d.getDate()+7); onDateChange(d); }
  };

  const monthCells: Array<Date|null> = [];
  const firstDay = new Date(Y, M, 1).getDay();
  const daysInMonth = new Date(Y, M+1, 0).getDate();
  for (let i=0; i<firstDay; i++) monthCells.push(null);
  for (let d=1; d<=daysInMonth; d++) monthCells.push(new Date(Y, M, d));
  while (monthCells.length%7 !== 0) monthCells.push(null);

  const weekStart = new Date(selectedDate);
  weekStart.setDate(selectedDate.getDate()-selectedDate.getDay());
  const weekCells = Array.from({length:7}, (_,i)=>{ const d=new Date(weekStart); d.setDate(weekStart.getDate()+i); return d; });

  const cells = viewMode==='monthly' ? monthCells : weekCells;
  const displayStr = viewMode==='monthly' ? `${Y}년 ${M+1}월` : `${selectedDate.getMonth()+1}월 ${selectedDate.getDate()}일 주간`;
  const daySchedules = schedules.filter(s=>s.startAt.slice(0,10)===selectedISO).sort((a,b)=>a.startAt.localeCompare(b.startAt));

  return (
    <div className="bg-slate-50 rounded-2xl shadow-sm flex flex-col gap-5 p-6 h-full border border-slate-200">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
            <Calendar className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">스케줄</h3>
        </div>
        <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-0.5">
          {(['weekly','monthly'] as const).map(mode => (
            <button
              key={mode}
              onClick={()=>setViewMode(mode)}
              className={cn('px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all',
                viewMode===mode ? 'bg-nova-secondary text-white shadow-sm' : 'text-slate-500 hover:text-slate-700')}
            >{mode==='weekly'?'Week':'Month'}</button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-800">{displayStr}</span>
        <div className="flex items-center gap-1">
          <button onClick={()=>onDateChange(new Date())}
            className="px-2.5 py-1 text-[10px] font-bold text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors mr-1">
            오늘
          </button>
          <button onClick={prevPeriod} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={nextPeriod} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div>
        <div className="grid grid-cols-7 text-center mb-2">
          {WEEKDAYS.map(w=><span key={w} className="text-[9px] font-bold text-slate-300">{w}</span>)}
        </div>
        <div className="grid grid-cols-7 text-center gap-y-1">
          {cells.map((date,idx)=>{
            if(!date) return <div key={`e-${idx}`}/>;
            const iso=toISODate(date);
            const isToday=iso===todayISO;
            const isSelected=iso===selectedISO;
            const hasEvents=schedules.some(s=>s.startAt.slice(0,10)===iso);
            return (
              <button key={iso} onClick={()=>onDateChange(date)}
                className={cn('relative flex flex-col items-center justify-center w-8 h-8 mx-auto rounded-full text-[12px] font-semibold transition-all',
                  isSelected ? 'bg-nova-secondary text-white shadow-md' :
                  isToday ? 'font-bold ring-2 ring-offset-1 text-primary-600 border-primary-100' :
                  'text-slate-600 hover:bg-slate-100')}
              >
                {date.getDate()}
                {hasEvents && !isSelected && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-primary-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Events List */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-1 scrollbar-hide">
        {daySchedules.length > 0 ? daySchedules.map(schedule => {
          const style = CATEGORY_STYLE[schedule.category] ?? CATEGORY_STYLE.admin;
          return (
            <div
              key={schedule.id}
              onClick={() => onEditEvent(schedule)}
              className="flex items-stretch rounded-xl overflow-hidden transition-all cursor-pointer group border border-slate-100 hover:border-slate-200 hover:shadow-md"
              style={{ backgroundColor: style.bg }}
            >
              <div className="w-1.5 shrink-0" style={{ backgroundColor: style.bar }} />
              <div className="py-4 px-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1 block" style={{ color: style.bar }}>
                      {CATEGORY_LABEL[schedule.category]}
                    </span>
                    <p className="text-sm font-extrabold text-slate-800 leading-snug group-hover:text-primary-700 transition-colors">
                      {schedule.title}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/50 px-2 py-0.5 rounded-md">
                    {STATUS_LABEL[schedule.status]}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 font-medium mb-3">
                  {formatTime(schedule.startAt)}
                </p>

                {/* Memo snippet */}
                {schedule.memo && (
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-3 line-clamp-2">
                    {schedule.memo}
                  </p>
                )}

                {/* Tags Section: Members & Keywords */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {schedule.members && schedule.members.length > 0 && (
                    <div className="flex items-center gap-1 bg-white/60 px-2 py-0.5 rounded-md text-[9px] font-bold text-slate-500">
                      <Users className="h-2.5 w-2.5" />
                      {schedule.members.join(', ')}
                    </div>
                  )}
                  {schedule.keywords && schedule.keywords.map(kw => (
                    <div key={kw} className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md text-[9px] font-bold text-primary-600">
                      <Hash className="h-2.5 w-2.5 opacity-50" />
                      {kw}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
              <ChevronRight className="h-5 w-5 text-slate-200" />
            </div>
            <p className="text-xs text-slate-400 font-medium text-center leading-relaxed">
              등록된 일정이 없습니다.<br/>
              평안한 하루를 설계해보세요.
            </p>
          </div>
        )}
      </div>

      {/* Add Event CTA - Simple Gray Style as requested before */}
      <button onClick={()=>onAddEvent(selectedDate)}
        className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all mt-auto"
      >
        <Plus className="h-4 w-4" />
        일정 추가
      </button>

    </div>
  );
}
