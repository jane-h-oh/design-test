'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, UploadCloud } from 'lucide-react';
import type { ContentFactoryOutput, SermonAnalysis } from '@/mcp/types';

type Stage = 1 | 2 | 3;

const stageLabels = [
  { id: 1, title: 'Input', body: '원고 업로드 및 텍스트 입력' },
  { id: 2, title: 'Process', body: 'SermonAnalyst와 ContentFactory 실행' },
  { id: 3, title: 'Preview', body: '생성 결과 검토 및 편집' },
] as const;

export function StudioWorkflow() {
  const [stage, setStage] = useState<Stage>(1);
  const [manuscript, setManuscript] = useState('');
  const [mainVerse, setMainVerse] = useState('');
  const [analysis, setAnalysis] = useState<SermonAnalysis | null>(null);
  const [content, setContent] = useState<ContentFactoryOutput | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setManuscript(text);
  };

  const handleProcess = async () => {
    if (!manuscript.trim()) return;

    setStage(2);
    setIsBusy(true);

    const analysisResponse = await fetch('/api/tools/sermon/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manuscript }),
    });
    const nextAnalysis = (await analysisResponse.json()) as SermonAnalysis;
    setAnalysis(nextAnalysis);

    const contentResponse = await fetch('/api/tools/content/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manuscript, analysis: nextAnalysis, mainVerse }),
    });
    const nextContent = (await contentResponse.json()) as ContentFactoryOutput;
    setContent(nextContent);
    setIsBusy(false);
    setStage(3);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {stageLabels.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl px-4 py-4 ${
                stage === item.id ? 'bg-slate-950 text-white' : stage > item.id ? 'bg-[var(--color-primary-soft)] text-primary' : 'bg-slate-50 text-slate-400'
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em]">{item.title}</p>
              <p className="mt-2 text-base font-semibold">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {stage === 1 ? (
        <section className="rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-6">
            <div className="rounded-[28px] border border-dashed border-[#bed2ff] bg-[var(--color-primary-soft)] p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">Stage 1</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">원고를 먼저 모읍니다</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">텍스트 붙여넣기 또는 `.txt` 업로드로 시작할 수 있습니다.</p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white">
                  <UploadCloud className="h-4 w-4" />
                  원고 업로드
                  <input type="file" accept=".txt,.md" onChange={handleUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
              <div className="rounded-[28px] border border-slate-100 p-5">
                <label className="text-sm font-medium text-slate-600">메인 구절</label>
                <input
                  value={mainVerse}
                  onChange={(event) => setMainVerse(event.target.value)}
                  placeholder="예: 요한복음 3:16"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#bed2ff] focus:ring-4 focus:ring-[#edf3ff]"
                />
              </div>

              <div className="rounded-[28px] border border-slate-100 p-5">
                <label className="text-sm font-medium text-slate-600">설교 원고</label>
                <textarea
                  value={manuscript}
                  onChange={(event) => setManuscript(event.target.value)}
                  placeholder="주일 설교 원고, 소그룹 나눔용 메시지, 카드뉴스로 바꾸고 싶은 초안을 입력해 주세요."
                  rows={16}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm leading-6 outline-none transition focus:border-[#bed2ff] focus:ring-4 focus:ring-[#edf3ff]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => void handleProcess()}
                disabled={!manuscript.trim()}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Sparkles className="h-4 w-4" />
                분석 시작
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {stage === 2 ? (
        <section className="rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col items-center justify-center gap-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-soft)]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Stage 2</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">MCP Tools가 원고를 분석하는 중입니다</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                SermonAnalyst가 요약과 주제를 정리하고, ContentFactory가 카드뉴스와 QT, 나눔지 구조를 생성하고 있습니다.
              </p>
            </div>

            <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
              {['SermonAnalyst', 'ContentFactory', 'Preview Assembly'].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-100 p-5">
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 w-2/3 animate-pulse rounded-full bg-primary" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-900">{item}</p>
                  <p className="mt-1 text-sm text-slate-500">컨텍스트를 다듬고 결과를 구조화하는 단계입니다.</p>
                </div>
              ))}
            </div>

            {!isBusy ? (
              <button
                onClick={() => setStage(3)}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                결과 보기
              </button>
            ) : null}
          </div>
        </section>
      ) : null}

      {stage === 3 && content ? (
        <section className="space-y-6">
          <div className="flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Stage 3</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">생성된 콘텐츠를 편집하고 공유합니다</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{analysis?.summary}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStage(1)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600">
                다시 편집
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(content, null, 2))}
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white"
              >
                결과 복사
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <article className="rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-primary">카드뉴스 JSON</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">{content.cardNews.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{content.cardNews.subtitle}</p>
              <div className="mt-5 space-y-3">
                {content.cardNews.slides.map((slide) => (
                  <div key={slide} className="rounded-2xl bg-[var(--color-primary-soft)] p-4 text-sm leading-6 text-[var(--color-primary-deep)]">
                    {slide}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-primary">QT 질문</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">{content.qt.scripture}</h3>
              <div className="mt-5 space-y-3">
                {content.qt.reflectionQuestions.map((question) => (
                  <div key={question} className="rounded-2xl border border-slate-100 p-4 text-sm leading-6 text-slate-600">
                    {question}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-200">{content.qt.prayer}</div>
            </article>

            <article className="rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
              <p className="text-sm font-semibold text-primary">나눔지</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">{content.sharingNote.headline}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">{content.sharingNote.body}</p>
              <div className="mt-6 rounded-2xl border border-dashed border-[#bed2ff] bg-[var(--color-primary-soft)] p-4 text-sm leading-6 text-[var(--color-primary-deep)]">
                {content.sharingNote.actionPrompt}
              </div>
            </article>
          </div>
        </section>
      ) : null}
    </div>
  );
}
