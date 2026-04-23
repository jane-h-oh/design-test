'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  ImageIcon,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Modal, Select, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';

type MinistryCategory = 'worship' | 'care' | 'wedding' | 'education' | 'admin' | 'sermon';
type MinistryStatus = 'preparing' | 'done' | 'delayed';

type ScheduleItem = {
  id: string;
  title: string;
  startAt: string;
  endAt?: string;
  category: MinistryCategory;
  members: string[];
  memo: string;
  status: MinistryStatus;
  aiNote: string;
};

type ScheduleFormState = {
  id?: string;
  title: string;
  startAt: string;
  endAt: string;
  category: MinistryCategory;
  memberTags: string;
  memo: string;
  status: MinistryStatus;
};

const CATEGORY_OPTIONS = [
  { value: 'worship', label: '예배' },
  { value: 'care', label: '심방' },
  { value: 'wedding', label: '결혼식' },
  { value: 'education', label: '교육' },
  { value: 'admin', label: '행정' },
  { value: 'sermon', label: '설교 준비' },
] satisfies Array<{ value: MinistryCategory; label: string }>;

const STATUS_OPTIONS = [
  { value: 'preparing', label: '준비중' },
  { value: 'done', label: '완료' },
  { value: 'delayed', label: '지연' },
] satisfies Array<{ value: MinistryStatus; label: string }>;

const STATUS_LABEL: Record<MinistryStatus, string> = {
  preparing: '준비중',
  done: '완료',
  delayed: '지연',
};

const CATEGORY_LABEL: Record<MinistryCategory, string> = {
  worship: '예배',
  care: '심방',
  wedding: '결혼식',
  education: '교육',
  admin: '행정',
  sermon: '설교 준비',
};

const STATUS_TONE: Record<MinistryStatus, string> = {
  preparing: 'border-[#f7d9a7] bg-[#fff8eb] text-[#9a6700]',
  done: 'border-[#b7ebd0] bg-[#edfdf4] text-[#166534]',
  delayed: 'border-[#f4b7bd] bg-[#fff1f2] text-[#b42318]',
};

