const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app/(workspace)/dashboard/page.tsx');

const content = `'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Copy,
  ImageIcon,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Modal, Select, Textarea } from '@/components/ui';
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

export default function DashboardPage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date('2026-04-23T09:00:00'));
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ScheduleFormState>(createEmptyForm());
  const [copyFeedback, setCopyFeedback] = useState('');
  const [imageFeedback, setImageFeedback] = useState('');

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

  const handleCreateCardNews = () => {
    setImageFeedback('배경 이미지가 생성되었습니다. 다운로드를 확인하세요.');
    setTimeout(() => setImageFeedback(''), 2000);
  };

  return (
    <div className="relative min-h-full pb-20">
      
      {/* Bento Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column (Main Board) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Greeting Hero */}
          <section className="flex flex-col md:flex-row items-end justify-between gap-6 mb-2">
            <div className="flex-1">
              <p className="font-medium text-slate-500 mb-2">말씀이 삶이 될 때, 설교는 능력이 됩니다.</p>
              <h1 className="text-3xl font-bold tracking-tight text-primary-900 md:text-4xl text-balance">
                오늘 목사님의 걸음은 어떠셨나요?
              </h1>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">목회 리포트</span>
              <div className="flex items-center gap-2 text-primary-600 font-bold">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                목양 스케줄 정상 진행
              </div>
            </div>
          </section>

          {/* Quick Stats / Insights Widget Area */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,82,204,0.04)] hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-primary-600" />
                <h3 className="text-xl font-bold text-slate-900">오늘의 인사이트</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Verse Widget nested here cleanly */}
                <div className="bg-slate-50 p-4 rounded-xl border border-transparent hover:border-primary-100 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                    <BookOpen className="h-5 w-5 text-primary-600" />
                  </div>
                  <p className="text-[11px] font-bold tracking-widest text-primary-700 uppercase mb-2">{TODAY_VERSE.title}</p>
                  <p className="text-sm font-semibold text-slate-800 mb-2 leading-relaxed">“{TODAY_VERSE.verse}”</p>
                  <span className="text-xs font-medium text-slate-500">{TODAY_VERSE.reference}</span>
                </div>

                {/* Insight Example */}
                <div className="bg-slate-50 p-4 rounded-xl border border-transparent hover:border-primary-100 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-[11px] font-bold tracking-widest text-emerald-700 uppercase mb-2">교인 동향 추이</p>
                  <p className="text-sm font-semibold text-slate-800 mb-2 leading-relaxed">이번 주 심방 예정 2곳이 등록되었습니다. 교육 부서 성장세가 뚜렷합니다.</p>
                  <span className="text-xs font-medium text-slate-500">2시간 전 분석완료</span>
                </div>

              </div>
            </div>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,82,204,0.04)] flex flex-col">
              <AlertCircle className="h-6 w-6 text-orange-500 mb-4" />
              <h4 className="text-xl font-bold mb-2">사역 메세지 초안</h4>
              <p className="text-sm text-slate-500 mb-6">스케줄을 기반으로 생성된 안내/공지 문자 초안을 바로 확인하고 복사하세요.</p>
              <button 
                onClick={handleCopyNotice}
                className="mt-auto flex items-center justify-center h-10 px-4 rounded-xl bg-primary-50 text-primary-700 font-bold hover:bg-primary-100 transition-colors"
                disabled={!!copyFeedback}
              >
                {copyFeedback ? <CheckCircle2 className="h-4 w-4 mr-1 text-primary-600" /> : <Copy className="h-4 w-4 mr-2" />}
                {copyFeedback || '메시지 복사하기'}
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,82,204,0.04)] flex flex-col">
              <ImageIcon className="h-6 w-6 text-primary-600 mb-4" />
              <h4 className="text-xl font-bold mb-2">설교 카드뉴스</h4>
              <p className="text-sm text-slate-500 mb-6">본문 말씀이나 설교를 자동으로 예쁜 소셜미디어 이미지로 생성합니다.</p>
              
              <button 
                onClick={handleCreateCardNews}
                className="mt-auto flex items-center justify-center h-10 px-4 rounded-xl bg-primary-600 text-white font-bold shadow-md shadow-primary-200 hover:bg-primary-700 transition-colors"
                disabled={!!imageFeedback}
              >
                {imageFeedback ? <CheckCircle2 className="h-4 w-4 mr-1 text-white" /> : <Sparkles className="h-4 w-4 mr-2" />}
                {imageFeedback || 'AI 이미지 생성'}
              </button>
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

      {/* Shared Modal Logic - Unchanged conceptually but keeping it clean */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedScheduleId ? '일정 수정' : '새 일정 추가'}>
        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">제목</label>
            <Input
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              placeholder="일정 제목을 입력하세요"
            />
          </div>
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
            <label className="mb-1 block text-sm font-medium text-slate-700">참여자 (콤마로 구분)</label>
            <Input
              value={formState.memberTags}
              onChange={(e) => setFormState({ ...formState, memberTags: e.target.value })}
              placeholder="예: 김성도, 이집사"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">메모</label>
            <Textarea
              rows={3}
              value={formState.memo}
              onChange={(e) => setFormState({ ...formState, memo: e.target.value })}
              placeholder="일정과 관련된 준비사항 등을 입력하세요"
            />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal} className="border-slate-200">취소</Button>
            <Button variant="primary" onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white">저장</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
`;

fs.writeFileSync(pageFile, content, 'utf8');
console.log('page.tsx successfully rewritten for CorpSync Bento Grid.');
