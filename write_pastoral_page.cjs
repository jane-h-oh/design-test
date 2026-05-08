const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app/(workspace)/dashboard/page.tsx');

const content = `'use client';

import { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Copy,
  ImageIcon,
  Sparkles,
  Heart,
  BookMarked,
  Music,
  Feather
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
  CATEGORY_LABEL,
  STATUS_LABEL,
  buildMessageScript
} from '@/types/ministry';
import { ScheduleWidget } from '@/components/dashboard/ScheduleWidget';

const TODAY_VERSE = {
  title: '오늘의 말씀',
  verse: '너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라.',
  reference: '잠언 3:5',
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
  const [copyFeedback, setCopyFeedback] = useState('');
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

  const handleCopyNotice = () => {
    setCopyFeedback('클립보드에 복사되었습니다.');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  return (
    <div className="relative min-h-full pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (Main Board) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Greeting Hero & Confession Input */}
          <section className="flex flex-col gap-4 mb-2">
            <div>
              <p className="font-medium text-slate-500 mb-2">말씀이 삶이 될 때, 설교는 능력이 됩니다.</p>
              <h1 className="text-3xl font-bold tracking-tight text-primary-900 md:text-4xl text-balance">
                오늘 목사님의 걸음은 어떠셨나요?
              </h1>
            </div>
            
            <div className="relative mt-2 max-w-2xl">
              <input 
                type="text" 
                value={confession}
                onChange={(e) => setConfession(e.target.value)}
                placeholder="오늘 하루의 짧은 고백이나 기도를 남겨보세요..."
                className="w-full bg-[#fdfbf7] border-b border-slate-200 py-3 px-4 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-primary-400 focus:bg-white transition-all shadow-sm font-medium leading-relaxed"
              />
            </div>
          </section>

          {/* Quick Stats / Insights Widget Area */}
          <div className="bg-[#fdfbf7] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/30 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
            <div className="relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Image-backed Verse Widget */}
                <div className="sm:col-span-1 relative p-5 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-end min-h-[180px] group cursor-pointer hover:shadow-md transition-all">
                  <img src="/verse_card_bg.png" alt="verse background" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                  <div className="relative z-10 text-white">
                    <p className="text-[10px] font-bold tracking-widest text-primary-200 uppercase mb-1">{TODAY_VERSE.title}</p>
                    <p className="text-sm font-semibold mb-1 leading-loose text-slate-50">“{TODAY_VERSE.verse}”</p>
                    <span className="text-xs font-medium text-slate-300">{TODAY_VERSE.reference}</span>
                  </div>
                </div>

                {/* Pastoral Insights Area (Sermon Progress & Keyword) */}
                <div className="sm:col-span-2 grid grid-cols-1 gap-4">
                  {/* 설교 준비 진행도 */}
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100 hover:border-primary-100 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Feather className="h-4 w-4 text-primary-600" />
                        <span className="text-xs font-bold text-slate-500 uppercase">설교 준비 진행도</span>
                      </div>
                      <span className="text-sm font-bold text-primary-700">65%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                      <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">이번 주일 설교 본론 2포인트 묵상 완료. 적용 문단을 작성할 차례입니다.</p>
                  </div>

                  {/* 성도 최근 관심사 키워드 */}
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-100 hover:border-primary-100 transition-all">
                     <div className="flex items-center gap-2 mb-3">
                        <Heart className="h-4 w-4 text-rose-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase">성도들의 최근 기도와 관심사</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold">건강 회복 (4명)</span>
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold">자녀 진학 (2명)</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">직장 이전</span>
                      </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* AI Task Recommendation List (Compact layout with Curation) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Context AI Actions */}
            <div className="bg-[#fdfbf7] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-50 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary-600" />
                <h4 className="text-lg font-bold text-slate-800">사역 메세지 초안 생성</h4>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-xl p-4 flex-1 flex flex-col">
                <div className="whitespace-pre-line text-sm text-slate-700 mb-4 font-medium leading-loose">
                  {buildMessageScript(schedules.find(s => s.status === 'preparing') || schedules[0])}
                </div>
                <button 
                  onClick={handleCopyNotice}
                  className="mt-auto flex items-center justify-center w-full h-10 rounded-lg bg-primary-50 text-primary-700 text-sm font-semibold hover:bg-primary-100 transition-colors"
                  disabled={!!copyFeedback}
                >
                  {copyFeedback ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copyFeedback || '메시지 복사하기'}
                </button>
              </div>
            </div>

            {/* Curation: Hymns & Illsutrations */}
            <div className="bg-[#fdfbf7] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-50 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <BookMarked className="h-5 w-5 text-emerald-600" />
                <h4 className="text-lg font-bold text-slate-800">오늘의 묵상 및 큐레이션</h4>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-100 rounded-xl p-4 flex-1">
                <div className="mb-4">
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-1"><Music className="h-3 w-3" /> 추천 찬양</span>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed">찬송가 302장 (내 주 하나님 넓고 큰 은혜는)<br/><span className="text-xs text-slate-500 font-medium">말씀을 의지하는 삶과 깊이 연결됩니다.</span></p>
                </div>
                <div>
                   <span className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-1"><Feather className="h-3 w-3" /> 예화 한 조각</span>
                   <p className="text-sm font-medium text-slate-600 leading-loose">작은 등불은 방 전체를 한 번에 밝힐 수는 없지만, 발이 내딛을 다음 걸음은 언제나 확실히 비춰줍니다. 말씀이 우리의 걸음을 비추는 원리입니다.</p>
                </div>
              </div>
            </div>

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

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedScheduleId ? '일정 수정' : '새 일정 추가'}>
        <div className="grid gap-4 bg-[#fdfbf7] -mx-6 -mb-6 p-6 rounded-b-xl border-t border-slate-100">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">제목</label>
            <Input
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              placeholder="일정 제목을 입력하세요"
              className="bg-white border-slate-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">시작 일시</label>
              <Input
                type="datetime-local"
                value={formState.startAt}
                onChange={(e) => setFormState({ ...formState, startAt: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">종료 일시</label>
              <Input
                type="datetime-local"
                value={formState.endAt}
                onChange={(e) => setFormState({ ...formState, endAt: e.target.value })}
                className="bg-white border-slate-200"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">분류</label>
              <Select
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value as MinistryCategory })}
                className="bg-white border-slate-200"
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
                className="bg-white border-slate-200"
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
            <label className="mb-1 block text-sm font-medium text-slate-700">참여자 (콤마로 구분)</label>
            <Input
              value={formState.memberTags}
              onChange={(e) => setFormState({ ...formState, memberTags: e.target.value })}
              placeholder="예: 김성도, 이집사"
              className="bg-white border-slate-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">메모</label>
            <Textarea
              rows={3}
              value={formState.memo}
              onChange={(e) => setFormState({ ...formState, memo: e.target.value })}
              placeholder="일정과 관련된 준비사항 등을 입력하세요"
              className="bg-white border-slate-200"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal} className="border-slate-200 bg-white">취소</Button>
            <Button variant="primary" onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm">저장</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
`;

fs.writeFileSync(pageFile, content, 'utf8');
console.log('Pastoral Layout Applied');