const CATEGORY_TONE: Record<MinistryCategory, string> = {
  worship: 'bg-[#edf4ff] text-[#1f4ea3]',
  care: 'bg-[#eefaf4] text-[#197149]',
  wedding: 'bg-[#f4f0ff] text-[#6941c6]',
  education: 'bg-[#ecfdf3] text-[#027a48]',
  admin: 'bg-[#f2f4f7] text-[#344054]',
  sermon: 'bg-[#fff4e8] text-[#b54708]',
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const TODAY_VERSE = {
  title: '오늘의 말씀',
  verse: '너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라.',
  reference: '잠언 3:5',
};

const LITURGICAL_INFO = {
  season: '사순절',
  title: '절제와 묵상의 절기',
  description: '부활절을 준비하며 회개와 말씀 묵상, 공동체 기도를 깊이 있게 이어가는 시간입니다.',
};

const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: 'sermon-deadline',
    title: '주일 설교 원고 마감',
    startAt: '2026-04-25T09:00',
    endAt: '2026-04-25T11:00',
    category: 'sermon',
    members: ['설교팀'],
    memo: '본론 2포인트와 적용 문단까지 확정하고 예화 문장을 다듬습니다.',
    status: 'preparing',
    aiNote: '원고 마지막 단락에서 공동체 적용을 한 문장으로 선명하게 정리해 보세요.',
  },
  {
    id: 'visit-kim',
    title: '김성도 가정 심방',
    startAt: '2026-04-23T14:00',
    endAt: '2026-04-23T15:30',
    category: 'care',
    members: ['김성도', '김집사'],
    memo: '최근 건강 이슈와 자녀 진학 고민을 중심으로 기도 제목을 정리합니다.',
    status: 'preparing',
    aiNote: '심방 전, 기도 제목과 최근 근황을 3줄로 정리해 두면 대화가 훨씬 자연스럽습니다.',
  },
  {
    id: 'wedding-lee',
    title: '이청년 결혼식 축사 점검',
    startAt: '2026-04-23T17:30',
    endAt: '2026-04-23T18:30',
    category: 'wedding',
    members: ['이청년', '양가 가족'],
    memo: '축사 길이는 4분 이내, 복음적 메시지와 축복 문장을 균형 있게 구성합니다.',
    status: 'delayed',
    aiNote: '예식 전, 축사 도입부를 더 따뜻하게 다듬고 담당자와 순서를 다시 확인해 보세요.',
  },
  {
    id: 'wednesday-service',
    title: '수요예배 찬양 리허설',
    startAt: '2026-04-24T19:00',
    endAt: '2026-04-24T20:00',
    category: 'worship',
    members: ['찬양팀'],
    memo: '새 곡 1곡의 코드 전환과 후렴 반복 횟수를 최종 점검합니다.',
    status: 'done',
    aiNote: '리허설 녹음본을 공유하면 다음 주 큐시트 준비가 훨씬 빨라집니다.',
  },
  {
    id: 'newfamily-class',
    title: '새가족 교육 2주차',
    startAt: '2026-04-27T10:30',
    endAt: '2026-04-27T11:30',
    category: 'education',
    members: ['새가족반'],
    memo: '교회 비전과 소그룹 안내 자료를 나눠주고 질의응답 시간을 확보합니다.',
    status: 'preparing',
    aiNote: '처음 오신 분들도 이해하기 쉬운 언어로 공동체 문화를 풀어내면 더 좋습니다.',
  },
  {
    id: 'budget-review',
    title: '다음 달 사역 예산 검토',
    startAt: '2026-04-29T16:00',
    endAt: '2026-04-29T17:00',
    category: 'admin',
    members: ['행정팀'],
    memo: '행사비와 교육비를 분리해 보고하고, 지연된 정산 항목을 체크합니다.',
    status: 'preparing',
    aiNote: '예산표를 사역 목적 중심으로 다시 묶어 두면 회의가 더 선명해집니다.',
  },
];

const createEmptyForm = (date?: Date): ScheduleFormState => {
  const baseDate = date ?? new Date('2026-04-23T09:00:00');
  const startAt = new Date(baseDate);
  startAt.setMinutes(0, 0, 0);
  const endAt = new Date(startAt);
  endAt.setHours(endAt.getHours() + 1);

  return {
    title: '',
    startAt: toDatetimeLocal(startAt),
    endAt: toDatetimeLocal(endAt),
    category: 'care',
    memberTags: '',
    memo: '',
    status: 'preparing',
  };
};

function toDatetimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function formatTimeRange(startAt: string, endAt?: string) {
  const start = new Date(startAt);
  const startText = start.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
  if (!endAt) return startText;
  const end = new Date(endAt);
  const endText = end.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
  return `${startText} - ${endText}`;
}

function differenceInDays(from: Date, to: Date) {
  const oneDay = 1000 * 60 * 60 * 24;
  const fromStart = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const toStart = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.ceil((toStart - fromStart) / oneDay);
}

function formatCompactTime(startAt: string) {
  return new Date(startAt).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
}

function buildMessageScript(schedule: ScheduleItem) {
  return [
    `[${CATEGORY_LABEL[schedule.category]} 공지] ${schedule.title}`,
    `${new Date(schedule.startAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })} ${formatTimeRange(schedule.startAt, schedule.endAt)}`,
    schedule.members.length ? `함께 챙길 분: ${schedule.members.join(', ')}` : '',
    schedule.memo,
  ]
    .filter(Boolean)
    .join('\n');
}

