const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app/(workspace)/dashboard/page.tsx');
let code = fs.readFileSync(pageFile, 'utf8');

// 1. Add missing import for buildMessageScript
if (!code.includes('buildMessageScript')) {
  code = code.replace(
    /CATEGORY_LABEL,\n  STATUS_LABEL,\n} from '@\/types\/ministry';/,
    `CATEGORY_LABEL,\n  STATUS_LABEL,\n  buildMessageScript\n} from '@/types/ministry';`
  );
}

// 2. Remove "목회 리포트..." Hero Badge entirely.
code = code.replace(
  /<div className="flex flex-col items-end gap-1">\s*<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">목회 리포트<\/span>\s*<div className="flex items-center gap-2 text-primary-600 font-bold">\s*<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" \/>\s*목양 스케줄 정상 진행\s*<\/div>\s*<\/div>/,
  ''
);

// 3. Replace Verse Widget with a beautiful Visual Card
const verseRegex = /<div className="bg-slate-50 p-4 rounded-xl border border-transparent hover:border-primary-100 transition-all cursor-pointer">[\s\S]*?<\/div>/;
const verseReplacement = `
                <div className="relative p-6 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-end min-h-[160px] group cursor-pointer hover:shadow-md transition-all">
                  <img src="/verse_card_bg.png" alt="verse background" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="relative z-10 text-white">
                    <p className="text-[10px] font-bold tracking-widest text-primary-200 uppercase mb-1">{TODAY_VERSE.title}</p>
                    <p className="text-sm font-semibold mb-1 leading-relaxed text-slate-50">“{TODAY_VERSE.verse}”</p>
                    <span className="text-xs font-medium text-slate-300">{TODAY_VERSE.reference}</span>
                  </div>
                </div>
`;
// Replace only the first instance inside Quick Stats
code = code.replace(
  /\{\/\* Verse Widget nested here cleanly \*\/\}\s*<div className="bg-slate-50 p-4 rounded-xl border border-transparent hover:border-primary-100 transition-all cursor-pointer">[\s\S]*?<\/div>/,
  `{/* Image-backed Verse Widget */}${verseReplacement}`
);

// 4. Replace Action Cards Grid with the AI Action Quick Card from user's feedback
const actionCardsRegex = /\{\/\* Action Cards Grid \*\/\}\s*<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Right Column \(Schedule Widget Map\) \*\/\}/;
const actionReplacement = `
          {/* AI Task Recommendation List */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,82,204,0.04)] border border-primary-50">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary-600" />
                <h4 className="text-xl font-bold">AI 액션 퀵 카드</h4>
              </div>
              <p className="text-sm text-slate-500 mb-6">최근 일정을 분석하여 목사님이 지금 수행해야 할 가장 중요한 안내/공지를 자동으로 초안으로 제안합니다.</p>
              
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">메시지 변환 제안</span>
                  <ImageIcon className="h-4 w-4 text-slate-400" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 whitespace-pre-line text-sm text-slate-700 mb-4 font-medium leading-relaxed">
                  {buildMessageScript(schedules.find(s => s.status === 'preparing') || schedules[0])}
                </div>
                
                <button 
                  onClick={handleCopyNotice}
                  className="flex items-center justify-center w-full h-11 rounded-lg bg-primary-50 text-primary-700 font-bold hover:bg-primary-100 transition-colors"
                  disabled={!!copyFeedback}
                >
                  {copyFeedback ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copyFeedback || '교회 카카오톡 공지문 바로 복사하기'}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Schedule Widget Map) */}`;

code = code.replace(actionCardsRegex, actionReplacement);

fs.writeFileSync(pageFile, code, 'utf8');
console.log('User feedback updates applied.');
