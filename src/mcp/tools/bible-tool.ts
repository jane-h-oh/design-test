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

const cachedDatasets: Record<string, BibleDataset> = {};

const toBookId = (englishName: string) => englishName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const BOOK_SHORT_NAMES: Record<string, string> = {
  '창세기': '창', '출애굽기': '출', '레위기': '레', '민수기': '민', '신명기': '신',
  '여호수아': '수', '사사기': '삿', '룻기': '룻', '사무엘상': '삼상', '사무엘하': '삼하',
  '열왕기상': '왕상', '열왕기하': '왕하', '역대상': '대상', '역대하': '대하', '에스라': '스',
  '느헤미야': '느', '에스더': '에', '욥기': '욥', '시편': '시', '잠언': '잠',
  '전도서': '전', '아가': '아', '이사야': '사', '예레미야': '렘', '예레미야애가': '애',
  '에스겔': '겔', '다니엘': '단', '호세아': '호', '요엘': '욜', '아모스': '암',
  '오바댜': '옵', '요나': '욘', '미가': '미', '나훔': '나', '하박국': '합',
  '스바냐': '습', '학개': '학', '스가랴': '슥', '말라기': '말',
  '마태복음': '마', '마가복음': '막', '누가복음': '눅', '요한복음': '요', '사도행전': '행',
  '로마서': '롬', '고린도전서': '고전', '고린도후서': '고후', '갈라디아서': '갈', '에베소서': '엡',
  '빌립보서': '빌', '골로새서': '골', '데살로니가전서': '살전', '데살로니가후서': '살후',
  '디모데전서': '딤전', '디모데후서': '딤후', '디도서': '딛', '빌레몬서': '몬',
  '히브리서': '히', '야고보서': '약', '베드로전서': '벧전', '베드로후서': '벧후',
  '요한일서': '요일', '요한이서': '요이', '요한삼서': '요삼', '유다서': '유', '요한계시록': '계'
};

async function loadBibleDataset(version: 'basic' | 'easy' = 'easy'): Promise<BibleDataset> {
  if (cachedDatasets[version]) return cachedDatasets[version];

  // Always load the 'easy' version to get the structure (books, chapters, verses counts)
  const easyFilePath = path.join(process.cwd(), 'public', 'data', 'bible.json');
  const easyRaw = await readFile(easyFilePath, 'utf8');
  const parsedEasy = JSON.parse(easyRaw) as RawBibleBook[];

  const books = parsedEasy.map((book) => ({
    id: toBookId(book.english),
    koreanName: book.korean,
    englishName: book.english,
    testament: book.testament,
    chapterCount: book.chapters.length,
  }));

  let verses: BibleVerseResult[] = [];

  if (version === 'easy') {
    verses = parsedEasy.flatMap((book) => {
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
  } else {
    // version === 'basic'
    const basicFilePath = path.join(process.cwd(), 'public', 'data', 'bible.basic.json');
    const basicRaw = await readFile(basicFilePath, 'utf8');
    const parsedBasic = JSON.parse(basicRaw) as Record<string, string>;

    verses = parsedEasy.flatMap((book) => {
      const bookId = toBookId(book.english);
      const shortName = BOOK_SHORT_NAMES[book.korean] || book.korean.slice(0, 2);

      return book.chapters.flatMap((chapter) =>
        chapter.verses.map((verse) => {
          const key = `${shortName}${chapter.chapterNum}:${verse.verseNum}`;
          const text = parsedBasic[key] || verse.verse; // Fallback to easy text if missing
          
          return {
            bookId,
            bookName: book.korean,
            chapter: Number(chapter.chapterNum),
            verse: Number(verse.verseNum),
            text: text,
            reference: `${book.korean} ${chapter.chapterNum}:${verse.verseNum}`,
          };
        })
      );
    });
  }

  cachedDatasets[version] = { books, verses };
  return cachedDatasets[version];
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

export const BibleTool: MCPTool<{ query: string; limit?: number; version?: 'basic' | 'easy' }, BibleSearchOutput> = {
  name: 'BibleTool',
  description: 'Parse bible json and return verse search results for keyword or reference queries.',
  async execute({ query, limit = 40, version = 'easy' }) {
    const { books, verses } = await loadBibleDataset(version);
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

export async function listBibleBooks(version: 'basic' | 'easy' = 'easy') {
  const { books } = await loadBibleDataset(version);
  return books;
}

export async function getBibleChapter(bookId: string, chapter: number, version: 'basic' | 'easy' = 'easy') {
  const { verses } = await loadBibleDataset(version);
  return verses.filter((verse) => verse.bookId === bookId && verse.chapter === chapter);
}
