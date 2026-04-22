import 'server-only';
import type { ContentFactoryOutput, MCPTool, SermonAnalysis } from '@/mcp/types';

interface ContentFactoryInput {
  manuscript: string;
  analysis?: SermonAnalysis;
  mainVerse?: string;
}

const slicePreview = (text: string, length: number) => (text.length > length ? `${text.slice(0, length).trim()}...` : text.trim());

export const ContentFactory: MCPTool<ContentFactoryInput, ContentFactoryOutput> = {
  name: 'ContentFactory',
  description: 'Create card news JSON, QT prompts, and sharing notes from sermon analysis results.',
  execute({ manuscript, analysis, mainVerse }) {
    const summary = analysis?.summary ?? slicePreview(manuscript, 220);
    const themes = analysis?.keyThemes ?? ['은혜', '회복', '실천'];
    const verse = mainVerse || analysis?.detectedReferences?.[0] || '본문 구절을 추가해 주세요';

    return {
      cardNews: {
        title: analysis?.suggestedTitle ?? '이번 주 말씀 카드',
        subtitle: verse,
        slides: [
          `핵심 메시지: ${summary}`,
          `이번 주 키워드: ${themes.join(', ')}`,
          `공동체 적용: ${slicePreview(manuscript, 140)}`,
        ],
      },
      qt: {
        scripture: verse,
        reflectionQuestions: [
          `${themes[0]}의 관점에서 이번 말씀은 내 삶을 어떻게 비추나요?`,
          `${themes[1] ?? themes[0]}를 실천하기 위해 오늘 바꿀 수 있는 작은 습관은 무엇인가요?`,
          `가정과 공동체 안에서 함께 나눌 문장은 무엇인가요?`,
        ],
        prayer: `${themes[0]}의 은혜를 놓치지 않고, 말씀을 일상 속에서 살아내게 해 달라는 기도로 마무리해 보세요.`,
      },
      sharingNote: {
        headline: `${themes[0]}를 붙드는 나눔지`,
        body: summary,
        actionPrompt: `${themes.slice(0, 2).join('와 ')}의 주제를 중심으로 10분 대화를 이어가 보세요.`,
      },
    };
  },
};
