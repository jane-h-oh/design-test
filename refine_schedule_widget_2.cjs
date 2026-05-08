const fs = require('fs');
const path = require('path');

const widgetFile = path.join(__dirname, 'src/components/dashboard/ScheduleWidget.tsx');
let code = fs.readFileSync(widgetFile, 'utf8');

// 1. Remove MoreHorizontal menu
code = code.replace(
  /<button className="text-slate-400 hover:text-slate-600 transition-colors hidden lg:block">\s*<MoreHorizontal className="h-5 w-5" \/>\s*<\/button>/,
  ''
);

// 2. Change Button text to "+ 새로운 사역 기록하기"
code = code.replace(
  /새로운 일정 기록하기/,
  '새로운 사역 기록하기'
);

// 3. Ensure the active date highlight is a crisp blue circle instead of a rounded-xl box
code = code.replace(
  /"p-2 flex flex-col items-center gap-1 rounded-xl transition-all cursor-pointer relative",/,
  '"p-2 flex flex-col items-center gap-1 rounded-full transition-all cursor-pointer relative w-10 h-10 justify-center mx-auto",'
);

// 4. Remove borders, enforce shadow-sm
code = code.replace(
  /bg-\[\#fdfbf7\] rounded-2xl p-6 shadow-\[0_4px_20px_rgba\(0,0,0,0\.02\)\]/,
  'bg-[#fdfbf7] rounded-2xl p-6 shadow-sm border-transparent'
);

fs.writeFileSync(widgetFile, code, 'utf8');
console.log('ScheduleWidget Updated');
