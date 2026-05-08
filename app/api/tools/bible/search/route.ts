import { NextRequest, NextResponse } from 'next/server';
import { BibleTool } from '@/mcp/tools/bible-tool';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') ?? '';
  const limit = Number(searchParams.get('limit') ?? '40');
  const version = (searchParams.get('version') as 'basic' | 'easy') ?? 'easy';

  if (!query.trim()) {
    return NextResponse.json({ query, results: [] });
  }

  const results = await BibleTool.execute({ query, limit, version });
  return NextResponse.json(results);
}
