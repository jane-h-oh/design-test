const archiveCards = [
  {
    title: '설교 초안 라이브러리',
    body: 'SermonAnalyst 결과와 함께 날짜별 원고 초안을 보관하는 자리입니다.',
  },
  {
    title: '콘텐츠 배포 히스토리',
    body: 'ContentFactory가 만든 카드뉴스와 나눔지 버전을 아카이브합니다.',
  },
  {
    title: '절기별 패턴 보관함',
    body: '캘린더, 절기 가이드, 설교 주제의 반복 패턴을 다시 불러올 수 있습니다.',
  },
];

export default function ArchivePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur">
        <p className="text-sm font-semibold text-primary">Archive</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">사역 결과물을 조용히 쌓아두는 아카이브</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          현재는 새 MCP 아키텍처에 맞춘 정보 구조를 우선 배치했고, 이후 실제 저장소와 연결하기 좋게 카테고리를 정리했습니다.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {archiveCards.map((card) => (
          <section key={card.title} className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
            <h2 className="text-xl font-semibold text-slate-950">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{card.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
