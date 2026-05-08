'use client';

import { useState, useRef } from 'react';
import { Heart, BookMarked, Music, Feather, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input, Modal, Textarea } from '@/components/ui';
import { Select } from '@/components/ui/Select';
import { ScheduleWidget } from '@/components/dashboard/ScheduleWidget';
import {
  MinistryCategory,
  MinistryStatus,
  ScheduleItem,
  ScheduleFormState,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
} from '@/types/ministry';

// ── Schedule data ─────────────────────────────────────────────
const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: 'morning-prayer',
    title: '새벽 기도회 인도',
    startAt: '2026-04-23T05:00',
    endAt: '2026-04-23T06:30',
    category: 'worship',
    members: ['전교인'],
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
    members: ['목사님'],
    memo: '본문 묵상 및 대지 설정',
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
    memo: '5월 사역 일정 및 행사 점검',
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
    memo: '최근 건강 이슈와 자녀 진학 고민을 중심으로 기도 제목을 정리합니다.',
    status: 'preparing',
    aiNote: '',
    keywords: ['심방', '위로'],
  },
  {
    id: 'youth-study',
    title: '청년부 리더 성경공부',
    startAt: '2026-04-23T19:00',
    endAt: '2026-04-23T20:30',
    category: 'education',
    members: ['청년부 리더'],
    memo: '로마서 8장 깊이 읽기',
    status: 'preparing',
    aiNote: '',
    keywords: ['성경공부', '리더양육'],
  },
];

// ── Prayer types ──────────────────────────────────────────────
interface PrayerItem {
  id: string;
  name: string;
  tag: string;
  tagBg: string;
  tagText: string;
  prayer: string;
}

const TAG_OPTIONS = [
  { label: '회복', bg: 'bg-[#F2FFF6]', text: 'text-[#009632] ring-1 ring-inset ring-[#ACFCC7]' }, // Green
  { label: '진로', bg: 'bg-[#F7FBFF]', text: 'text-[#0054D1] ring-1 ring-inset ring-[#C9DEFE]' }, // Blue
  { label: '사업', bg: 'bg-[#FFFCF7]', text: 'text-[#D47800] ring-1 ring-inset ring-[#FEE6C6]' }, // Orange
  { label: '가정', bg: 'bg-[#FFFAFA]', text: 'text-[#E52222] ring-1 ring-inset ring-[#FED5D5]' }, // Red
  { label: '믿음', bg: 'bg-[#FFFAF7]', text: 'text-[#D94B00] ring-1 ring-inset ring-[#FED9C4]' }, // Red Orange
  { label: '기타', bg: 'bg-[#F7F7F7]', text: 'text-[#5C5C5C] ring-1 ring-inset ring-[#C4C4C4]' }, // Neutral
];

const INITIAL_PRAYERS: PrayerItem[] = [
  { id: 'p1', name: '김성도 성도님', tag: '회복', tagBg: 'bg-[#F2FFF6]', tagText: 'text-[#009632] ring-1 ring-inset ring-[#ACFCC7]', prayer: '최근 위장 수술 후 회복 중입니다. 빠른 쾌유와 가정의 평안을 위해.' },
  { id: 'p2', name: '이청년 형제', tag: '진로', tagBg: 'bg-[#F7FBFF]', tagText: 'text-[#0054D1] ring-1 ring-inset ring-[#C9DEFE]', prayer: '상반기 취업 준비 중입니다. 지치지 않는 믿음과 열린 길을 위해.' },
  { id: 'p3', name: '박집사 가정', tag: '사업', tagBg: 'bg-[#FFFCF7]', tagText: 'text-[#D47800] ring-1 ring-inset ring-[#FEE6C6]', prayer: '새 사업터에 주님의 인도하심과 정직한 일터를 위해.' },
  { id: 'p4', name: '최권사님', tag: '가정', tagBg: 'bg-[#FFFAFA]', tagText: 'text-[#E52222] ring-1 ring-inset ring-[#FED5D5]', prayer: '자녀들의 신앙 회복과 멀리 있는 손주들의 건강을 위해 기도합니다.' },
  { id: 'p5', name: '한성도 성도님', tag: '믿음', tagBg: 'bg-[#FFFAF7]', tagText: 'text-[#D94B00] ring-1 ring-inset ring-[#FED9C4]', prayer: '초신자로서 신앙의 뿌리가 깊게 내려지고 교회 생활에 잘 적응하도록.' },
  { id: 'p6', name: '선교사 김바울', tag: '기타', tagBg: 'bg-[#F7F7F7]', tagText: 'text-[#5C5C5C] ring-1 ring-inset ring-[#C4C4C4]', prayer: '현지 사역지의 안전과 비자 연장 문제가 순조롭게 해결되기를.' },
];

// ── Utils ─────────────────────────────────────────────────────
function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function createEmptyForm(date?: Date): ScheduleFormState {
  const base = date ?? new Date('2026-04-23T09:00:00');
  const start = new Date(base); start.setMinutes(0,0,0);
  const end = new Date(start); end.setHours(end.getHours()+1);
  return { title:'', startAt: toDatetimeLocal(start), endAt: toDatetimeLocal(end), category:'care', memberTags:'', memo:'', status:'preparing', keywordTags: '' };
}

