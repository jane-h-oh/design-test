// MCP Tools - Content Factory
// 카드뉴스, QT, 나누지 등 다양한 콘텐츠 생성

export interface CardNewsData {
  title: string;
  subtitle: string;
  verses: string[];
  mainText: string;
  theme: string;
  color: string;
}

export interface QTData {
  date: string;
  verse: string;
  verseText: string;
  title: string;
  reflection: string;
  prayer: string;
  action: string;
}

export interface SermonNoteData {
  title: string;
  date: string;
  mainVerse: string;
  outline: string[];
  application: string;
  illustration?: string;
}

export interface SNSContentData {
  platform: 'instagram' | 'facebook' | 'kakao' | 'youtube';
  content: string;
  hashtags: string[];
  imagePrompt?: string;
}

// ContentFactory: 다양한 콘텐츠 생성
export class ContentFactory {
  // 카드뉴스 생성
  createCardNews(input: {
    title: string;
    mainVerse: string;
    mainText: string;
    theme?: string;
  }): CardNewsData {
    const colors = [
      'var(--polaris-green-70)',
      'var(--polaris-orange-80)',
      'var(--polaris-blue-50)',
      'var(--polaris-orange-50)',
      'var(--polaris-red-50)',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      title: input.title,
      subtitle: input.mainVerse,
      verses: [input.mainVerse],
      mainText: input.mainText,
      theme: input.theme || ' Glaube',
      color: randomColor,
    };
  }

  // QT (Quiet Time) 템플릿 생성
  createQT(input: {
    verse: string;
    verseText: string;
    date?: string;
  }): QTData {
    const today = input.date || new Date().toISOString().split('T')[0];
    
    return {
      date: today,
      verse: input.verse,
      verseText: input.verseText,
      title: '오늘의 묵상',
      reflection: '이 구절을 통해 무엇을 배우셨나요?',
      prayer: '오늘 이 말씀을 통해祈禱할 내용은 무엇인가요?',
      action: '오늘 실행할 구체적인 행동은 무엇인가요?',
    };
  }

  // 설교 노트 생성
  createSermonNote(input: {
    title: string;
    mainVerse: string;
    outline: string[];
    application: string;
  }): SermonNoteData {
    return {
      title: input.title,
      date: new Date().toLocaleDateString('ko-KR'),
      mainVerse: input.mainVerse,
      outline: input.outline,
      application: input.application,
    };
  }

  // SNS 콘텐츠 생성
  createSNSContent(input: {
    text: string;
    platform: 'instagram' | 'facebook' | 'kakao' | 'youtube';
    includeHashtags?: boolean;
  }): SNSContentData {
    const hashtags = input.includeHashtags ? [
      '#목회메이트',
      '#오늘의말씀',
      '#신앙생활',
      '#묵상',
    ] : [];

    let content = input.text;
    
    // 플랫폼별 길이 제한
    if (input.platform === 'instagram' && content.length > 2200) {
      content = content.substring(0, 2200) + '...';
    }
    
    return {
      platform: input.platform,
      content,
      hashtags,
    };
  }

  // 원고에서 여러 콘텐츠 동시에 생성
  generateAll(input: {
    manuscript: string;
    mainVerse?: string;
    verseText?: string;
  }) {
    return {
      cardNews: this.createCardNews({
        title: '오늘의 말씀',
        mainVerse: input.mainVerse || '요한복음 3:16',
        mainText: input.manuscript.substring(0, 200),
      }),
      qt: this.createQT({
        verse: input.mainVerse || '요한복음 3:16',
        verseText: input.verseText || '神이 그 독생자를 믿는 모든 사람에게 영생을 주시려고 이처럼 사랑하셨도다',
      }),
      sermonNote: this.createSermonNote({
        title: '주일 설교',
        mainVerse: input.mainVerse || '요한복음 3:16',
        outline: ['서론', '본론', '결론'],
        application: '오늘 배운 내용을 어떻게 적용하시겠습니까?',
      }),
    };
  }
}

export const contentFactory = new ContentFactory();
export default contentFactory;
