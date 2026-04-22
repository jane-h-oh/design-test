import 'server-only';
import type { MCPTool, SermonAnalysis } from '@/mcp/types';

const STOPWORDS = new Set(['그리고', '그래서', '하지만', '여러분', '하나님', '오늘', '우리', '있는', '하는', '입니다']);

function splitSentences(manuscript: string) {
  return manuscript
    .split(/(?<=[.!?]|다\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function extractThemes(manuscript: string) {
  const candidates = manuscript
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !STOPWORDS.has(token));

  const counts = new Map<string, number>();
  candidates.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([token]) => token);
}

function extractReferences(manuscript: string) {
  const matches = manuscript.match(/[1-3]?\s?[가-힣A-Za-z]+(?:복음|서|기|전|후)?\s?\d+:\d+(?:-\d+)?/g);
  return matches ? [...new Set(matches)] : [];
}

export const SermonAnalyst: MCPTool<{ manuscript: string }, SermonAnalysis> = {
  name: 'SermonAnalyst',
  description: 'Summarize a sermon manuscript, extract themes, and identify Bible references.',
  execute({ manuscript }) {
    const sentences = splitSentences(manuscript);
    const summary = sentences.slice(0, 2).join(' ').slice(0, 220) || '원고를 기반으로 한 요약을 준비 중입니다.';
    const keyThemes = extractThemes(manuscript);
    const detectedReferences = extractReferences(manuscript);
    const suggestedTitle = keyThemes.length > 0 ? `${keyThemes[0]}를 붙드는 공동체` : '말씀으로 다시 세워지는 공동체';

    return {
      summary,
      keyThemes: keyThemes.length > 0 ? keyThemes : ['은혜', '회복', '실천'],
      suggestedTitle,
      detectedReferences,
    };
  },
};
