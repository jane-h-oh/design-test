export interface MCPTool<Input, Output> {
  name: string;
  description: string;
  execute(input: Input): Promise<Output> | Output;
}

export interface BibleBookSummary {
  id: string;
  koreanName: string;
  englishName: string;
  testament: 'OT' | 'NT';
  chapterCount: number;
}

export interface BibleVerseResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

export interface BibleSearchOutput {
  query: string;
  mode: 'reference' | 'keyword';
  results: BibleVerseResult[];
}

export interface SermonAnalysis {
  summary: string;
  keyThemes: string[];
  suggestedTitle: string;
  detectedReferences: string[];
}

export interface ContentFactoryOutput {
  cardNews: {
    title: string;
    subtitle: string;
    slides: string[];
  };
  qt: {
    scripture: string;
    reflectionQuestions: string[];
    prayer: string;
  };
  sharingNote: {
    headline: string;
    body: string;
    actionPrompt: string;
  };
}
