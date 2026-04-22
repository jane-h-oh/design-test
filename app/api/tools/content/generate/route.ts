import { NextRequest, NextResponse } from 'next/server';
import { ContentFactory } from '@/mcp/tools/content-factory';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const manuscript = body?.manuscript;
  const analysis = body?.analysis;
  const mainVerse = body?.mainVerse;

  if (typeof manuscript !== 'string' || !manuscript.trim()) {
    return NextResponse.json({ message: 'manuscript is required.' }, { status: 400 });
  }

  const content = await ContentFactory.execute({ manuscript, analysis, mainVerse });
  return NextResponse.json(content);
}
