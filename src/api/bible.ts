// MCP Tools - Bible Tool
// 성경 JSON을 파싱하고 검색하는 기능

export interface BibleBook {
  name: string;
  nameEn: string;
  abbrev: string;
  chapters: number;
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleData {
  meta: { version: string; language: string; name: string };
  books: BibleBook[];
  verses: BibleVerse[];
}

// BibleTool: 성경 데이터 로드 및 검색
export class BibleTool {
  private data: BibleData | null = null;
  private loaded = false;

  async load(): Promise<void> {
    if (this.loaded) return;
    
    try {
      const response = await fetch('/data/bible.json');
      this.data = await response.json();
      this.loaded = true;
    } catch (error) {
      console.error('Failed to load Bible data:', error);
      throw error;
    }
  }

  getBooks(): BibleBook[] {
    if (!this.data) return [];
    return this.data.books;
  }

  getBookByAbbrev(abbrev: string): BibleBook | undefined {
    if (!this.data) return undefined;
    return this.data.books.find(b => b.abbrev === abbrev);
  }

  // 구절 검색 (전체 텍스트 검색)
  search(query: string): BibleVerse[] {
    if (!this.data || !query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return this.data.verses.filter(v => 
      v.text.toLowerCase().includes(lowerQuery)
    );
  }

  // 특정 장/절 조회
  getChapter(bookAbbrev: string, chapter: number): BibleVerse[] {
    if (!this.data) return [];
    
    return this.data.verses.filter(
      v => v.book === bookAbbrev && v.chapter === chapter
    );
  }

  // 특정 구절 조회
  getVerse(bookAbbrev: string, chapter: number, verse: number): BibleVerse | undefined {
    if (!this.data) return undefined;
    
    return this.data.verses.find(
      v => v.book === bookAbbrev && v.chapter === chapter && v.verse === verse
    );
  }

  // 범위 조회 (예: 창세기 1:1-10)
  getRange(bookAbbrev: string, startChapter: number, startVerse: number, endChapter?: number, endVerse?: number): BibleVerse[] {
    if (!this.data) return [];
    
    return this.data.verses.filter(v => {
      if (v.book !== bookAbbrev) return false;
      
      if (endChapter === undefined) {
        // 같은 장 내 범위
        return v.chapter === startChapter && v.verse >= startVerse && v.verse <= (endVerse || startVerse);
      } else {
        // 여러 장에 걸치는 범위
        if (v.chapter === startChapter && v.verse >= startVerse) return true;
        if (v.chapter === endChapter && v.verse <= (endVerse || 999)) return true;
        if (v.chapter > startChapter && v.chapter < endChapter) return true;
        return false;
      }
    });
  }

  // 구약/신약 분류
  getOldTestament(): BibleBook[] {
    if (!this.data) return [];
    // 39개 구약
    return this.data.books.slice(0, 39);
  }

  getNewTestament(): BibleBook[] {
    if (!this.data) return [];
    // 27개 신약
    return this.data.books.slice(39);
  }
}

// Singleton instance
export const bibleTool = new BibleTool();
export default bibleTool;