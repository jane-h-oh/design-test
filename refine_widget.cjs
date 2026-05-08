const fs = require('fs');
const path = require('path');

const widgetFile = path.join(__dirname, 'src/components/dashboard/ScheduleWidget.tsx');
let code = fs.readFileSync(widgetFile, 'utf8');

// Imports
code = code.replace(
  /import { ScheduleItem, WEEKDAYS, CATEGORY_TONE } from '@\/types\/ministry';/,
  `import { ScheduleItem, WEEKDAYS, CATEGORY_TONE, STATUS_LABEL } from '@/types/ministry';`
);

// Container background
code = code.replace(
  /className="bg-white rounded-2xl p-6 shadow-\[0_4px_20px_rgba\(0,82,204,0\.04\)\] h-full flex flex-col"/,
  'className="bg-[#fdfbf7] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full flex flex-col"'
);

// Status Label Korean Fix
code = code.replace(
  /<span className="text-\[10px\] font-bold text-primary-600 uppercase tracking-widest">\{schedule\.status\}<\/span>/,
  '<span className="text-[10px] font-bold text-primary-600 tracking-widest">{STATUS_LABEL[schedule.status]}</span>'
);

// Empty state image
const emptyStateRegex = /<div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl p-6">[\s\S]*?<\/div>/;
code = code.replace(
  emptyStateRegex,
  `<div className="flex-1 relative flex items-center justify-center rounded-xl p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-40 mix-blend-multiply">
              <img src="/empty_state_bg.png" alt="고요한 주님의 평안" className="w-full h-full object-cover" />
            </div>
            <div className="relative text-center z-10">
              <p className="text-sm text-slate-500 font-medium leading-relaxed">잠시 주님과 머무르는 시간입니다.<br/>평안을 누리세요.</p>
            </div>
          </div>`
);

// Add event button
code = code.replace(
  /<button\s+onClick=\{\(\) => onAddEvent\(selectedDate\)\}\s+className="w-full mt-auto py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-bold hover:border-primary-200 hover:text-primary-500 transition-all flex items-center justify-center gap-2"\s*>[\s\S]*?<\/button>/,
  `<button 
        onClick={() => onAddEvent(selectedDate)}
        className="w-full mt-auto py-3 text-primary-700 text-sm font-semibold hover:bg-primary-50 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        새로운 일정 기록하기
      </button>`
);

fs.writeFileSync(widgetFile, code, 'utf8');
console.log('ScheduleWidget Updated');
