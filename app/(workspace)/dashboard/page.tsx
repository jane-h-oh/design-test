'use client';

import { useState } from 'react';
import { BookMarked, Heart, MessageSquareText, Music, Pencil, Sparkles, Trash2 } from 'lucide-react';
import { Button, Input, Modal, Textarea } from '@/components/ui';
import { Select } from '@/components/ui/Select';
import { ScheduleWidget } from '@/components/dashboard/ScheduleWidget';
import {
  CATEGORY_OPTIONS,
  MinistryCategory,
  MinistryStatus,
  ScheduleFormState,
  ScheduleItem,
  STATUS_OPTIONS,
} from '@/types/ministry';

const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: 'morning-prayer',
    title: '새벽기도회 인도',
    startAt: '2026-04-23T05:00',
    endAt: '2026-04-23T06:30',
    category: 'worship',
    members: ['찬양팀'],
    memo: '창세기 12장 말씀 선포',
    status: 'done',
    aiNote: '',
    keywords: ['새벽기도', '말씀선포'],
  },
  {
    id: 'sermon-prep',
    title: '주일 설교 원고 작성',
    startAt: '2026-04-23T09:00',
    endAt: '2026-04-23T11:00',
    category: 'sermon',
    members: ['담임목사'],
    memo: '본문 묵상과 예화 구성 정리',
    status: 'preparing',
    aiNote: '',
    keywords: ['설교준비', '본문묵상'],
  },
  {
    id: 'staff-meeting',
    title: '정기 교역자 회의',
    startAt: '2026-04-23T11:30',
    endAt: '2026-04-23T13:00',
    category: 'admin',
    members: ['교역자 전원'],
    memo: '5월 사역 일정과 행사 점검',
    status: 'preparing',
    aiNote: '',
    keywords: ['회의', '사역점검'],
  },
  {
    id: 'visit-kim',
    title: '김성도 가정 심방',
    startAt: '2026-04-23T14:00',
    endAt: '2026-04-23T15:30',
    category: 'care',
    members: ['김성도', '김집사'],
    memo: '건강 회복과 가정의 평안을 위한 기도 제목 정리',
    status: 'preparing',
    aiNote: '',
    keywords: ['심방', '돌봄'],
  },
];

type PrayerItem = {
  id: string;
  name: string;
  tag: string;
  prayer: string;
};

