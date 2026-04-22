import { NextResponse } from 'next/server';
import { listBibleBooks } from '@/mcp/tools/bible-tool';

export async function GET() {
  const books = await listBibleBooks();
  return NextResponse.json({ books });
}
