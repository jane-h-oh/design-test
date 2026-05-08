const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app/(workspace)/dashboard/page.tsx');
let pageCode = fs.readFileSync(pageFile, 'utf8');

// 1. Swap order of 큐레이션 and 마음과 기도, and add Edit button
// We'll extract both blocks, modify them, and re-inject them in the new order.
// Oh wait, writing a raw rewrite of the entire file is safer since I have the base code.
const newPageCode = `'use client';

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
    <div className="relative min-h-full pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column (Main Board) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Greeting Hero & Confession Input */}
          <section className="flex flex-col gap-4">
            <div>
              <p className="text-lg font-medium text-slate-500 mb-2">말씀이 삶이 될 때, 설교는 능력이 됩니다.</p>
              <h1 className="text-4xl font-bold tracking-tight text-primary-900 md:text-5xl text-balance">
                오늘 목사님의 걸음은 어떠셨나요?
              </h1>
            </div>
            
            <div className="relative mt-4 max-w-3xl">
              <input 
                type="text" 
                value={confession}
                onChange={(e) => setConfession(e.target.value)}
                placeholder="오늘 하루의 짧은 고백이나 기도를 남겨보세요..."
                className="w-full bg-transparent border-b-2 border-slate-200 py-4 px-2 text-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-primary-400 transition-all font-serif leading-loose"
              />
            </div>
          </section>

          {/* 오늘의 영감 큐레이션 (Moved to Top) */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border-transparent flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <BookMarked className="h-6 w-6 text-primary-600" />
              <h3 className="text-2xl font-bold text-slate-800">오늘의 영감 큐레이션</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest"><Music className="h-4 w-4" /> 추천 찬양</span>
                <p className="text-xl font-serif text-slate-800 leading-loose font-medium">찬송가 302장<br/><span className="text-2xl">내 주 하나님 넓고 큰 은혜는</span></p>
                <p className="text-base font-serif text-slate-600 leading-loose">
                  바다처럼 깊고 넓은 은혜의 말씀을 온전히 의지하는 삶과 깊이 연결됩니다.
                </p>
              </div>
              <div className="space-y-4">
                 <span className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest"><Feather className="h-4 w-4" /> 예화 한 조각</span>
                 <p className="text-lg font-serif text-slate-700 leading-loose">
                   "작은 등불은 방 전체를 한 번에 밝힐 수는 없지만, 발이 내딛을 다음 걸음은 언제나 확실히 비춰줍니다. 말씀이 우리의 걸음을 비추는 원리도 이와 같습니다."
                 </p>
              </div>
            </div>
          </div>

          {/* 성도들의 마음과 기도 (Moved to Bottom, added Edit Button) */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border-transparent relative overflow-hidden group">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-rose-500" />
                  <h3 className="text-2xl font-bold text-slate-800">성도들의 마음과 기도</h3>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                  <Pencil className="h-4 w-4" />
                  기도제목 수정
                </button>
             </div>
             <ul className="space-y-4">
               <li className="flex items-start gap-4 hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                 <span className="w-1.5 h-1.5 mt-3 rounded-full bg-rose-400 shrink-0" />
                 <p className="text-lg text-slate-700 leading-loose">
                   <strong className="font-bold text-slate-900">김성도</strong>: 최근 위장 수술을 마치고 회복 중에 있습니다. 빠른 쾌유와 가정의 평안을 위해.
                 </p>
               </li>
               <li className="flex items-start gap-4 hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                 <span className="w-1.5 h-1.5 mt-3 rounded-full bg-blue-400 shrink-0" />
                 <p className="text-lg text-slate-700 leading-loose">
                   <strong className="font-bold text-slate-900">이청년</strong>: 상반기 치열한 취업 준비를 겪고 있습니다. 지치지 않는 믿음과 길을 열어주시기를 위해.
                 </p>
               </li>
               <li className="flex items-start gap-4 hover:bg-slate-50 p-2 -mx-2 rounded-lg transition-colors cursor-pointer">
                 <span className="w-1.5 h-1.5 mt-3 rounded-full bg-emerald-400 shrink-0" />
                 <p className="text-lg text-slate-700 leading-loose">
                   <strong className="font-bold text-slate-900">박집사 가정</strong>: 새롭게 시작하는 사업터에 주님의 인도하심이 깃들고, 정직한 일터가 되기 위해.
                 </p>
               </li>
             </ul>
          </div>

        </div>

        {/* Right Column (Schedule Widget Map) */}
        <div className="lg:col-span-4 flex flex-col min-h-[600px]">
           <ScheduleWidget 
              schedules={schedules} 
              selectedDate={selectedDate} 
              onDateChange={setSelectedDate}
              onAddEvent={openNewScheduleModal}
              onEditEvent={openEditModal}
           />
        </div>

      </div>

      {/* Modal - background yellow removed */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedScheduleId ? '사역 기록 수정' : '새 사역 기록하기'}>
        <div className="grid gap-4 bg-white -mx-6 -mb-6 p-6 rounded-b-xl border-t border-slate-100">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">제목</label>
            <Input
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              placeholder="사역 제목을 입력하세요"
              className="bg-white"
            />
          </div>
          {/* Rest of modal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">시작 일시</label>
              <Input
                type="datetime-local"
                value={formState.startAt}
                onChange={(e) => setFormState({ ...formState, startAt: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">종료 일시</label>
              <Input
                type="datetime-local"
                value={formState.endAt}
                onChange={(e) => setFormState({ ...formState, endAt: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">분류</label>
              <Select
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value as MinistryCategory })}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">상태</label>
              <Select
                value={formState.status}
                onChange={(e) => setFormState({ ...formState, status: e.target.value as MinistryStatus })}
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
            <label className="mb-1 block text-sm font-medium text-slate-700">관계 성도</label>
            <Input
              value={formState.memberTags}
              onChange={(e) => setFormState({ ...formState, memberTags: e.target.value })}
              placeholder="예: 김성도, 이집사"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">메모 및 기도제목</label>
            <Textarea
              rows={3}
              value={formState.memo}
              onChange={(e) => setFormState({ ...formState, memo: e.target.value })}
              placeholder="사역과 관련된 묵상이나 기도제목을 기록하세요"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal} className="bg-white">취소</Button>
            <Button variant="primary" onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white">기록 액션</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
`;

fs.writeFileSync(pageFile, newPageCode, 'utf8');
console.log('page.tsx refactored');

// 2. Refactor ScheduleWidget.tsx
const widgetFile = path.join(__dirname, 'src/components/dashboard/ScheduleWidget.tsx');
let widgetCode = fs.readFileSync(widgetFile, 'utf8');

// Change background from #fdfbf7 to white
widgetCode = widgetCode.replace(/bg-\[\#fdfbf7\]/g, 'bg-white');

// Change button text
widgetCode = widgetCode.replace(/새로운 사역 기록하기/g, '일정 추가');

// Add "Today" button in Calendar Navigation
const calendarNavRegex = /<div className="flex items-center gap-1">\s*<button onClick=\{prevPeriod\}/;
widgetCode = widgetCode.replace(calendarNavRegex, `<div className="flex items-center gap-1">
          <button 
            onClick={() => onDateChange(new Date())} 
            className="px-2 py-1 mr-1 text-xs font-bold text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
          >
            오늘
          </button>
          <button onClick={prevPeriod}`);

fs.writeFileSync(widgetFile, widgetCode, 'utf8');
console.log('ScheduleWidget.tsx refactored');
