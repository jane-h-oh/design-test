import 'server-only';
import { readFile } from 'fs/promises';
import path from 'path';
import type { BibleBookSummary, BibleSearchOutput, BibleVerseResult, MCPTool } from '@/mcp/types';

interface RawBibleVerse {
  chapterNum: string;
  verseNum: string;
  verse: string;
}

interface RawBibleChapter {
  chapterNum: string;
  verses: RawBibleVerse[];
}

interface RawBibleBook {
  korean: string;
  english: string;
  testament: 'OT' | 'NT';
  chapters: RawBibleChapter[];
}

interface BibleDataset {
  books: BibleBookSummary[];
  verses: BibleVerseResult[];
}

let cachedDataset: BibleDataset | null = null;

const toBookId = (englishName: string) => englishName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

async function loadBibleDataset(): Promise<BibleDataset> {
  if (cachedDataset) return cachedDataset;

  const filePath = path.join(process.cwd(), 'public', 'data', 'bible.json');
  const raw = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw) as RawBibleBook[];

  const books = parsed.map((book) => ({
    id: toBookId(book.english),
    koreanName: book.korean,
    englishName: book.english,
    testament: book.testament,
    chapterCount: book.chapters.length,
  }));

  const verses = parsed.flatMap((book) => {
    const bookId = toBookId(book.english);
    return book.chapters.flatMap((chapter) =>
      chapter.verses.map((verse) => ({
        bookId,
        bookName: book.korean,
        chapter: Number(chapter.chapterNum),
        verse: Number(verse.verseNum),
        text: verse.verse,
        reference: `${book.korean} ${chapter.chapterNum}:${verse.verseNum}`,
      }))
    );
  });

  cachedDataset = { books, verses };
  return cachedDataset;
}

function normalize(input: string) {
  return input.toLowerCase().replace(/\s+/g, ' ').trim();
}

function findMatchingBook(query: string, books: BibleBookSummary[]) {
  const normalizedQuery = normalize(query);
  return books.find((book) => {
    const bookKeys = [book.koreanName, book.englishName, book.id].map(normalize);
    return bookKeys.some((key) => normalizedQuery.startsWith(key));
  });
}

function parseReferenceQuery(query: string, books: BibleBookSummary[]) {
  const referenceMatch = query.match(/(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!referenceMatch) return null;

  const [, bookQuery, chapterValue, startVerseValue, endVerseValue] = referenceMatch;
  const book = findMatchingBook(bookQuery, books);
  if (!book) return null;

  return {
    book,
    chapter: Number(chapterValue),
    startVerse: Number(startVerseValue),
    endVerse: endVerseValue ? Number(endVerseValue) : Number(startVerseValue),
  };
}

export const BibleTool: MCPTool<{ query: string; limit?: number }, BibleSearchOutput> = {
  name: 'BibleTool',
  description: 'Parse /public/data/bible.json and return verse search results for keyword or reference queries.',
  async execute({ query, limit = 40 }) {
    const { books, verses } = await loadBibleDataset();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return { query, mode: 'keyword', results: [] };
    }

    const parsedReference = parseReferenceQuery(trimmedQuery, books);
    if (parsedReference) {
      const results = verses
        .filter(
          (verse) =>
            verse.bookId === parsedReference.book.id &&
            verse.chapter === parsedReference.chapter &&
            verse.verse >= parsedReference.startVerse &&
            verse.verse <= parsedReference.endVerse
        )
        .slice(0, limit);

      return { query, mode: 'reference', results };
    }

    const normalizedQuery = normalize(trimmedQuery);
    const results = verses
      .filter((verse) => normalize(verse.text).includes(normalizedQuery) || normalize(verse.reference).includes(normalizedQuery))
      .slice(0, limit);

    return { query, mode: 'keyword', results };
  },
};

export async function listBibleBooks() {
  const { books } = await loadBibleDataset();
  return books;
}

export async function getBibleChapter(bookId: string, chapter: number) {
  const { verses } = await loadBibleDataset();
  return verses.filter((verse) => verse.bookId === bookId && verse.chapter === chapter);
}
