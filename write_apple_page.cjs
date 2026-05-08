const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app/(workspace)/dashboard/page.tsx');

const content = `'use client';

import { useMemo, useState } from 'react';
import {
  Heart,
  BookMarked,
  Music,
  Feather,
  Pencil
} from 'lucide-react';
import { Button, Input, Modal, Select, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';
import { 
  MinistryCategory, 
  MinistryStatus, 
  ScheduleItem, 
  ScheduleFormState,
  CATEGORY_OPTIONS, 
  STATUS_OPTIONS,
} from '@/types/ministry';
import { ScheduleWidget } from '@/components/dashboard/ScheduleWidget';

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
    aiNote: '',
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
    aiNote: '',
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

export default function DashboardPage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date('2026-04-23T09:00:00'));
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ScheduleFormState>(createEmptyForm());
  const [confession, setConfession] = useState('');

  const openNewScheduleModal = (date?: Date) => {
    setSelectedScheduleId(null);
    setFormState(createEmptyForm(date || selectedDate));
    setIsModalOpen(true);
  };

  const openEditModal = (schedule: ScheduleItem) => {
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
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScheduleId(null);
  };

  const handleSave = () => {
    if (!formState.title.trim()) {
      alert('일정 제목을 입력해주세요.');
      return;
    }
    const members = formState.memberTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (selectedScheduleId) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === selectedScheduleId ? { ...s, ...formState, members, aiNote: s.aiNote } : s))
      );
    } else {
      const newItem: ScheduleItem = {
        ...formState,
        id: Math.random().toString(36).substring(2, 9),
        members,
        aiNote: '',
      };
      setSchedules((prev) => [...prev, newItem]);
    }
    closeModal();
  };

  return (
    <div className="relative min-h-full pb-32 bg-[#F5F5F7] -m-6 p-6 md:-m-12 md:p-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column (Main Board) */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          
          {/* Greeting Hero & Confession Input (Glassmorphism) */}
          <section className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[32px] p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-2xl font-light text-slate-500 mb-4 tracking-tight">말씀이 삶이 될 때, 설교는 능력이 됩니다.</p>
              <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-6xl text-balance">
                오늘 목사님의 걸음은 어떠셨나요?
              </h1>
            </div>
            
            <div className="relative mt-4 max-w-3xl z-10">
              <input 
                type="text" 
                value={confession}
                onChange={(e) => setConfession(e.target.value)}
                placeholder="오늘 하루의 짧은 고백이나 기도를 남겨보세요..."
                className="w-full bg-slate-100/50 hover:bg-slate-100 focus:bg-slate-50 py-5 px-6 rounded-2xl text-xl text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-inner font-medium tracking-tight"
              />
            </div>
          </section>

          {/* 오늘의 영감 큐레이션 */}
          <div className="bg-white rounded-[32px] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <BookMarked className="h-6 w-6 text-primary-600" />
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">오늘의 영감 큐레이션</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <span className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest"><Music className="h-4 w-4" /> 추천 찬양</span>
                <p className="text-2xl text-slate-800 leading-loose font-medium tracking-tight">찬송가 302장<br/><span className="text-3xl font-extrabold text-slate-900">내 주 하나님 넓고 큰 은혜는</span></p>
                <p className="text-lg text-slate-500 leading-loose font-medium">
                  바다처럼 깊고 넓은 은혜의 말씀을 온전히 의지하는 삶과 깊이 연결됩니다.
                </p>
              </div>
              <div className="space-y-6">
                 <span className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest"><Feather className="h-4 w-4" /> 예화 한 조각</span>
                 <p className="text-xl text-slate-700 leading-loose font-medium tracking-tight">
                   "작은 등불은 방 전체를 한 번에 밝힐 수는 없지만, 발이 내딛을 다음 걸음은 언제나 확실히 비춰줍니다. 말씀이 우리의 걸음을 비추는 원리도 이와 같습니다."
                 </p>
              </div>
            </div>
          </div>

          {/* 성도들의 기도 소리 (Bento Layout without bullets) */}
          <div className="bg-white rounded-[32px] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-rose-500" />
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">성도들의 기도 소리</h3>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
                  <Pencil className="h-4 w-4" />
                  편집
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               
               <div className="bg-slate-50 hover:bg-slate-100/70 p-8 rounded-[24px] transition-colors cursor-pointer flex flex-col gap-4">
                 <h4 className="text-lg font-bold text-slate-900">김성도 성도님</h4>
                 <p className="text-lg text-slate-600 leading-relaxed font-medium">
                   최근 위장 수술을 마치고 회복 중에 있습니다. 빠른 쾌유와 가정의 평안을 위해.
                 </p>
               </div>
               
               <div className="bg-slate-50 hover:bg-slate-100/70 p-8 rounded-[24px] transition-colors cursor-pointer flex flex-col gap-4">
                 <h4 className="text-lg font-bold text-slate-900">이청년 형제</h4>
                 <p className="text-lg text-slate-600 leading-relaxed font-medium">
                   상반기 치열한 취업 준비를 겪고 있습니다. 지치지 않는 믿음과 길을 열어주시기를 위해.
                 </p>
               </div>
               
               <div className="bg-slate-50 hover:bg-slate-100/70 p-8 rounded-[24px] transition-colors cursor-pointer flex flex-col gap-4">
                 <h4 className="text-lg font-bold text-slate-900">박집사 가정</h4>
                 <p className="text-lg text-slate-600 leading-relaxed font-medium">
                   새롭게 시작하는 사업터에 주님의 인도하심이 깃들고, 정직한 일터가 되기 위해.
                 </p>
               </div>

             </div>
          </div>

        </div>

        {/* Right Column (Schedule Widget Map) */}
        <div className="lg:col-span-4 flex flex-col min-h-[800px]">
           <ScheduleWidget 
              schedules={schedules} 
              selectedDate={selectedDate} 
              onDateChange={setSelectedDate}
              onAddEvent={openNewScheduleModal}
              onEditEvent={openEditModal}
           />
        </div>

      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedScheduleId ? '사역 기록 수정' : '새 사역 기록하기'}>
        <div className="grid gap-6 bg-slate-50 -mx-6 -mb-6 p-8 rounded-b-[24px]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">제목</label>
            <Input
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              placeholder="사역 제목을 입력하세요"
              className="bg-white border-transparent shadow-sm py-3 px-4 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">시작 일시</label>
              <Input
                type="datetime-local"
                value={formState.startAt}
                onChange={(e) => setFormState({ ...formState, startAt: e.target.value })}
                className="bg-white border-transparent shadow-sm py-3 px-4 rounded-xl"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">종료 일시</label>
              <Input
                type="datetime-local"
                value={formState.endAt}
                onChange={(e) => setFormState({ ...formState, endAt: e.target.value })}
                className="bg-white border-transparent shadow-sm py-3 px-4 rounded-xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">분류</label>
              <Select
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value as MinistryCategory })}
                className="bg-white border-transparent shadow-sm py-3 px-4 rounded-xl"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">상태</label>
              <Select
                value={formState.status}
                onChange={(e) => setFormState({ ...formState, status: e.target.value as MinistryStatus })}
                className="bg-white border-transparent shadow-sm py-3 px-4 rounded-xl"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">관계 성도</label>
            <Input
              value={formState.memberTags}
              onChange={(e) => setFormState({ ...formState, memberTags: e.target.value })}
              placeholder="예: 김성도, 이집사"
              className="bg-white border-transparent shadow-sm py-3 px-4 rounded-xl"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">메모 및 기도제목</label>
            <Textarea
              rows={4}
              value={formState.memo}
              onChange={(e) => setFormState({ ...formState, memo: e.target.value })}
              placeholder="사역과 관련된 묵상이나 기도제목을 기록하세요"
              className="bg-white border-transparent shadow-sm py-3 px-4 rounded-xl"
            />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={closeModal} className="bg-white border-transparent shadow-sm px-6 py-2.5 rounded-xl text-slate-700 font-bold hover:bg-slate-50">취소</Button>
            <Button variant="primary" onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm px-6 py-2.5 rounded-xl font-bold">기록 저장</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
`;

fs.writeFileSync(pageFile, content, 'utf8');
console.log('Pastoral Layout Applied Round 3 (Apple HI Style)');