export default function DashboardPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-04-01T00:00:00'));
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ScheduleFormState>(createEmptyForm(new Date('2026-04-23T09:00:00')));
  const [copyFeedback, setCopyFeedback] = useState('');
  const [imageFeedback, setImageFeedback] = useState('');

  const today = useMemo(() => new Date('2026-04-23T09:00:00'), []);

  const monthMeta = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<Date | null> = Array.from({ length: firstDay }, () => null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return { year, month, cells };
  }, [currentMonth]);

  const schedulesByDay = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>();
    schedules.forEach((schedule) => {
      const key = schedule.startAt.slice(0, 10);
      const current = map.get(key) ?? [];
      current.push(schedule);
      current.sort((a, b) => a.startAt.localeCompare(b.startAt));
      map.set(key, current);
    });
    return map;
  }, [schedules]);

  const todaySchedules = useMemo(
    () => schedules.filter((schedule) => schedule.startAt.slice(0, 10) === today.toISOString().slice(0, 10)),
    [schedules, today]
  );

  const priorityDeadline = useMemo(() => {
    return schedules
      .filter((schedule) => schedule.category === 'sermon' && differenceInDays(today, new Date(schedule.startAt)) >= 0)
      .sort((a, b) => a.startAt.localeCompare(b.startAt))[0];
  }, [schedules, today]);

  const headline = useMemo(() => {
    const daysLeft = priorityDeadline ? differenceInDays(today, new Date(priorityDeadline.startAt)) : null;
    if (priorityDeadline && daysLeft !== null && daysLeft <= 3) {
      return `김다울 목사님, 평안한 하루 되세요. ${priorityDeadline.title}까지 ${daysLeft}일 남았습니다.`;
    }
    return '김다울 목사님, 평안한 하루 되세요. 이번 주 설교 준비를 AI가 돕고 있습니다.';
  }, [priorityDeadline, today]);

  const headlineSubcopy = useMemo(() => {
    if (todaySchedules.length === 0) {
      return '오늘 일정은 비교적 여유가 있습니다. 설교 개요와 주중 공지문을 미리 다듬어 두기 좋은 흐름입니다.';
    }

    const delayedCount = todaySchedules.filter((schedule) => schedule.status === 'delayed').length;
    if (delayedCount > 0) {
      return `오늘 일정 중 ${delayedCount}건은 점검이 더 필요합니다. 우선순위를 정리하고 AI 제안으로 준비 메시지까지 빠르게 이어가 보세요.`;
    }

    return '오늘 사역 흐름은 안정적입니다. 일정 메모와 성도 태그를 살피며 필요한 안내문을 자연스럽게 준비해 보세요.';
  }, [todaySchedules]);

  const focusText = useMemo(() => {
    const focusSource = todaySchedules[0] ?? priorityDeadline ?? schedules[0];
    return buildMessageScript(focusSource);
  }, [priorityDeadline, schedules, todaySchedules]);

  const prepGuides = useMemo(() => {
    const majorCategories: MinistryCategory[] = ['care', 'wedding', 'worship', 'sermon'];
    return todaySchedules
      .filter((schedule) => majorCategories.includes(schedule.category))
      .map((schedule) => ({
        id: schedule.id,
        title: schedule.title,
        time: formatTimeRange(schedule.startAt, schedule.endAt),
        guide: schedule.aiNote,
      }));
  }, [todaySchedules]);

  const selectedSchedule = useMemo(
    () => schedules.find((schedule) => schedule.id === selectedScheduleId) ?? null,
    [schedules, selectedScheduleId]
  );

  const openNewScheduleModal = (date?: Date) => {
    setSelectedScheduleId(null);
    setFormState(createEmptyForm(date));
    setIsModalOpen(true);
  };

  const openEditScheduleModal = (schedule: ScheduleItem) => {
    setSelectedScheduleId(schedule.id);
    setFormState({
      id: schedule.id,
      title: schedule.title,
      startAt: schedule.startAt.slice(0, 16),
      endAt: schedule.endAt?.slice(0, 16) ?? schedule.startAt.slice(0, 16),
      category: schedule.category,
      memberTags: schedule.members.join(', '),
      memo: schedule.memo,
      status: schedule.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveSchedule = () => {
    const normalizedMembers = formState.memberTags
      .split(',')
      .map((member) => member.trim())
      .filter(Boolean);

    const nextSchedule: ScheduleItem = {
      id: formState.id ?? `schedule-${Date.now()}`,
      title: formState.title || '새 일정',
      startAt: formState.startAt,
      endAt: formState.endAt,
      category: formState.category,
      members: normalizedMembers,
      memo: formState.memo,
      status: formState.status,
      aiNote:
        formState.category === 'care'
          ? '심방 전, 기도 제목과 최근 근황을 3줄로 정리해 두면 대화가 훨씬 자연스럽습니다.'
          : formState.category === 'wedding'
            ? '예식 전, 축사 도입부를 더 따뜻하게 다듬고 담당자와 순서를 다시 확인해 보세요.'
            : '핵심 메시지와 준비물을 한눈에 보이게 정리하면 진행이 훨씬 안정적입니다.',
    };

    setSchedules((current) => {
      const exists = current.some((schedule) => schedule.id === nextSchedule.id);
      return exists
        ? current.map((schedule) => (schedule.id === nextSchedule.id ? nextSchedule : schedule))
        : [...current, nextSchedule].sort((a, b) => a.startAt.localeCompare(b.startAt));
    });
    setIsModalOpen(false);
  };

  const handleCopyNotice = async () => {
    try {
      await navigator.clipboard.writeText(focusText);
      setCopyFeedback('교회 카카오톡 공지문이 클립보드에 복사되었습니다.');
    } catch {
      setCopyFeedback('클립보드 접근에 실패했습니다. 브라우저 권한을 확인해 주세요.');
    }
  };

  const handleCreateCardNews = () => {
    setImageFeedback('이미지 생성 API 연동 준비 완료: 현재는 카드뉴스 생성 핸들러만 연결되어 있습니다.');
  };

  return (
    <div className="relative flex min-h-full flex-col gap-5 pb-20">
      <section className="rounded-[28px] border border-[#dce7f5] bg-gradient-to-r from-white via-[#f6faff] to-[#edf5ff] px-4 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] md:px-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-[#dbe8ff] bg-white text-[#1d4ed8] shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7a90]">MokhoeMate</p>
              <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-[#0f172a] md:text-[26px]">{headline}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5b6b84]">{headlineSubcopy}</p>
            </div>
          </div>

          <div className="rounded-[22px] border border-[#d9e6ff] bg-white/90 px-4 py-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
              <BookOpen className="h-4 w-4 text-[#2563eb]" />
              {TODAY_VERSE.title}
            </div>
            <p className="mt-3 text-sm leading-6 text-[#334155]">“{TODAY_VERSE.verse}”</p>
            <p className="mt-2 text-xs font-medium text-[#60708a]">{TODAY_VERSE.reference}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_360px]">
        <Card className="rounded-[28px] border-[#dce7f5] bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-5">
          <CardHeader className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="text-[22px] text-[#0f172a]">일정 캘린더</CardTitle>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-full border border-[#d9e6ff] bg-[#f8fbff] p-1">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(monthMeta.year, monthMeta.month - 1, 1))}
                  className="rounded-full p-2 text-[#52627a] transition hover:bg-white"
                  aria-label="이전 달"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-[120px] px-3 text-center text-sm font-semibold text-[#0f172a]">
                  {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(monthMeta.year, monthMeta.month + 1, 1))}
                  className="rounded-full p-2 text-[#52627a] transition hover:bg-white"
                  aria-label="다음 달"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <Button type="button" className="rounded-full bg-[#1d4ed8] px-4 hover:bg-[#1e40af]" onClick={() => openNewScheduleModal()}>
                <Plus className="mr-1.5 h-4 w-4" />
                일정 추가
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8799]">
              {WEEKDAYS.map((weekday) => (
                <div key={weekday} className="py-1">
                  {weekday}
                </div>
              ))}
            </div>

            <div className="mt-3 overflow-x-auto">
              <div className="grid min-w-[720px] grid-cols-7 gap-2">
              {monthMeta.cells.map((date, index) => {
                const iso = date ? toDatetimeLocal(date).slice(0, 10) : '';
                const daySchedules = date ? schedulesByDay.get(iso) ?? [] : [];
                const visibleSchedules = daySchedules.slice(0, 2);
                const hiddenCount = Math.max(daySchedules.length - visibleSchedules.length, 0);
                const isToday =
                  date &&
                  date.getFullYear() === today.getFullYear() &&
                  date.getMonth() === today.getMonth() &&
                  date.getDate() === today.getDate();

                return (
                  <div
                    key={`${iso || 'empty'}-${index}`}
                    className={cn(
                      'group min-h-[110px] rounded-[24px] border p-2.5 transition',
                      date ? 'border-[#e3ecf8] bg-[#fbfdff] hover:border-[#bfd4ff] hover:bg-[#f8fbff]' : 'border-transparent bg-transparent',
                      isToday && 'border-[#2563eb] bg-[#f4f8ff] shadow-[inset_0_0_0_1px_rgba(37,99,235,0.12)]'
                    )}
                  >
                    {date ? (
                      <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#0f172a]">{date.getDate()}</span>
                            {isToday ? (
                              <span className="rounded-full bg-[#0f172a] px-2 py-0.5 text-[10px] font-semibold text-white">오늘</span>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() => openNewScheduleModal(date)}
                            className="inline-flex h-7 items-center justify-center gap-1 rounded-full border border-[#d7e4f7] bg-white px-2.5 text-[10px] font-semibold text-[#1d4ed8] opacity-0 shadow-sm transition group-hover:opacity-100"
                            aria-label={`${date.getDate()}일 일정 추가`}
                          >
                            <Plus className="h-4 w-4" />
                            <span>일정 추가</span>
                          </button>
                        </div>

                        <div className="mt-2 flex flex-1 flex-col gap-1.5">
                          {daySchedules.length > 0
                            ? visibleSchedules.map((schedule) => (
                                <button
                                  key={schedule.id}
                                  type="button"
                                  onClick={() => openEditScheduleModal(schedule)}
                                  className="rounded-[16px] border border-[#dfe8f5] bg-white px-2.5 py-2 text-left shadow-sm transition hover:border-[#bfd4ff] hover:bg-[#f9fbff]"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="shrink-0 text-[10px] font-semibold text-[#2563eb]">{formatCompactTime(schedule.startAt)}</span>
                                    <p className="min-w-0 flex-1 truncate text-[11px] font-semibold text-[#0f172a]">{schedule.title}</p>
                                    <span
                                      className={cn(
                                        'h-2.5 w-2.5 shrink-0 rounded-full',
                                        schedule.status === 'done' && 'bg-[#16a34a]',
                                        schedule.status === 'preparing' && 'bg-[#f59e0b]',
                                        schedule.status === 'delayed' && 'bg-[#ef4444]'
                                      )}
                                      aria-label={STATUS_LABEL[schedule.status]}
                                      title={STATUS_LABEL[schedule.status]}
                                    />
                                  </div>
                                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#60708a]">
                                    <span className={cn('rounded-full px-2 py-0.5 font-semibold', CATEGORY_TONE[schedule.category])}>
                                      {CATEGORY_LABEL[schedule.category]}
                                    </span>
                                    {schedule.members[0] ? <span className="truncate">#{schedule.members[0]}</span> : null}
                                  </div>
                                </button>
                              ))
                            : null}
                          {hiddenCount > 0 ? (
                            <button
                              type="button"
                              onClick={() => openNewScheduleModal(date)}
                              className="rounded-[14px] border border-dashed border-[#d9e6ff] px-2.5 py-1.5 text-left text-[10px] font-semibold text-[#60708a] transition hover:border-[#bfd4ff] hover:bg-white"
                            >
                              일정 {hiddenCount}건 더 보기
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
              </div>
            </div>

            <div className="mt-5 rounded-[20px] border border-[#e4ecf8] bg-[#f8fbff] px-4 py-3 text-sm text-[#5b6b84]">
              주님의 길을 따라가는 오늘의 당신을 응원합니다.
            </div>
          </CardContent>
        </Card>

        <aside className="flex flex-col gap-4">
          <Card className="rounded-[28px] border-[#dce7f5] bg-gradient-to-br from-[#f8fbff] to-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <CardHeader className="mb-4">
              <CardTitle className="flex items-center gap-2 text-[20px] text-[#0f172a]">
                <CalendarDays className="h-5 w-5 text-[#2563eb]" />
                {LITURGICAL_INFO.season}
              </CardTitle>
              <p className="mt-1 text-sm font-semibold text-[#0f172a]">{LITURGICAL_INFO.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#60708a]">{LITURGICAL_INFO.description}</p>
            </CardHeader>
          </Card>

          <Card className="rounded-[28px] border-[#dce7f5] bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-5">
            <CardHeader className="mb-4">
              <CardTitle className="flex items-center gap-2 text-[20px] text-[#0f172a]">
                <Sparkles className="h-5 w-5 text-[#2563eb]" />
                AI 액션 퀵 카드
              </CardTitle>
              <p className="mt-1 text-sm text-[#60708a]">오늘 사역에 맞는 제안을 골라 공지문과 돌봄 준비를 더 빠르게 이어가 보세요.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[22px] border border-[#d9e6ff] bg-[#f8fbff] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">메시지 변환 위젯</p>
                    <p className="mt-1 text-xs leading-5 text-[#60708a]">AI가 정리한 초안을 카드뉴스와 공지문으로 자연스럽게 바꿔드립니다.</p>
                  </div>
                  <ImageIcon className="h-5 w-5 text-[#2563eb]" />
                </div>

                <div className="mt-3 rounded-[18px] border border-white bg-white p-3">
                  <p className="whitespace-pre-line text-sm leading-6 text-[#334155]">{focusText}</p>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto justify-start whitespace-normal rounded-2xl border-[#cfe0ff] bg-white px-4 py-3 text-left leading-5"
                    onClick={handleCreateCardNews}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    성도님들의 마음을 만지는 카드뉴스 제작하기
                  </Button>
                  <Button
                    type="button"
                    className="h-auto justify-start whitespace-normal rounded-2xl bg-[#1d4ed8] px-4 py-3 text-left leading-5 hover:bg-[#1e40af]"
                    onClick={handleCopyNotice}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    교회 카카오톡 공지문 바로 복사하기
                  </Button>
                </div>

                {copyFeedback ? <p className="mt-2 text-xs font-medium text-[#2563eb]">{copyFeedback}</p> : null}
                {imageFeedback ? <p className="mt-1 text-xs font-medium text-[#2563eb]">{imageFeedback}</p> : null}
              </div>

              <div className="rounded-[22px] border border-[#dde7f5] bg-white p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[#2563eb]" />
                  <p className="text-sm font-semibold text-[#0f172a]">사전 준비 제안</p>
                </div>

                <div className="mt-3 space-y-3">
                  {prepGuides.length > 0 ? (
                    prepGuides.map((guide) => (
                      <div key={guide.id} className="rounded-[18px] border border-[#e6edf8] bg-[#f8fbff] p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[#0f172a]">{guide.title}</p>
                          <span className="text-xs font-medium text-[#60708a]">{guide.time}</span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#52627a]">{guide.guide}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-[#d8e4f6] px-3 py-4 text-sm text-[#60708a]">
                      오늘은 주요 준비 일정이 많지 않습니다. 다음 설교 원고와 주간 공지 흐름을 차분히 정리해 보세요.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#dfe8f5] bg-gradient-to-br from-[#f8fbff] to-white p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#2563eb]" />
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">지금 추천하는 AI 액션</p>
                    <p className="mt-2 text-sm leading-6 text-[#52627a]">
                      심방 전, 기도 제목 리마인드 받기와 예식 전 축사 흐름 정리를 함께 해두면 오늘 사역의 밀도가 훨씬 좋아집니다.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <button
        type="button"
        onClick={() => openNewScheduleModal()}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1d4ed8] text-white shadow-[0_18px_40px_rgba(29,78,216,0.35)] transition hover:bg-[#1e40af] xl:hidden"
        aria-label="새 일정 추가"
      >
        <Plus className="h-5 w-5" />
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-2xl rounded-[28px] border border-[#dce7f5] bg-white">
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4 border-b border-[#e7eef8] pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b7a90]">Schedule Detail</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0f172a]">{selectedSchedule ? '일정 상세 편집' : '새 일정 추가'}</h2>
              <p className="mt-2 text-sm text-[#60708a]">제목, 시간, 사역 카테고리, 성도 태그와 준비 상태를 한 번에 정리할 수 있습니다.</p>
            </div>
            {selectedSchedule ? (
              <span className={cn('rounded-full border px-3 py-1 text-xs font-semibold', STATUS_TONE[selectedSchedule.status])}>
                {STATUS_LABEL[selectedSchedule.status]}
              </span>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                id="schedule-title"
                label="제목"
                placeholder="예: 주일 설교 원고 마감"
                value={formState.title}
                onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
              />
            </div>

            <Input
              id="schedule-startAt"
              label="시작 일시"
              type="datetime-local"
              value={formState.startAt}
              onChange={(event) => setFormState((current) => ({ ...current, startAt: event.target.value }))}
            />

            <Input
              id="schedule-endAt"
              label="종료 일시"
              type="datetime-local"
              value={formState.endAt}
              onChange={(event) => setFormState((current) => ({ ...current, endAt: event.target.value }))}
            />

            <Select
              id="schedule-category"
              label="사역 카테고리"
              options={CATEGORY_OPTIONS}
              value={formState.category}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  category: event.target.value as MinistryCategory,
                }))
              }
            />

            <Select
              id="schedule-status"
              label="준비 상태"
              options={STATUS_OPTIONS}
              value={formState.status}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  status: event.target.value as MinistryStatus,
                }))
              }
            />

            <div className="md:col-span-2">
              <Input
                id="schedule-members"
                label="성도 태그"
                placeholder="예: 김성도, 이청년, 찬양팀"
                value={formState.memberTags}
                onChange={(event) => setFormState((current) => ({ ...current, memberTags: event.target.value }))}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                id="schedule-memo"
                label="상세 메모"
                rows={6}
                placeholder="준비할 자료, 기도 제목, 전달할 메시지 등을 적어 주세요."
                value={formState.memo}
                onChange={(event) => setFormState((current) => ({ ...current, memo: event.target.value }))}
              />
            </div>
          </div>

          {selectedSchedule ? (
            <div className="rounded-[22px] border border-[#dce7f5] bg-[#f8fbff] p-4">
              <p className="text-sm font-semibold text-[#0f172a]">AI 준비 메모</p>
              <p className="mt-2 text-sm leading-6 text-[#52627a]">{selectedSchedule.aiNote}</p>
            </div>
          ) : null}

          <div className="flex justify-end gap-2 border-t border-[#e7eef8] pt-4">
            <Button type="button" variant="ghost" className="rounded-2xl px-4" onClick={() => setIsModalOpen(false)}>
              닫기
            </Button>
            <Button type="button" className="rounded-2xl bg-[#1d4ed8] px-5 hover:bg-[#1e40af]" onClick={handleSaveSchedule}>
              일정 저장
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
