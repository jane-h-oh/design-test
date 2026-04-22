// MCP Tools - Sermon Analyst
// 원고 분석, 주제 추출, 성경 인용구 식별

import { bibleTool, type BibleVerse } from './bible';

export interface SermonAnalysis {
  summary: string;
  themes: string[];
  keyVerses: BibleVerse[];
  wordCount: number;
  readingTime: number; // 분
}

// SermonAnalyst: 설교 원고 분석
export class SermonAnalyst {
  // 원고 요약
  summarize(text: string): string {
    // 간단한 요약 로직 (실제 구현 시 AI 연동)
    const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
    if (sentences.length <= 3) return text;
    
    // 첫 문장과 마지막 문장, 그리고 핵심 키워드 추출
    const first = sentences[0].trim();
    const last = sentences[sentences.length - 1].trim();
    
    return `${first}... ${last}`;
  }

  // 주제 추출
  extractThemes(text: string): string[] {
    // 간단한 키워드 추출 (실제 구현 시 AI/LLM 연동)
    const keywords: string[] = [];
    const themeKeywords = [
      '믿음', '사랑', '희망', '복음', '구원', '성령', '교회', 
      '회개', '은혜', '믿음', '순종', '섬김', '기도', '말씀',
      '긍휼', '용서', '평화', '기쁨', '감사', '충성', '인내'
    ];
    
    const lowerText = text.toLowerCase();
    themeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    return [...new Set(keywords)].slice(0, 5);
  }

  // 성경 인용구 식별
  async identifyVerses(text: string): Promise<BibleVerse[]> {
    const foundVerses: BibleVerse[] = [];
    
    // 성경 구절 패턴 감지 (예: "창세기 1:1", "요한복음 3:16")
    const patterns = [
      /([가-힣]+)\s*(\d+):(\d+)/g,
      /([가-힣]+)\s*(\d+)장\s*(\d+)절/g,
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const bookName = match[1];
        const chapter = parseInt(match[2]);
        const verse = parseInt(match[3]);
        
        // 약어 찾기
        const books = bibleTool.getBooks();
        const book = books.find(b => 
          b.name === bookName || b.nameEn.toLowerCase() === bookName.toLowerCase()
        );
        
        if (book) {
          const foundVerse = bibleTool.getVerse(book.abbrev, chapter, verse);
          if (foundVerse) {
            foundVerses.push(foundVerse);
          }
        }
      }
    }
    
    return foundVerses;
  }

  // 전체 분석
  async analyze(text: string): Promise<SermonAnalysis> {
    const wordCount = text.replace(/\s/g, '').length;
    const readingTime = Math.ceil(wordCount / 200); // 200자/분
    
    const [themes, keyVerses] = await Promise.all([
      Promise.resolve(this.extractThemes(text)),
      this.identifyVerses(text),
    ]);

    return {
      summary: this.summarize(text),
      themes,
      keyVerses,
      wordCount,
      readingTime,
    };
  }
}

export const sermonAnalyst = new SermonAnalyst();
export default sermonAnalyst;