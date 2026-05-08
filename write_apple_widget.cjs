const fs = require('fs');
const path = require('path');

const widgetFile = path.join(__dirname, 'src/components/dashboard/ScheduleWidget.tsx');
let code = fs.readFileSync(widgetFile, 'utf8');

// 1. Container radius and padding
code = code.replace(
  /className="bg-white rounded-2xl p-6 shadow-sm border-transparent h-full flex flex-col"/g,
  'className="bg-white rounded-[32px] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-transparent h-full flex flex-col"'
);

// 2. Schedule Title
code = code.replace(
  /<h3 className="text-xl font-bold text-slate-900">Schedule<\/h3>/g,
  '<h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">SCHEDULE</h3>'
);

// 3. Spacing adjustments
code = code.replace(/mb-6/g, 'mb-10');

// 4. Calendar highlight for selected day
code = code.replace(
  /isSelected \? "bg-primary-600 text-white shadow-md shadow-primary-200" : "text-slate-700 hover:bg-slate-50"/g,
  'isSelected ? "bg-primary-50 text-primary-700 font-extrabold" : "text-slate-700 hover:bg-slate-50"'
);

// 5. Card rounded adjustments
code = code.replace(/rounded-xl/g, 'rounded-[16px]');
code = code.replace(/rounded-lg/g, 'rounded-[12px]');

fs.writeFileSync(widgetFile, code, 'utf8');
console.log('ScheduleWidget Updated for Apple HI');
