const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'app/(workspace)/dashboard/page.tsx');
let code = fs.readFileSync(file, 'utf8');

// 1. Theme configuration changes
code = code.replace(
  /const STATUS_TONE: Record<MinistryStatus, string> = {[\s\S]*?};/,
  `const STATUS_TONE: Record<MinistryStatus, string> = {
  preparing: 'border-amber-200 bg-amber-50 text-amber-700',
  done: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  delayed: 'border-red-200 bg-red-50 text-red-700',
};`
);

code = code.replace(
  /const CATEGORY_TONE: Record<MinistryCategory, string> = {[\s\S]*?};/,
  `const CATEGORY_TONE: Record<MinistryCategory, string> = {
  worship: 'bg-primary-50 text-primary-700',
  care: 'bg-emerald-50 text-emerald-700',
  wedding: 'bg-indigo-50 text-indigo-700',
  education: 'bg-teal-50 text-teal-700',
  admin: 'bg-slate-100 text-slate-700',
  sermon: 'bg-orange-50 text-orange-700',
};`
);

// 2. Global replacements for bloated radii and hex arrays
// Rounded corners
code = code.replace(/rounded-\[28px\]/g, 'rounded-2xl');
code = code.replace(/rounded-\[24px\]/g, 'rounded-xl');
code = code.replace(/rounded-\[22px\]/g, 'rounded-xl');
code = code.replace(/rounded-\[20px\]/g, 'rounded-xl');
code = code.replace(/rounded-\[18px\]/g, 'rounded-lg');
code = code.replace(/rounded-\[16px\]/g, 'rounded-lg');
code = code.replace(/rounded-\[14px\]/g, 'rounded-md');

// Shadows
code = code.replace(/shadow-\[0_18px_48px_rgba\(15,23,42,0\.06\)\]/g, 'shadow-sm');
code = code.replace(/shadow-\[0_20px_60px_rgba\(15,23,42,0\.06\)\]/g, 'shadow-sm');
code = code.replace(/shadow-\[0_18px_40px_rgba\(29,78,216,0\.35\)\]/g, 'shadow-md');
code = code.replace(/shadow-\[inset_0_0_0_1px_rgba\(37,99,235,0\.12\)\]/g, 'shadow-[inset_0_0_0_1px_#bfdbfe]');

// Gradients and specific ugly hex bg
code = code.replace(/bg-gradient-to-r from-\[#F8FAFC\] to-\[#EFF6FF\]/g, 'bg-white');
code = code.replace(/bg-gradient-to-br from-\[#f8fbff\] to-white/g, 'bg-white');
code = code.replace(/bg-\[#f8fbff\]/g, 'bg-slate-50');
code = code.replace(/bg-\[#f4f8ff\]/g, 'bg-primary-50');
code = code.replace(/bg-\[#fbfdff\]/g, 'bg-slate-50');
code = code.replace(/bg-\[#f9fbff\]/g, 'bg-slate-50');
code = code.replace(/bg-white\/90/g, 'bg-white');
code = code.replace(/bg-\[#1d4ed8\]/g, 'bg-primary-600');
code = code.replace(/hover:bg-\[#1e40af\]/g, 'hover:bg-primary-700');
code = code.replace(/hover:bg-\[#f8fbff\]/g, 'hover:bg-slate-50');
code = code.replace(/hover:bg-\[#f9fbff\]/g, 'hover:bg-slate-50');

// Borders
code = code.replace(/border-\[#dce7f5\]/g, 'border-slate-200');
code = code.replace(/border-\[#d9e6ff\]/g, 'border-slate-200');
code = code.replace(/border-\[#e3ecf8\]/g, 'border-slate-200');
code = code.replace(/border-\[#e4ecf8\]/g, 'border-slate-200');
code = code.replace(/border-\[#dfe8f5\]/g, 'border-slate-200');
code = code.replace(/border-\[#dde7f5\]/g, 'border-slate-200');
code = code.replace(/border-\[#e6edf8\]/g, 'border-slate-200');
code = code.replace(/border-\[#d8e4f6\]/g, 'border-slate-200');
code = code.replace(/border-\[#d7e4f7\]/g, 'border-slate-200');
code = code.replace(/border-\[#e7eef8\]/g, 'border-slate-100');
code = code.replace(/border-\[#cfe0ff\]/g, 'border-primary-100');
code = code.replace(/hover:border-\[#bfd4ff\]/g, 'hover:border-primary-200');
code = code.replace(/border-[#2563eb]/g, 'border-primary-600');

// Text Colors
code = code.replace(/text-\[#0f172a\]/g, 'text-slate-900');
code = code.replace(/text-\[#334155\]/g, 'text-slate-700');
code = code.replace(/text-\[#5b6b84\]/g, 'text-slate-600');
code = code.replace(/text-\[#52627a\]/g, 'text-slate-500');
code = code.replace(/text-\[#60708a\]/g, 'text-slate-500');
code = code.replace(/text-\[#6b7a90\]/g, 'text-slate-400');
code = code.replace(/text-\[#7b8799\]/g, 'text-slate-400');
code = code.replace(/text-\[#2563eb\]/g, 'text-primary-600');
code = code.replace(/text-\[#1d4ed8\]/g, 'text-primary-700');

// Specific text removal
code = code.replace(/style=\{\{ fontFamily: 'Georgia, Times New Roman, serif' \}\}/g, '');

fs.writeFileSync(file, code, 'utf8');
console.log('UI Rewrite Complete!');
