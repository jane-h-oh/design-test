const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app/(workspace)/dashboard/page.tsx');
let dashCode = fs.readFileSync(pageFile, 'utf8');

// The main calendar card needs to scale. Replacing exactly what is there:
dashCode = dashCode.replace(
  /<Card className="rounded-2xl border-transparent bg-white p-4 shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] md:p-5">/g,
  '<Card className="flex-1 w-full min-w-0 flex flex-col rounded-2xl border-transparent bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-5">'
);

dashCode = dashCode.replace(
  /<Card className="flex-1 min-w-0 w-full rounded-2xl border-transparent bg-white/g,
  '<Card className="flex-1 min-w-0 w-full rounded-2xl border-transparent bg-white' // Just in case it was there
); // Wait, I already saw it in view_file.

// The Plus button text color and missing blue backgrounds in action buttons
dashCode = dashCode.replace(
  /<Plus className="h-5 w-5" \/>/g,
  '<Plus className="h-5 w-5 text-white" />'
);

// The bottom floating action button color might be missing text-white
dashCode = dashCode.replace(
  /<Plus className="h-4 w-4" \/>/g,
  '<Plus className="h-4 w-4 text-primary-600" />'
);

// Outline buttons that lost border-transparent color
dashCode = dashCode.replace(
  /className="h-auto justify-start whitespace-normal rounded-2xl border-primary-100 bg-white px-4 py-3 text-left leading-5"/g,
  'className="flex items-center h-auto justify-start whitespace-normal rounded-2xl bg-primary-50 text-primary-700 px-4 py-3 text-left leading-5 shadow-none hover:bg-primary-100"'
);

// Solid action button
dashCode = dashCode.replace(
  /className="h-auto justify-start whitespace-normal rounded-2xl bg-primary-600 px-4 py-3 text-left leading-5 hover:bg-primary-700"/g,
  'className="flex items-center h-auto justify-start whitespace-normal rounded-2xl bg-primary-600 text-white px-4 py-3 text-left leading-5 hover:bg-primary-700"'
);

fs.writeFileSync(pageFile, dashCode, 'utf8');
console.log('Fixed alignments & colors.');
