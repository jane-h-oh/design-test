import { NextRequest, NextResponse } from 'next/server';
import { listBibleBooks } from '@/mcp/tools/bible-tool';

export async function GET(request: NextRequest) {
  const version = (request.nextUrl.searchParams.get('version') as 'basic' | 'easy') || 'easy';
  const books = await listBibleBooks(version);
  return NextResponse.json({ books });
}
