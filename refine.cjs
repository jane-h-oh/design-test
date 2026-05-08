const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app/(workspace)/dashboard/page.tsx');
let code = fs.readFileSync(pageFile, 'utf8');

// 1. Remove standard gray borders to create a soft floating aesthetic
code = code.replace(/ border border-slate-200/g, ''); 
code = code.replace(/ border-slate-200/g, ' border-transparent'); // For anything explicitly setting border color
code = code.replace(/ border border-slate-100/g, ''); 

// 2. Add slightly more pronounced modern soft shadows to compensate for border removal
code = code.replace(/shadow-sm/g, 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
// Revert some specifically if needed, but let's just make the cards softly float.

// 3. Update the Main '일정 추가' button to be just a '+' icon
code = code.replace(
  /<Button type="button" className="rounded-full bg-primary-600 px-4 hover:bg-primary-700" onClick=\{\(\) => openNewScheduleModal\(\)\}>\s*<Plus className="mr-1\.5 h-4 w-4" \/>\s*일정 추가\s*<\/Button>/g,
  `<Button type="button" className="flex h-10 w-10 items-center justify-center p-0 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-[0_4px_12px_rgb(37,99,235,0.3)] transition-transform hover:scale-105" onClick={() => openNewScheduleModal()}>\n                <Plus className="h-5 w-5" />\n              </Button>`
);

// 4. In the calendar view, the tiny add icon text:
code = code.replace(
  /<span>일정 추가<\/span>/g,
  `` // Just remove the text '일정 추가'
);
// Fix the icon alignment since text is gone
code = code.replace(/<Plus className="h-4 w-4" \/>/g, '<Plus className="h-4 w-4" />');

// 5. Update calendar cells hover border
code = code.replace(/hover:border-primary-200/g, 'hover:border-primary-100/50 shadow-sm hover:shadow-md');

fs.writeFileSync(pageFile, code, 'utf8');

const shellFile = path.join(__dirname, 'src/components/shell/app-shell.tsx');
let shellCode = fs.readFileSync(shellFile, 'utf8');
shellCode = shellCode.replace(/border-r border-slate-200/g, 'border-r border-slate-100'); // Faint standard border for sidebar
shellCode = shellCode.replace(/border border-slate-200/g, ''); // Fix logo border
shellCode = shellCode.replace(/border-t border-slate-100/g, 'border-t border-slate-100/50'); 
fs.writeFileSync(shellFile, shellCode, 'utf8');

console.log('UI refinement script executed');
