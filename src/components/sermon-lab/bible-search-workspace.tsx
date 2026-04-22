'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import type { BibleBookSummary, BibleSearchOutput, BibleVerseResult } from '@/mcp/types';

const quickQueries = ['요한복음 3:16', '사랑', '소망', '시편 23:1'];

export function BibleSearchWorkspace() {
  const [books, setBooks] = useState<BibleBookSummary[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [chapterVerses, setChapterVerses] = useState<BibleVerseResult[]>([]);
  const [query, setQuery] = useState('요한복음 3:16');
  const [searchResults, setSearchResults] = useState<BibleSearchOutput | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isChapterLoading, setIsChapterLoading] = useState(false);

  useEffect(() => {
    const loadBooks = async () => {
      const response = await fetch('/api/tools/bible/books');
      const data = (await response.json()) as { books: BibleBookSummary[] };
      setBooks(data.books);

      if (data.books[42]) {
        setSelectedBookId(data.books[42].id);
      } else if (data.books[0]) {
        setSelectedBookId(data.books[0].id);
      }
    };

    void loadBooks();
  }, []);

  useEffect(() => {
    if (!selectedBookId) return;

    const loadChapter = async () => {
      setIsChapterLoading(true);
      const response = await fetch(`/api/tools/bible/chapter?book=${selectedBookId}&chapter=${selectedChapter}`);
      const data = (await response.json()) as { verses: BibleVerseResult[] };
      setChapterVerses(data.verses);
      setIsChapterLoading(false);
    };

    void loadChapter();
  }, [selectedBookId, selectedChapter]);

  useEffect(() => {
    if (!query.trim()) return;
    void handleSearch(query);
  }, []);

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? null,
    [books, selectedBookId]
  );

  const groupedBooks = useMemo(
    () => ({
      oldTestament: books.filter((book) => book.testament === 'OT'),
      newTestament: books.filter((book) => book.testament === 'NT'),
    }),
    [books]
  );

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const response = await fetch(`/api/tools/bible/search?q=${encodeURIComponent(searchQuery)}&limit=30`);
    const data = (await response.json()) as BibleSearchOutput;
    setSearchResults(data);
    setIsSearching(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.2fr)]">
      <section className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">BibleTool Interface</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">실제 `bible.json`을 읽는 검색 컨테이너</h2>
          </div>

          <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
            <label className="text-sm font-medium text-slate-600">구절 검색</label>
            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      void handleSearch();
                    }
                  }}
                  placeholder="예: 요한복음 3:16 또는 사랑"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#bed2ff] focus:ring-4 focus:ring-[#edf3ff]"
                />
              </div>
              <button
                onClick={() => void handleSearch()}
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white"
              >
                검색
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {quickQueries.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setQuery(item);
                    void handleSearch(item);
                  }}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">검색 결과</p>
                <p className="mt-1 text-xs text-slate-500">모드: {searchResults?.mode ?? 'keyword'}</p>
              </div>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : null}
            </div>

            <div className="mt-4 space-y-3">
              {searchResults?.results?.length ? (
                searchResults.results.map((verse) => (
                  <article key={verse.reference} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <p className="text-sm font-semibold text-primary">{verse.reference}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{verse.text}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm leading-6 text-slate-400">
                  검색 결과가 여기에 표시됩니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Chapter Explorer</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                {selectedBook ? `${selectedBook.koreanName} ${selectedChapter}장` : '책을 고르는 중'}
              </h2>
            </div>
            {selectedBook ? (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {Array.from({ length: selectedBook.chapterCount }, (_, index) => index + 1)
                  .slice(0, 30)
                  .map((chapter) => (
                    <button
                      key={chapter}
                      onClick={() => setSelectedChapter(chapter)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        chapter === selectedChapter ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {chapter}
                    </button>
                  ))}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Old Testament</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {groupedBooks.oldTestament.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => {
                      setSelectedBookId(book.id);
                      setSelectedChapter(1);
                    }}
                    className={`rounded-2xl px-3 py-2 text-left text-sm ${
                      selectedBookId === book.id ? 'bg-[var(--color-primary-soft)] text-primary' : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    {book.koreanName}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">New Testament</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {groupedBooks.newTestament.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => {
                      setSelectedBookId(book.id);
                      setSelectedChapter(1);
                    }}
                    className={`rounded-2xl px-3 py-2 text-left text-sm ${
                      selectedBookId === book.id ? 'bg-[var(--color-primary-soft)] text-primary' : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    {book.koreanName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-4">
            {isChapterLoading ? (
              <div className="flex min-h-[240px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-3">
                {chapterVerses.map((verse) => (
                  <article key={verse.reference} className="flex gap-4 rounded-2xl bg-white p-4">
                    <span className="min-w-8 text-sm font-semibold text-primary">{verse.verse}</span>
                    <p className="text-sm leading-6 text-slate-600">{verse.text}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
