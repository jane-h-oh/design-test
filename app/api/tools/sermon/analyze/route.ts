import { NextRequest, NextResponse } from 'next/server';
import { SermonAnalyst } from '@/mcp/tools/sermon-analyst';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const manuscript = body?.manuscript;

  if (typeof manuscript !== 'string' || !manuscript.trim()) {
    return NextResponse.json({ message: 'manuscript is required.' }, { status: 400 });
  }

  const analysis = await SermonAnalyst.execute({ manuscript });
  return NextResponse.json(analysis);
}