const INITIAL_PRAYERS: PrayerItem[] = [
  {
    id: 'p1',
    name: '김성도 성도님',
    tag: '회복',
    prayer: '수술 이후 회복 과정 가운데 평안과 힘을 더하시도록 기도합니다.',
  },
  {
    id: 'p2',
    name: '이청년 형제',
    tag: '진로',
    prayer: '취업 준비 가운데 지치지 않고 열린 길을 발견하도록 기도합니다.',
  },
  {
    id: 'p3',
    name: '청년부 리더',
    tag: '양육',
    prayer: '리더들이 말씀 안에서 공동체를 건강하게 섬기도록 기도합니다.',
  },
];

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function createEmptyForm(date?: Date): ScheduleFormState {
  const base = date ?? new Date('2026-04-23T09:00:00');
  const start = new Date(base);
  start.setMinutes(0, 0, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  return {
    title: '',
    startAt: toDatetimeLocal(start),
    endAt: toDatetimeLocal(end),
    category: 'care',
    memberTags: '',
    memo: '',
    status: 'preparing',
    keywordTags: '',
  };
}

export default function DashboardPage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [selectedDate, setSelectedDate] = useState(new Date('2026-04-23T09:00:00'));
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ScheduleFormState>(createEmptyForm());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [prayers, setPrayers] = useState<PrayerItem[]>(INITIAL_PRAYERS);
  const [editingPrayerId, setEditingPrayerId] = useState<string | null>(null);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [newPrayerName, setNewPrayerName] = useState('');
  const [newPrayerTag, setNewPrayerTag] = useState('회복');
  const [newPrayerText, setNewPrayerText] = useState('');

  const openNewSchedule = (date?: Date) => {
    setSelectedScheduleId(null);
    setFormState(createEmptyForm(date ?? selectedDate));
    setIsScheduleModalOpen(true);
  };

  const openEditSchedule = (schedule: ScheduleItem) => {
    setSelectedScheduleId(schedule.id);
    setFormState({
      id: schedule.id,
      title: schedule.title,
      startAt: schedule.startAt,
      endAt: schedule.endAt ?? '',
      category: schedule.category,
      memberTags: schedule.members.join(', '),
      memo: schedule.memo,
      status: schedule.status,
      keywordTags: schedule.keywords.join(', '),
    });
    setIsScheduleModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedScheduleId(null);
  };

  const handleScheduleSave = () => {
    if (!formState.title.trim()) {
      alert('일정 제목을 입력해주세요.');
      return;
    }

    const members = formState.memberTags.split(',').map((value) => value.trim()).filter(Boolean);
    const keywords = formState.keywordTags.split(',').map((value) => value.trim()).filter(Boolean);

    if (selectedScheduleId) {
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === selectedScheduleId
            ? { ...schedule, ...formState, members, keywords, aiNote: schedule.aiNote }
            : schedule
        )
      );
    } else {
      setSchedules((prev) => [
        ...prev,
        {
          ...formState,
          id: Math.random().toString(36).slice(2, 9),
          members,
          keywords,
          aiNote: '',
        },
      ]);
    }
    closeScheduleModal();
  };

  const openPrayerModal = (prayer?: PrayerItem) => {
    setEditingPrayerId(prayer?.id ?? null);
    setNewPrayerName(prayer?.name ?? '');
    setNewPrayerTag(prayer?.tag ?? '회복');
    setNewPrayerText(prayer?.prayer ?? '');
    setIsPrayerModalOpen(true);
  };

  const savePrayer = () => {
    if (!newPrayerName.trim() || !newPrayerText.trim()) {
      alert('이름과 기도 제목을 입력해주세요.');
      return;
    }

    if (editingPrayerId) {
      setPrayers((prev) =>
        prev.map((prayer) =>
          prayer.id === editingPrayerId
            ? { ...prayer, name: newPrayerName.trim(), tag: newPrayerTag.trim(), prayer: newPrayerText.trim() }
            : prayer
        )
      );
    } else {
      setPrayers((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2, 9),
          name: newPrayerName.trim(),
          tag: newPrayerTag.trim(),
          prayer: newPrayerText.trim(),
        },
      ]);
    }

    setIsPrayerModalOpen(false);
  };

  const removePrayer = (id: string) => {
    setPrayers((prev) => prev.filter((prayer) => prayer.id !== id));
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-polaris-lg border border-line-neutral bg-layer-surface shadow-polaris-sm">
        <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
          <div className="p-6 md:p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-polaris-pill bg-ai-hover px-3 py-1 text-polaris-caption1 font-bold text-ai-normal">
              <Sparkles className="h-3.5 w-3.5" />
              Polaris Design System applied
            </div>
            <h1 className="max-w-2xl text-polaris-title text-label-normal md:text-polaris-display">
              오늘의 사역을 한 화면에서 정리하세요
            </h1>
            <p className="mt-3 max-w-2xl text-polaris-body1 leading-relaxed text-label-neutral">
              일정, 설교 준비, 기도 제목을 Polaris 토큰 기반의 조용하고 선명한 업무 화면으로 정리했습니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => openNewSchedule()} size="lg">
                일정 추가
              </Button>
              <Button variant="secondary" onClick={() => openPrayerModal()} size="lg">
                기도 제목 추가
              </Button>
            </div>
          </div>

          <div className="border-t border-line-neutral bg-background-alternative p-6 lg:border-l lg:border-t-0">
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {[
                { label: '오늘 일정', value: schedules.length },
                { label: '기도 제목', value: prayers.length },
                { label: '진행중', value: schedules.filter((schedule) => schedule.status === 'preparing').length },
              ].map((item) => (
                <div key={item.label} className="rounded-polaris-md border border-line-neutral bg-layer-surface p-4">
                  <p className="text-polaris-caption1 font-bold text-label-assistive">{item.label}</p>
                  <p className="mt-2 text-polaris-heading2 text-label-normal">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <section className="rounded-polaris-lg border border-line-neutral bg-layer-surface p-6 shadow-polaris-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-polaris-md bg-accent-brand-bg text-accent-brand-normal">
                <BookMarked className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-polaris-heading3 text-label-normal">오늘의 영감</h2>
                <p className="text-polaris-caption1 text-label-assistive">설교와 콘텐츠의 출발점을 빠르게 잡습니다.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-polaris-md bg-background-alternative p-5">
                <p className="mb-3 flex items-center gap-2 text-polaris-caption1 font-bold text-accent-brand-normal">
                  <Music className="h-4 w-4" />
                  추천 찬양
                </p>
                <h3 className="text-polaris-heading4 text-label-normal">주님 말씀하시면</h3>
                <p className="mt-2 text-polaris-body3 leading-relaxed text-label-neutral">
                  조용한 결단과 순종을 이야기할 때 자연스럽게 연결되는 찬양입니다.
                </p>
              </article>

              <article className="rounded-polaris-md bg-ai-hover p-5">
                <p className="mb-3 flex items-center gap-2 text-polaris-caption1 font-bold text-ai-normal">
                  <MessageSquareText className="h-4 w-4" />
                  설교 메모
                </p>
                <h3 className="text-polaris-heading4 text-label-normal">작은 순종이 다음 길을 엽니다</h3>
                <p className="mt-2 text-polaris-body3 leading-relaxed text-label-neutral">
                  전체 방향보다 오늘 순종할 한 걸음을 구체적으로 제시해보세요.
                </p>
              </article>
            </div>
          </section>

          <section className="rounded-polaris-lg border border-line-neutral bg-layer-surface p-6 shadow-polaris-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-polaris-md bg-state-error-bg text-state-error">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-polaris-heading3 text-label-normal">기도 제목</h2>
                  <p className="text-polaris-caption1 text-label-assistive">성도별 돌봄 포인트를 놓치지 않습니다.</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => openPrayerModal()}>
                추가
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {prayers.map((prayer) => (
                <article
                  key={prayer.id}
                  className="group rounded-polaris-md border border-line-neutral bg-background-alternative p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="rounded-polaris-pill bg-state-success-bg px-2 py-0.5 text-polaris-caption1 font-bold text-state-success">
                      {prayer.tag}
                    </span>
                    <span className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => openPrayerModal(prayer)}
                        className="flex h-7 w-7 items-center justify-center rounded-polaris-xs text-label-assistive hover:bg-interaction-hover hover:text-label-normal"
                        aria-label="기도 제목 수정"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removePrayer(prayer.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-polaris-xs text-label-assistive hover:bg-state-error-bg hover:text-state-error"
                        aria-label="기도 제목 삭제"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </div>
                  <h3 className="text-polaris-body2 font-bold text-label-normal">{prayer.name}</h3>
                  <p className="mt-2 text-polaris-body3 leading-relaxed text-label-neutral">{prayer.prayer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <ScheduleWidget
            schedules={schedules}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onAddEvent={openNewSchedule}
            onEditEvent={openEditSchedule}
          />
        </div>
      </div>

      <Modal isOpen={isScheduleModalOpen} onClose={closeScheduleModal} title={selectedScheduleId ? '일정 수정' : '새 일정 추가'}>
        <div className="grid gap-5">
          <label className="grid gap-1.5">
            <span className="text-polaris-caption1 font-bold text-label-alternative">제목</span>
            <Input value={formState.title} onChange={(event) => setFormState({ ...formState, title: event.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-polaris-caption1 font-bold text-label-alternative">시작</span>
              <Input
                type="datetime-local"
                value={formState.startAt}
                onChange={(event) => setFormState({ ...formState, startAt: event.target.value })}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-polaris-caption1 font-bold text-label-alternative">종료</span>
              <Input
                type="datetime-local"
                value={formState.endAt}
                onChange={(event) => setFormState({ ...formState, endAt: event.target.value })}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-polaris-caption1 font-bold text-label-alternative">분류</span>
              <Select
                value={formState.category}
                onChange={(event) => setFormState({ ...formState, category: event.target.value as MinistryCategory })}
                options={CATEGORY_OPTIONS}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-polaris-caption1 font-bold text-label-alternative">상태</span>
              <Select
                value={formState.status}
                onChange={(event) => setFormState({ ...formState, status: event.target.value as MinistryStatus })}
                options={STATUS_OPTIONS}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-polaris-caption1 font-bold text-label-alternative">참여자</span>
              <Input
                value={formState.memberTags}
                onChange={(event) => setFormState({ ...formState, memberTags: event.target.value })}
                placeholder="예: 찬양팀, 김성도"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-polaris-caption1 font-bold text-label-alternative">키워드</span>
              <Input
                value={formState.keywordTags}
                onChange={(event) => setFormState({ ...formState, keywordTags: event.target.value })}
                placeholder="예: 심방, 설교"
              />
            </label>
          </div>
          <label className="grid gap-1.5">
            <span className="text-polaris-caption1 font-bold text-label-alternative">메모</span>
            <Textarea
              rows={3}
              value={formState.memo}
              onChange={(event) => setFormState({ ...formState, memo: event.target.value })}
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={closeScheduleModal}>
              취소
            </Button>
            <Button onClick={handleScheduleSave}>저장</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isPrayerModalOpen} onClose={() => setIsPrayerModalOpen(false)} title={editingPrayerId ? '기도 제목 수정' : '기도 제목 추가'}>
        <div className="grid gap-5">
          <label className="grid gap-1.5">
            <span className="text-polaris-caption1 font-bold text-label-alternative">이름</span>
            <Input value={newPrayerName} onChange={(event) => setNewPrayerName(event.target.value)} />
          </label>
          <label className="grid gap-1.5">
            <span className="text-polaris-caption1 font-bold text-label-alternative">태그</span>
            <Input value={newPrayerTag} onChange={(event) => setNewPrayerTag(event.target.value)} />
          </label>
          <label className="grid gap-1.5">
            <span className="text-polaris-caption1 font-bold text-label-alternative">기도 내용</span>
            <Textarea rows={4} value={newPrayerText} onChange={(event) => setNewPrayerText(event.target.value)} />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsPrayerModalOpen(false)}>
              취소
            </Button>
            <Button onClick={savePrayer}>저장</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
