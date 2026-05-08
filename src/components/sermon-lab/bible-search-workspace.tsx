'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, ChevronLeft, ChevronRight, CornerDownLeft, ChevronDown, X } from 'lucide-react';
import type { BibleBookSummary, BibleVerseResult } from '@/mcp/types';

const SHORT: Record<string, string> = {
  '창세기': '창', '출애굽기': '출', '레위기': '레', '민수기': '민', '신명기': '신',
  '여호수아': '수', '사사기': '삿', '룻기': '룻', '사무엘상': '삼상', '사무엘하': '삼하',
  '열왕기상': '왕상', '열왕기하': '왕하', '역대상': '대상', '역대하': '대하', '에스라': '스',
  '느헤미야': '느', '에스더': '에', '욥기': '욥', '시편': '시', '잠언': '잠',
  '전도서': '전', '아가': '아', '이사야': '사', '예레미야': '렘', '예레미야애가': '애',
  '에스겔': '겔', '다니엘': '단', '호세아': '호', '요엘': '욜', '아모스': '암',
  '오바댜': '옵', '요나': '욘', '미가': '미', '나훔': '나', '하박국': '합',
  '스바냐': '습', '학개': '학', '스가랴': '슥', '말라기': '말',
  '마태복음': '마', '마가복음': '막', '누가복음': '눅', '요한복음': '요', '사도행전': '행',
  '로마서': '롬', '고린도전서': '고전', '고린도후서': '고후', '갈라디아서': '갈', '에베소서': '엡',
  '빌립보서': '빌', '골로새서': '골', '데살로니가전서': '살전', '데살로니가후서': '살후',
  '디모데전서': '딤전', '디모데후서': '딤후', '디도서': '딛', '빌레몬서': '몬',
  '히브리서': '히', '야고보서': '약', '베드로전서': '벧전', '베드로후서': '벧후',
  '요한일서': '요일', '요한이서': '요이', '요한삼서': '요삼', '유다서': '유', '요한계시록': '계',
};

