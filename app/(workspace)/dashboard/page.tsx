import { ArrowRight, CalendarRange, ImageIcon, PenSquare, Sparkles } from 'lucide-react';
import { getDashboardCalendar, getSeasonalBriefing } from '@/mcp/view-models/dashboard';

const tagToneClassName = {
  worship: 'bg-[#eaf2ff] text-[#174ea6]',
  sermon: 'bg-[#eef1ff] text-[#3b5bdb]',
  care: 'bg-[#eefbf6] text-[#16794f]',
  draft: 'bg-[#fff4e8] text-[#b45309]',
  rehearsal: 'bg-[#f2f4f7] text-[#344054]',
} as const;

export default function DashboardPage() {
  const calendar = getDashboardCalendar();
  const briefing = getSeasonalBriefing();

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <section className="rounded-[28px] border border-[var(--color-border)] bg-white px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex h-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0A0B10] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b7a90]">Dashboard</p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-[28px] font-semibold tracking-tight text-[#0A0B10]">사역 흐름을 한눈에 보는 목회메이트</h1>
                <span className="inline-flex max-w-full items-center rounded-full border border-[#d6e6ff] bg-[#edf4ff] px-3 py-1 text-xs font-semibold text-[#0A0B10]">
                  오늘의 브리핑: 묵상과 회복의 리듬을 깊게 가져가면 반응이 좋습니다.
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#d9e6ff] bg-[#f8fbff] px-4 py-2 text-sm text-[#52627a]">
            <CalendarRange className="h-4 w-4 text-[#0A0B10]" />
            2026년 4월 사역 캘린더
          </div>
        </div>
      </section>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(330px,0.75fr)]">
        <section className="flex min-h-0 flex-col rounded-[28px] border border-[var(--color-border)] bg-white px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0A0B10]">사역 캘린더</p>
              <p className="text-sm text-[#60708a]">
                {calendar.year}년 {calendar.monthLabel}
              </p>
            </div>
            <div className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-[#60708a]">
              예배 · 설교 · 케어 · 원고 · 리허설
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8799]">
            {calendar.weekdays.map((weekday) => (
              <div key={weekday} className="py-1">
                {weekday}
              </div>
            ))}
          </div>

          <div className="mt-2 grid min-h-0 flex-1 grid-cols-7 gap-2">
            {calendar.days.map((day, index) => (
              <div
                key={`${day?.date ?? 'empty'}-${index}`}
                className={`min-h-[88px] rounded-[22px] border p-2.5 ${
                  day
                    ? day.isToday
                      ? 'border-[2px] border-[#0A0B10] bg-[#f7fbff]'
                      : 'border-[#e8eef6] bg-[#fbfdff]'
                    : 'border-transparent bg-transparent'
                }`}
              >
                {day ? (
                  <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-semibold text-[#0A0B10]">{day.date}</span>
                      {day.isToday ? (
                        <span className="rounded-full bg-[#0A0B10] px-2 py-0.5 text-[10px] font-semibold text-white">Today</span>
                      ) : null}
                    </div>
                    <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-[#62748a]">{day.summary}</p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      {day.tags.map((tag) => (
                        <span
                          key={`${day.date}-${tag.label}`}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${tagToneClassName[tag.tone]}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <aside className="flex min-h-0 flex-col rounded-[28px] border border-[var(--color-border)] bg-white px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="rounded-[24px] bg-[#0A0B10] p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#98a2b3]">{briefing.season}</p>
            <h2 className="mt-2 text-[24px] font-semibold leading-8">사순절 가이드와 AI 브리핑</h2>
            <p className="mt-3 text-sm leading-6 text-[#d0d5dd]">{briefing.summary}</p>
          </div>

          <div className="mt-4 rounded-[24px] border border-[#dde7f5] bg-[#f8fbff] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b7a90]">AI Briefing</p>
            <p className="mt-2 text-lg font-semibold leading-7 text-[#0A0B10]">{briefing.headline}</p>
            <p className="mt-2 text-sm leading-6 text-[#60708a]">{briefing.actionGuide}</p>

            <div className="mt-4 space-y-3">
              {briefing.focuses.map((focus) => (
                <div key={focus.title} className="rounded-2xl border border-white bg-white px-4 py-3">
                  <p className="text-sm font-semibold text-[#0A0B10]">{focus.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#60708a]">{focus.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#d9e6ff] bg-white px-3 py-3 text-sm font-semibold text-[#0A0B10]">
                <PenSquare className="h-4 w-4" />
                원고 초안 생성
              </button>
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#d9e6ff] bg-white px-3 py-3 text-sm font-semibold text-[#0A0B10]">
                <ImageIcon className="h-4 w-4" />
                이미지 만들기
              </button>
            </div>
          </div>

          <div className="mt-auto rounded-[24px] border border-[#e8eef6] bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0A0B10]">이번 주 액션</p>
                <p className="mt-1 text-xs leading-5 text-[#60708a]">금요일 원고 마감 전에 심방 질문과 주일 메시지를 같은 톤으로 정리해 두세요.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#0A0B10]" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