// ── Component ─────────────────────────────────────────────────
export default function DashboardPage() {
  // Schedule modal state
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date('2026-04-23T09:00:00'));
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ScheduleFormState>(createEmptyForm());

  // Prayer state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [prayers, setPrayers] = useState<PrayerItem[]>(INITIAL_PRAYERS);
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [editingPrayerId, setEditingPrayerId] = useState<string | null>(null);
  const [newPrayerName, setNewPrayerName] = useState('');
  const [newPrayerTag, setNewPrayerTag] = useState(TAG_OPTIONS[0].label);
  const [newPrayerText, setNewPrayerText] = useState('');

  // Hero confession

  // Schedule handlers
  function openNewSchedule(date?: Date) {
    setSelectedScheduleId(null);
    setFormState(createEmptyForm(date ?? selectedDate));
    setIsScheduleModalOpen(true);
  }
  function openEditSchedule(s: ScheduleItem) {
    setSelectedScheduleId(s.id);
    setFormState({ id:s.id, title:s.title, startAt:s.startAt, endAt:s.endAt??'', category:s.category, memberTags:s.members.join(', '), memo:s.memo, status:s.status, keywordTags: (s.keywords || []).join(', ') });
    setIsScheduleModalOpen(true);
  }
  function closeScheduleModal() { setIsScheduleModalOpen(false); setSelectedScheduleId(null); }
  function handleScheduleSave() {
    if (!formState.title.trim()) { alert('제목을 입력해주세요.'); return; }
    const members = formState.memberTags.split(',').map(s=>s.trim()).filter(Boolean);
    const keywords = formState.keywordTags.split(',').map(s=>s.trim()).filter(Boolean);
    if (selectedScheduleId) {
      setSchedules(prev => prev.map(s => s.id===selectedScheduleId ? {...s,...formState,members,keywords,aiNote:s.aiNote} : s));
    } else {
      setSchedules(prev => [...prev, {...formState, id:Math.random().toString(36).slice(2,9), members, keywords, aiNote:''}]);
    }
    closeScheduleModal();
  }

  // Prayer handlers
  function openPrayerModal() {
    setEditingPrayerId(null);
    setNewPrayerName('');
    setNewPrayerTag(TAG_OPTIONS[0].label);
    setNewPrayerText('');
    setIsPrayerModalOpen(true);
  }
  function openEditPrayer(p: PrayerItem) {
    setEditingPrayerId(p.id);
    setNewPrayerName(p.name);
    setNewPrayerTag(p.tag);
    setNewPrayerText(p.prayer);
    setIsPrayerModalOpen(true);
  }
  function savePrayer() {
    if (!newPrayerName.trim() || !newPrayerText.trim()) { alert('이름과 기도제목을 입력해주세요.'); return; }
    const tagOpt = TAG_OPTIONS.find(t => t.label === newPrayerTag) ?? TAG_OPTIONS[0];
    if (editingPrayerId) {
      setPrayers(prev => prev.map(p => p.id === editingPrayerId ? { ...p, name: newPrayerName.trim(), tag: tagOpt.label, tagBg: tagOpt.bg, tagText: tagOpt.text, prayer: newPrayerText.trim() } : p));
    } else {
      setPrayers(prev => [...prev, { id: Math.random().toString(36).slice(2, 9), name: newPrayerName.trim(), tag: tagOpt.label, tagBg: tagOpt.bg, tagText: tagOpt.text, prayer: newPrayerText.trim() }]);
    }
    setIsPrayerModalOpen(false);
  }
  function removePrayer(id: string) {
    if (window.confirm('삭제하시겠습니까?')) {
      setPrayers(prev => prev.filter(p => p.id !== id));
    }
  }

  const scrollPrayers = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 236 : scrollLeft + 236; // Card width(220) + gap(16)
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-full pb-24 font-sans">
      {/* 7:5 grid — schedule gets more room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LEFT (7 cols) ─────────────────────────────────── */}
        <div className="lg:col-span-7 flex flex-col gap-6">


          {/* INSPIRATION */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-600">
                <BookMarked className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">오늘의 영감 큐레이션</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="pt-0 md:pr-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-500 flex items-center gap-2 mb-4">
                  <Music className="h-3.5 w-3.5" /> 추천 찬양
                </p>
                <p className="text-xs text-slate-500 font-medium mb-1">찬송가 302장</p>
                <p className="text-xl font-semibold text-slate-900 leading-tight tracking-tight mb-3">
                  내 주 하나님<br />넓고 큰 은혜는
                </p>
                <p className="text-sm text-slate-600 font-normal leading-relaxed">
                  바다처럼 깊고 넓은 은혜의 말씀을 온전히 의지하는 삶과 깊이 연결됩니다.
                </p>
              </div>
              <div className="pt-8 md:pt-0 md:pl-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                  <Feather className="h-3.5 w-3.5" /> 예화 한 조각
                </p>
                <p className="text-lg font-semibold text-slate-800 leading-relaxed">
                  "작은 등불은 방 전체를 한 번에 밝힐 수는 없지만, 발이 내딛을 다음 걸음은 언제나 확실히 비춰줍니다."
                </p>
                <p className="text-sm text-slate-500 font-normal leading-relaxed mt-3">
                  말씀이 우리의 걸음을 비추는 원리도 이와 같습니다.
                </p>
              </div>
            </div>
          </div>

          {/* PRAYER LIST — horizontal scroll + add modal */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-rose-100 text-rose-500">
                  <Heart className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">성도들을 위한 기도</h3>
                <span className="text-xs font-semibold text-slate-400">{prayers.length}명</span>
              </div>
              <button
                onClick={openPrayerModal}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> 기도제목 추가
              </button>
            </div>

            {/* Horizontal swipe scroll */}
            <div className="relative group/slider">
              <button 
                onClick={() => scrollPrayers('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all opacity-0 group-hover/slider:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div 
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-1" 
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {prayers.map((prayerItem) => (
                  <div
                    key={prayerItem.id}
                    className="bg-slate-50 hover:bg-slate-100/80 rounded-xl p-5 transition-all cursor-pointer group relative flex-shrink-0 border border-slate-100"
                    style={{ width: '220px', scrollSnapAlign: 'start' }}
                  >
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditPrayer(prayerItem); }}
                        className="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-700 text-slate-400 flex items-center justify-center transition-colors shadow-sm"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removePrayer(prayerItem.id); }}
                        className="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 text-slate-400 flex items-center justify-center transition-colors shadow-sm"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold mb-3 ${prayerItem.tagBg} ${prayerItem.tagText}`}>{prayerItem.tag}</span>
                    <p className="text-base font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{prayerItem.name}</p>
                    <p className="text-sm text-slate-500 font-normal leading-relaxed line-clamp-3">{prayerItem.prayer}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => scrollPrayers('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all opacity-0 group-hover/slider:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>

        {/* ── RIGHT (5 cols — wider schedule) ──────────────── */}
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

      {/* ── SCHEDULE MODAL ───────────────────────────────────── */}
      <Modal isOpen={isScheduleModalOpen} onClose={closeScheduleModal} title={selectedScheduleId ? '일정 수정' : '새 일정 추가'}>
        <div className="grid gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">제목</label>
            <Input value={formState.title} onChange={e=>setFormState({...formState,title:e.target.value})} placeholder="일정 제목을 입력하세요" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">시작</label>
              <Input type="datetime-local" value={formState.startAt} onChange={e=>setFormState({...formState,startAt:e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">종료</label>
              <Input type="datetime-local" value={formState.endAt} onChange={e=>setFormState({...formState,endAt:e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">분류</label>
              <Select value={formState.category} onChange={e=>setFormState({...formState,category:e.target.value as MinistryCategory})} options={CATEGORY_OPTIONS} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">상태</label>
              <Select value={formState.status} onChange={e=>setFormState({...formState,status:e.target.value as MinistryStatus})} options={STATUS_OPTIONS} />
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">참여자</label>
                <Input value={formState.memberTags} onChange={e=>setFormState({...formState,memberTags:e.target.value})} placeholder="예: 김성도, 이집사" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">키워드</label>
                <Input value={formState.keywordTags} onChange={e=>setFormState({...formState,keywordTags:e.target.value})} placeholder="예: 심방, 격려" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">메모</label>
            <Textarea rows={3} value={formState.memo} onChange={e=>setFormState({...formState,memo:e.target.value})} placeholder="준비사항이나 기도제목을 기록하세요" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={closeScheduleModal} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">취소</button>
            <button onClick={handleScheduleSave}
              className="px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #3B6EFF, #7C3AED)' }}>
              저장
            </button>
          </div>
        </div>
      </Modal>

      {/* ── PRAYER ADD MODAL ─────────────────────────────────── */}
      <Modal isOpen={isPrayerModalOpen} onClose={() => setIsPrayerModalOpen(false)} title={editingPrayerId ? '기도제목 수정' : '기도제목 추가'}>
        <div className="grid gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">성도 이름</label>
            <Input value={newPrayerName} onChange={e=>setNewPrayerName(e.target.value)} placeholder="예: 김성도 성도님" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">분류 태그</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TAG_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setNewPrayerTag(opt.label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border-2 ${opt.bg} ${opt.text} ${newPrayerTag === opt.label ? 'border-primary-400 shadow-sm scale-105' : 'border-transparent'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">기도 내용</label>
            <Textarea rows={4} value={newPrayerText} onChange={e=>setNewPrayerText(e.target.value)} placeholder="기도가 필요한 상황이나 구체적인 기도제목을 적어주세요." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsPrayerModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">취소</button>
            <button onClick={savePrayer}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              {editingPrayerId ? '수정 내용 저장' : '기도제목 등록'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