export function BibleSearchWorkspace({ onInsertVerse }: { onInsertVerse?: (reference: string, text: string) => void }) {
  const [version, setVersion] = useState<'basic' | 'easy'>('basic');
  const [books, setBooks] = useState<BibleBookSummary[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [chapterVerses, setChapterVerses] = useState<BibleVerseResult[]>([]);
  const [isChapterLoading, setIsChapterLoading] = useState(false);
  
  // Navigation State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState<'book' | 'chapter'>('book');

  // Drag-select state
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedRange = useMemo(() => {
    if (dragStart === null || dragEnd === null) return [];
    const min = Math.min(dragStart, dragEnd);
    const max = Math.max(dragStart, dragEnd);
    return chapterVerses.filter(v => v.verse >= min && v.verse <= max);
  }, [dragStart, dragEnd, chapterVerses]);

  const clearSelection = useCallback(() => {
    setDragStart(null);
    setDragEnd(null);
    setIsDragging(false);
  }, []);

  const insertSelectedRange = useCallback(() => {
    if (!selectedRange.length || !onInsertVerse) return;
    if (selectedRange.length === 1) {
      onInsertVerse(selectedRange[0].reference, selectedRange[0].text);
    } else {
      const first = selectedRange[0];
      const last = selectedRange[selectedRange.length - 1];
      const refRange = `${first.bookName} ${first.chapter}:${first.verse}-${last.verse}`;
      const combinedText = selectedRange.map(v => `${v.verse} ${v.text}`).join(' ');
      onInsertVerse(refRange, combinedText);
    }
    clearSelection();
  }, [selectedRange, onInsertVerse, clearSelection]);

  // Load books
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/tools/bible/books?version=${version}`);
      const data = (await res.json()) as { books: BibleBookSummary[] };
      setBooks(data.books);
      if (!selectedBookId && data.books[42]) setSelectedBookId(data.books[42].id);
      else if (!selectedBookId && data.books[0]) setSelectedBookId(data.books[0].id);
    };
    void load();
  }, [version]);

  // Load verses
  useEffect(() => {
    if (!selectedBookId) return;
    const load = async () => {
      setIsChapterLoading(true);
      const res = await fetch(`/api/tools/bible/chapter?book=${selectedBookId}&chapter=${selectedChapter}&version=${version}`);
      const data = (await res.json()) as { verses: BibleVerseResult[] };
      setChapterVerses(data.verses);
      setIsChapterLoading(false);
    };
    void load();
  }, [selectedBookId, selectedChapter, version]);

  const selectedBook = useMemo(() => books.find(b => b.id === selectedBookId) ?? null, [books, selectedBookId]);
  const OT = useMemo(() => books.filter(b => b.testament === 'OT'), [books]);
  const NT = useMemo(() => books.filter(b => b.testament === 'NT'), [books]);

  const goToPrevChapter = () => { 
    if (selectedChapter > 1) {
      setSelectedChapter(c => c - 1); 
    } else {
      const currentIndex = books.findIndex(b => b.id === selectedBookId);
      if (currentIndex > 0) {
        const prevBook = books[currentIndex - 1];
        setSelectedBookId(prevBook.id);
        setSelectedChapter(prevBook.chapterCount);
      }
    }
  };

  const goToNextChapter = () => { 
    if (selectedBook && selectedChapter < selectedBook.chapterCount) {
      setSelectedChapter(c => c + 1); 
    } else {
      const currentIndex = books.findIndex(b => b.id === selectedBookId);
      if (currentIndex !== -1 && currentIndex < books.length - 1) {
        const nextBook = books[currentIndex + 1];
        setSelectedBookId(nextBook.id);
        setSelectedChapter(1);
      }
    }
  };

  const isFirstChapterOverall = books.length > 0 && selectedBookId === books[0]?.id && selectedChapter === 1;
  const isLastChapterOverall = books.length > 0 && selectedBookId === books[books.length - 1]?.id && !!selectedBook && selectedChapter === selectedBook.chapterCount;

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* ── TOP NAV BAR ─────────────────────────────── */}
      <div className="shrink-0 flex flex-col px-4 pt-4 pb-3 border-b border-slate-100 bg-white">
        
        {/* Version Toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-3">
          {(['basic', 'easy'] as const).map(v => (
            <button
              key={v}
              onClick={() => setVersion(v)}
              className={`flex-1 text-[13px] py-2 rounded-lg font-bold transition-all ${version === v ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {v === 'basic' ? '개역개정' : '쉬운 성경'}
            </button>
          ))}
        </div>

        {!isPickerOpen ? (
          <div className="flex items-center justify-between">
            <button 
              onClick={() => { setIsPickerOpen(true); setPickerTab('book'); }}
              className="flex items-center gap-1.5 text-[17px] font-bold text-slate-900 hover:text-primary transition-colors group"
            >
              {selectedBook?.koreanName} {selectedChapter}장
              <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            </button>
            <div className="flex items-center gap-0.5">
              <button 
                onClick={goToPrevChapter} 
                disabled={isFirstChapterOverall}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={goToNextChapter} 
                disabled={isLastChapterOverall}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h3 className="text-base font-bold text-slate-900">성경 찾기</h3>
            <button onClick={() => setIsPickerOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* ── CONTENT AREA ────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden bg-white">
        
        {/* VIEW MODE */}
        <div
          className={`absolute inset-0 flex flex-col transition-all duration-300 ${isPickerOpen ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}
          onMouseLeave={() => { if (isDragging) { /* keep selection, don't clear */ } }}
          onMouseUp={() => {
            if (isDragging) {
              setIsDragging(false);
              // if single verse just insert directly
              if (dragStart === dragEnd) {
                const v = chapterVerses.find(v => v.verse === dragStart);
                if (v) { onInsertVerse?.(v.reference, v.text); clearSelection(); }
              }
            }
          }}
        >
          {/* Verses Scroll Area */}
          <div className="flex-1 overflow-y-auto px-1 py-4 scrollbar-hide" style={{ userSelect: 'none' }}>
            {isChapterLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-300">
                <Loader2 className="h-7 w-7 animate-spin text-primary/30" />
                <p className="text-xs font-medium">말씀을 불러오는 중...</p>
              </div>
            ) : (
              <div className="space-y-1 pb-16">
                {chapterVerses.map(verse => {
                  const isInRange = selectedRange.some(v => v.verse === verse.verse);
                  const isRangeStart = selectedRange[0]?.verse === verse.verse;
                  const isRangeEnd = selectedRange[selectedRange.length - 1]?.verse === verse.verse;
                  return (
                    <div
                      key={verse.reference}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setDragStart(verse.verse);
                        setDragEnd(verse.verse);
                        setIsDragging(true);
                      }}
                      onMouseEnter={() => {
                        if (isDragging) setDragEnd(verse.verse);
                      }}
                      className={`flex gap-2 group cursor-pointer px-1.5 py-2.5 rounded-lg transition-colors select-none
                        ${isInRange
                          ? `bg-primary/10 ${isRangeStart ? 'rounded-t-xl' : ''} ${isRangeEnd ? 'rounded-b-xl' : ''}`
                          : 'hover:bg-slate-50'
                        }`}
                    >
                      <span className={`min-w-[20px] text-[12px] font-bold pt-[3px] text-right shrink-0 transition-colors ${isInRange ? 'text-primary' : 'text-slate-300 group-hover:text-primary/60'}`}>
                        {verse.verse}
                      </span>
                      <p className={`text-[15px] leading-relaxed flex-1 transition-colors ${isInRange ? 'text-slate-900 font-medium' : 'text-slate-700 group-hover:text-slate-900'}`}>
                        {verse.text}
                      </p>
                      {/* Always render to avoid layout shift on mousedown */}
                      <div className={`shrink-0 transition-opacity pt-1 pl-1 ${!isDragging && !selectedRange.length ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
                        <span className="p-1 rounded bg-white border border-slate-200 shadow-sm flex items-center text-slate-400">
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Floating Selection Action Bar */}
          {selectedRange.length > 1 && (
            <div className="absolute bottom-4 left-2 right-2 flex items-center gap-2 bg-slate-900 text-white rounded-2xl px-4 py-3 shadow-xl animate-in slide-in-from-bottom-2 duration-200">
              <span className="text-[13px] font-medium text-slate-300 flex-1">
                {selectedRange[0].bookName} {selectedRange[0].chapter}:{selectedRange[0].verse}–{selectedRange[selectedRange.length - 1].verse}
                <span className="ml-2 text-white font-bold">{selectedRange.length}절 선택됨</span>
              </span>
              <button
                onClick={clearSelection}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={insertSelectedRange}
                className="flex items-center gap-1.5 bg-white text-slate-900 text-[13px] font-bold px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
                한꺼번에 삽입
              </button>
            </div>
          )}
        </div>

        {/* PICKER MODE */}
        <div className={`absolute inset-0 flex flex-col bg-white transition-all duration-300 ${!isPickerOpen ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="flex px-4 pt-2 border-b border-slate-100 shrink-0">
            <button 
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${pickerTab === 'book' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              onClick={() => setPickerTab('book')}
            >
              성경 선택
            </button>
            <button 
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${pickerTab === 'chapter' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              onClick={() => setPickerTab('chapter')}
            >
              장 선택
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            {pickerTab === 'book' && (
              <div className="space-y-6 pb-6">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">구약</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {OT.map(book => (
                      <button key={book.id}
                        onClick={() => { setSelectedBookId(book.id); setPickerTab('chapter'); }}
                        className={`py-2.5 rounded-xl text-[13px] font-bold border transition-all ${selectedBookId === book.id ? 'bg-primary border-primary text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:border-slate-300'}`}
                      >
                        {SHORT[book.koreanName] || book.koreanName.slice(0, 2)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">신약</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {NT.map(book => (
                      <button key={book.id}
                        onClick={() => { setSelectedBookId(book.id); setPickerTab('chapter'); }}
                        className={`py-2.5 rounded-xl text-[13px] font-bold border transition-all ${selectedBookId === book.id ? 'bg-primary border-primary text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:border-slate-300'}`}
                      >
                        {SHORT[book.koreanName] || book.koreanName.slice(0, 2)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {pickerTab === 'chapter' && (
              <div className="grid grid-cols-5 gap-1.5 pb-6">
                {Array.from({ length: selectedBook?.chapterCount ?? 0 }, (_, i) => i + 1).map(ch => (
                  <button key={ch}
                    onClick={() => { setSelectedChapter(ch); setIsPickerOpen(false); }}
                    className={`py-3 rounded-xl text-[14px] font-bold border transition-all ${selectedChapter === ch ? 'bg-primary border-primary text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
