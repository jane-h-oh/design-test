import { NextRequest, NextResponse } from 'next/server';
import { getBibleChapter } from '@/mcp/tools/bible-tool';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const book = searchParams.get('book');
  const chapter = Number(searchParams.get('chapter'));
  const version = (searchParams.get('version') as 'basic' | 'easy') || 'easy';

  if (!book || Number.isNaN(chapter)) {
    return NextResponse.json({ message: 'book and chapter are required.' }, { status: 400 });
  }

  const verses = await getBibleChapter(book, chapter, version);
  return NextResponse.json({ verses });
}
