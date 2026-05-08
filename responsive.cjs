const fs = require('fs');
const path = require('path');

// 1. App Shell Layout updates for standard global padding
const shellFile = path.join(__dirname, 'src/components/shell/app-shell.tsx');
let shellCode = fs.readFileSync(shellFile, 'utf8');
shellCode = shellCode.replace(/p-4 md:p-8/g, 'px-4 py-6 md:px-6 md:py-8 lg:px-8 xl:px-10');
// Desktop starts at lg (1024px), sidebar should be md (tablet) or lg (desktop). Let's keep it visible at md (768px+).
fs.writeFileSync(shellFile, shellCode, 'utf8');

// 2. Dashboard layout changes for responsiveness
const dashFile = path.join(__dirname, 'app/(workspace)/dashboard/page.tsx');
let dashCode = fs.readFileSync(dashFile, 'utf8');
// Dashboard hero grid
dashCode = dashCode.replace(/grid gap-4 xl:grid-cols-\[minmax\(0,1\.2fr\)_320px\]/g, 'flex flex-col gap-4 lg:flex-row lg:items-start');
dashCode = dashCode.replace(/<div className="min-w-0">/g, '<div className="min-w-0 flex-1">'); 
// (Need to do a precise replacement for the right rail verse widget to ensure it has width constraints on desktop)
dashCode = dashCode.replace(/<div className="rounded-xl border/g, '<div className="lg:w-[320px] rounded-xl border'); // Warning: this applies globally, but wait

// Let's reload and use safer regex:
dashCode = fs.readFileSync(dashFile, 'utf8');

// The hero grid
dashCode = dashCode.replace(/grid gap-4 xl:grid-cols-\[minmax\(0,1\.2fr\)_320px\]/g, 'flex flex-col gap-4 lg:flex-row lg:items-stretch');
// The Verse Widget is the second child in that grid.
dashCode = dashCode.replace(/<div className="rounded-xl border border-transparent bg-white px-4 py-4 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\]">/g, '<div className="w-full lg:w-[320px] shrink-0 rounded-xl bg-white px-4 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">');

// The main layout grid: grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_360px] -> 
dashCode = dashCode.replace(/grid grid-cols-1 gap-5 xl:grid-cols-\[minmax\(0,1\.7fr\)_360px\]/g, 'flex flex-col gap-5 lg:flex-row lg:items-start');

// Change standard layout to a Flex container where the aside is w-[360px]
dashCode = dashCode.replace(/<aside className="flex flex-col gap-4">/g, '<aside className="flex flex-col gap-4 w-full lg:w-[360px] shrink-0">');
dashCode = dashCode.replace(/<Card className="rounded-xl bg-white p-4 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] md:p-5">/g, '<Card className="flex-1 min-w-0 w-full rounded-xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-5 lg:p-6">');

// Dashboard heading text responsive sizing
dashCode = dashCode.replace(/text-2xl font-bold leading-tight/g, 'text-[22px] md:text-[28px] lg:text-[32px] font-bold leading-tight');

// Ensure Modal is fully responsive on 380px screens
dashCode = dashCode.replace(/className="max-w-2xl rounded-\[28px\] border border-\[#dce7f5\] bg-white"/g, 'className="max-w-2xl w-[95%] mx-auto md:w-full rounded-2xl bg-white"');
// Wait, the previous script might have already replaced modal rounded-[28px]. Let's just fix it generally.
dashCode = dashCode.replace(/className="max-w-2xl rounded-xl bg-white"/g, 'className="max-w-2xl w-[95vw] md:w-full rounded-2xl bg-white mx-auto my-4 max-h-[95vh] overflow-y-auto"'); // Safe wrapping

fs.writeFileSync(dashFile, dashCode, 'utf8');

// 3. Modal UI file Check
const modalFile = path.join(__dirname, 'src/components/ui/Modal.tsx');
let modalCode = fs.readFileSync(modalFile, 'utf8');
modalCode = modalCode.replace(/max-w-lg w-full mx-4/g, 'max-w-lg w-[calc(100%-2rem)] mx-auto');
fs.writeFileSync(modalFile, modalCode, 'utf8');

console.log('Responsive scaling injected.');
