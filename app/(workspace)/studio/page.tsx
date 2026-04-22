import { StudioWorkflow } from '@/components/studio/studio-workflow';

export default function StudioPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur">
        <p className="text-sm font-semibold text-primary">Content Studio</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">MCP Tools가 이어주는 스테이지형 콘텐츠 제작 흐름</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          입력, 분석, 미리보기의 세 단계를 따라가며 설교 원고를 카드뉴스, QT, 나눔지로 변환합니다.
        </p>
      </section>

      <StudioWorkflow />
    </div>
  );
}
