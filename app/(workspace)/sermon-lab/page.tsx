import { BibleSearchWorkspace } from '@/components/sermon-lab/bible-search-workspace';

export default function SermonLabPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur">
        <p className="text-sm font-semibold text-primary">Sermon Lab</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">BibleTool을 중심으로 시작하는 설교 연구소</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          첫 구현 우선순위인 BibleTool 인터페이스를 실제 데이터와 연결했습니다. 프론트는 검색어와 탐색 요청만 보내고,
          구절 검색과 장 조회는 MCP Tool API가 처리합니다.
        </p>
      </section>

      <BibleSearchWorkspace />
    </div>
  );
}
