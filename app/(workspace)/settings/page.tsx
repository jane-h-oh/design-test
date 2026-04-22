const settingsSections = [
  'BibleTool 데이터 소스 버전 관리',
  'SermonAnalyst 기본 요약 길이',
  'ContentFactory 출력 톤과 템플릿',
  '교회별 포인트 컬러와 문체 설정',
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur">
        <p className="text-sm font-semibold text-primary">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">목회메이트 MCP 도구 설정</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          새 구조에서 설정은 도구의 동작 규칙과 브랜드 톤을 관리하는 곳으로 재정의했습니다.
        </p>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="space-y-3">
          {settingsSections.map((section) => (
            <div key={section} className="rounded-2xl border border-slate-100 px-4 py-4 text-sm text-slate-600">
              {section}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
