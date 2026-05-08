'use client';

import { useMemo, useState } from 'react';
import {
  Archive,
  BookOpenText,
  Download,
  FileText,
  History,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import { Button, Modal, Textarea } from '@/components/ui';

type VerseResult = {
  reference: string;
  text: string;
};

type ArchivedSermon = {
  id: string;
  date: string;
  title: string;
  content: string;
};

const VERSES: VerseResult[] = [
  {
    reference: '로마서 8:28',
    text: '하나님을 사랑하는 자들에게는 모든 것이 합력하여 선을 이룹니다.',
  },
  {
    reference: '요한복음 15:5',
    text: '주님 안에 거할 때 삶과 사역의 열매가 맺힙니다.',
  },
  {
    reference: '이사야 40:31',
    text: '여호와를 앙망하는 자는 새 힘을 얻습니다.',
  },
  {
    reference: '시편 23:1',
    text: '여호와는 나의 목자시니 내게 부족함이 없습니다.',
  },
];

const ARCHIVE_DATA: ArchivedSermon[] = [
  {
    id: '1',
    date: '2026.04.14',
    title: '하나님의 사랑과 확신',
    content:
      '하나님의 사랑은 조건에 따라 흔들리지 않습니다. 우리는 오늘의 불안보다 더 깊은 약속 위에 서 있습니다.',
  },
  {
    id: '2',
    date: '2026.04.07',
    title: '믿음으로 이기는 인생',
    content:
      '믿음은 현실을 외면하는 태도가 아니라, 하나님이 이미 일하고 계심을 붙드는 고백입니다.',
  },
  {
    id: '3',
    date: '2026.03.31',
    title: '성령의 열매를 맺는 삶',
    content:
      '성령의 열매는 한순간의 감정이 아니라 매일의 순종 속에서 조용히 자라나는 삶의 증거입니다.',
  },
];

export function SermonLabWorkspace() {
  const [sermonTitle, setSermonTitle] = useState('사랑 안에 거하는 공동체');
  const [sermonContent, setSermonContent] = useState(
    '본문: 요한복음 15장 5절\n\n도입\n우리는 많은 일을 계획하지만, 사역의 열매는 주님 안에 머무는 데서 시작됩니다.\n\n핵심 메시지\n1. 연결됨이 열매보다 먼저입니다.\n2. 말씀 안에 거할 때 방향이 선명해집니다.\n3. 공동체는 서로를 붙들어주는 은혜의 자리입니다.\n\n적용\n이번 주 한 사람에게 먼저 안부를 묻고, 함께 기도할 제목을 나누어보세요.'
  );
  const [query, setQuery] = useState('');
  const [selectedArchive, setSelectedArchive] = useState<ArchivedSermon | null>(null);

  const filteredVerses = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) return VERSES;
    return VERSES.filter(
      (verse) => verse.reference.includes(normalized) || verse.text.includes(normalized)
    );
  }, [query]);

  const insertVerse = (verse: VerseResult) => {
    setSermonContent((prev) => `${prev}\n\n${verse.reference} - ${verse.text}`);
  };

  const generateDraft = () => {
    setSermonContent((prev) =>
      `${prev}\n\nAI 초안 메모\n- 메시지의 중심을 '주님 안에 머무는 삶'으로 좁혀보세요.\n- 청중이 바로 실천할 수 있는 작은 적용을 마지막에 배치하면 좋습니다.\n- 공동체의 돌봄 사례를 하나 더하면 설교가 더 따뜻해집니다.`
    );
  };

  const loadArchive = (archive: ArchivedSermon) => {
    setSermonTitle(archive.title);
    setSermonContent(archive.content);
    setSelectedArchive(null);
  };

  return (
    <div className="grid min-h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[320px_1fr_320px]">
      <aside className="flex flex-col gap-4">
        <section className="rounded-polaris-lg border border-line-neutral bg-layer-surface p-5 shadow-polaris-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-polaris-md bg-accent-brand-bg text-accent-brand-normal">
              <BookOpenText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-polaris-heading4 text-label-normal">성경 구절</h2>
              <p className="text-polaris-caption1 text-label-assistive">정적 데모용 추천 본문</p>
            </div>
          </div>

          <label className="mb-4 flex h-11 items-center gap-2 rounded-polaris-sm border border-line-neutral bg-background-base px-3 text-label-neutral">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="구절 또는 키워드"
              className="w-full bg-transparent text-polaris-body2 outline-none placeholder:text-label-assistive"
            />
          </label>

          <div className="space-y-2">
            {filteredVerses.map((verse) => (
              <button
                key={verse.reference}
                onClick={() => insertVerse(verse)}
                className="w-full rounded-polaris-md border border-line-neutral bg-background-alternative p-3 text-left transition-colors hover:border-line-strong hover:bg-layer-surface"
              >
                <p className="text-polaris-caption1 font-bold text-accent-brand-normal">{verse.reference}</p>
                <p className="mt-1 text-polaris-body3 leading-relaxed text-label-neutral">{verse.text}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-polaris-lg border border-line-neutral bg-layer-surface p-5 shadow-polaris-sm">
          <h2 className="mb-4 flex items-center gap-2 text-polaris-heading4 text-label-normal">
            <History className="h-4 w-4 text-label-assistive" />
            과거 설교
          </h2>
          <div className="space-y-2">
            {ARCHIVE_DATA.map((archive) => (
              <button
                key={archive.id}
                onClick={() => setSelectedArchive(archive)}
                className="w-full rounded-polaris-sm border border-line-neutral bg-background-alternative p-3 text-left transition-colors hover:bg-interaction-hover"
              >
                <p className="text-polaris-caption1 font-bold text-label-assistive">{archive.date}</p>
                <p className="mt-1 text-polaris-body2 font-semibold text-label-normal">{archive.title}</p>
              </button>
            ))}
          </div>
        </section>
      </aside>

      <main className="flex min-h-[720px] flex-col rounded-polaris-lg border border-line-neutral bg-layer-surface p-6 shadow-polaris-sm">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <p className="mb-2 inline-flex items-center gap-2 rounded-polaris-pill bg-ai-hover px-3 py-1 text-polaris-caption1 font-bold text-ai-normal">
              <Sparkles className="h-3.5 w-3.5" />
              Sermon Lab
            </p>
            <input
              value={sermonTitle}
              onChange={(event) => setSermonTitle(event.target.value)}
              className="w-full bg-transparent text-polaris-title text-label-normal outline-none placeholder:text-label-assistive"
              placeholder="설교 제목"
            />
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" size="sm">
              <Archive className="h-4 w-4" />
              아카이브 저장
            </Button>
                    <Button variant="primary" size="sm">
              <Download className="h-4 w-4" />
              Word 저장
            </Button>
          </div>
        </div>

        <div className="flex-1 rounded-polaris-md border border-line-neutral bg-background-base p-5">
          <Textarea
            value={sermonContent}
            onChange={(event) => setSermonContent(event.target.value)}
            className="h-full min-h-[560px] border-0 bg-transparent p-0 text-polaris-body1 leading-8 shadow-none focus-visible:ring-0"
          />
        </div>
      </main>

      <aside className="flex flex-col gap-4">
        <section className="rounded-polaris-lg bg-accent-action-normal p-5 text-static-white shadow-polaris-md">
          <div className="mb-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-polaris-md bg-static-white/10">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-polaris-heading3">AI 초안 작성</h2>
            <p className="mt-2 text-polaris-body3 leading-relaxed text-static-white/70">
              현재 제목과 원고를 바탕으로 설교 흐름을 더 선명하게 정리합니다.
            </p>
          </div>
          <button
            onClick={generateDraft}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-polaris-sm bg-static-white text-polaris-body2 font-bold text-static-black"
          >
            <Plus className="h-4 w-4" />
            초안 메모 추가
          </button>
        </section>

        <section className="rounded-polaris-lg border border-line-neutral bg-layer-surface p-5 shadow-polaris-sm">
          <h2 className="mb-4 flex items-center gap-2 text-polaris-heading4 text-label-normal">
            <FileText className="h-4 w-4 text-label-assistive" />
            설교 구성 체크
          </h2>
          <div className="space-y-3">
            {['본문과 제목 연결', '핵심 메시지 1문장', '청중 적용점', '마무리 기도'].map((item) => (
              <label key={item} className="flex items-center gap-3 rounded-polaris-sm bg-background-alternative p-3">
                <input type="checkbox" className="h-4 w-4 accent-[var(--polaris-accent-brand-normal)]" defaultChecked={item !== '마무리 기도'} />
                <span className="text-polaris-body2 font-medium text-label-neutral">{item}</span>
              </label>
            ))}
          </div>
        </section>
      </aside>

      <Modal
        isOpen={!!selectedArchive}
        onClose={() => setSelectedArchive(null)}
        title="사역 아카이브 원고"
      >
        {selectedArchive && (
          <div className="grid gap-5">
            <div>
              <p className="text-polaris-caption1 font-bold text-label-assistive">{selectedArchive.date}</p>
              <h2 className="mt-1 text-polaris-heading2 text-label-normal">{selectedArchive.title}</h2>
            </div>
            <div className="max-h-96 overflow-y-auto rounded-polaris-md bg-background-alternative p-5">
              <p className="whitespace-pre-wrap text-polaris-body2 leading-relaxed text-label-neutral">
                {selectedArchive.content}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setSelectedArchive(null)}>
                닫기
              </Button>
              <Button onClick={() => loadArchive(selectedArchive)}>원고로 불러오기</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
