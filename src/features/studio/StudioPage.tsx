import { useState } from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  FileText,
  Heart,
  Image,
  LayoutTemplate,
  Loader2,
  PenLine,
  Share2,
  Sparkles,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';
import { contentFactory, type CardNewsData, type QTData, type SermonNoteData } from '@/api/content';

type Stage = 'input' | 'process' | 'preview';
type ContentTab = 'cardnews' | 'qt' | 'sermon' | 'sns';
type MobileStudioPanel = 'editor' | 'preview';

export function StudioPage() {
  const [stage, setStage] = useState<Stage>('input');
  const [manuscript, setManuscript] = useState('');
  const [mainVerse, setMainVerse] = useState('');
  const [activeTab, setActiveTab] = useState<ContentTab>('cardnews');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileStudioPanel, setMobileStudioPanel] = useState<MobileStudioPanel>('editor');
  const [cardNews, setCardNews] = useState<CardNewsData | null>(null);
  const [qt, setQt] = useState<QTData | null>(null);
  const [sermonNote, setSermonNote] = useState<SermonNoteData | null>(null);

  const handleProcess = async () => {
    if (!manuscript.trim()) return;

    setStage('process');
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = contentFactory.generateAll({
      manuscript,
      mainVerse: mainVerse || '요한복음 3:16',
      verseText: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라.',
    });

    setCardNews(result.cardNews);
    setQt(result.qt);
    setSermonNote(result.sermonNote);
    setIsProcessing(false);
    setStage('preview');
    setMobileStudioPanel('preview');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setStage('input');
    setManuscript('');
    setMainVerse('');
    setCardNews(null);
    setQt(null);
    setSermonNote(null);
    setActiveTab('cardnews');
    setMobileStudioPanel('editor');
  };

  const stageSteps: Stage[] = ['input', 'process', 'preview'];
  const tabs = [
    { id: 'cardnews' as const, label: '말씀 카드', icon: Image },
    { id: 'qt' as const, label: 'QT', icon: Heart },
    { id: 'sermon' as const, label: '설교 노트', icon: FileText },
    { id: 'sns' as const, label: 'SNS', icon: Share2 },
  ];

  const showEditorOnMobile = mobileStudioPanel === 'editor';
  const showPreviewOnMobile = mobileStudioPanel === 'preview';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">콘텐츠 스튜디오</h1>
        <p className="mt-1 text-gray-500">원고를 입력하면 카드뉴스, QT, 설교 노트, SNS 초안으로 빠르게 변환합니다.</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
        {stageSteps.map((currentStage, index) => (
          <div key={currentStage} className="flex items-center">
            <div
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all md:px-4',
                stage === currentStage
                  ? 'bg-primary text-white'
                  : stageSteps.indexOf(stage) > index
                    ? 'bg-primary/20 text-primary'
                    : 'bg-gray-100 text-gray-500'
              )}
            >
              {currentStage === 'input' && <PenLine className="h-4 w-4" />}
              {currentStage === 'process' && <Loader2 className={cn('h-4 w-4', isProcessing && 'animate-spin')} />}
              {currentStage === 'preview' && <LayoutTemplate className="h-4 w-4" />}
              <span>
                {currentStage === 'input' ? '원고 입력' : currentStage === 'process' ? '분석 중' : '결과 확인'}
              </span>
            </div>
            {index < stageSteps.length - 1 && <ArrowRight className="mx-2 hidden h-4 w-4 text-gray-300 sm:block" />}
          </div>
        ))}
      </div>

      {stage === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-primary" />
              원고 입력
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">주요 성경 구절</label>
              <input
                type="text"
                value={mainVerse}
                onChange={(event) => setMainVerse(event.target.value)}
                placeholder="예: 요한복음 3:16"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">설교 원고 또는 메시지 초안</label>
              <Textarea
                value={manuscript}
                onChange={(event) => setManuscript(event.target.value)}
                placeholder="설교 원고, 주보 문안, SNS용 핵심 문장을 입력해 주세요."
                rows={14}
                className="w-full"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleProcess} disabled={!manuscript.trim()} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                콘텐츠 생성하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {stage === 'process' && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">AI가 콘텐츠를 정리하고 있습니다</h3>
            <p className="text-gray-500">원고를 분석한 뒤 모바일에서도 읽기 좋은 형식으로 결과를 구성하고 있어요.</p>
          </CardContent>
        </Card>
      )}

      {stage === 'preview' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-1 md:hidden">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setMobileStudioPanel('editor')}
                className={cn(
                  'rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  showEditorOnMobile ? 'bg-primary text-white' : 'text-gray-600'
                )}
              >
                원고 입력
              </button>
              <button
                onClick={() => setMobileStudioPanel('preview')}
                className={cn(
                  'rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  showPreviewOnMobile ? 'bg-primary text-white' : 'text-gray-600'
                )}
              >
                결과 미리보기
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <Card className={cn('h-fit', !showEditorOnMobile && 'hidden md:block')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenLine className="h-5 w-5 text-primary" />
                  원고 편집
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">주요 성경 구절</label>
                  <input
                    type="text"
                    value={mainVerse}
                    onChange={(event) => setMainVerse(event.target.value)}
                    placeholder="예: 요한복음 3:16"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">원고</label>
                  <Textarea
                    value={manuscript}
                    onChange={(event) => setManuscript(event.target.value)}
                    rows={18}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button variant="outline" onClick={handleReset}>
                    새 원고 시작
                  </Button>
                  <Button onClick={handleProcess} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    다시 생성하기
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className={cn('space-y-4', !showPreviewOnMobile && 'hidden md:block')}>
              <div className="overflow-x-auto border-b border-border pb-2">
                <div className="flex min-w-max gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                        activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'cardnews' && cardNews && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <Image className="h-5 w-5 text-primary" />
                        카드뉴스 미리보기
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(cardNews.title)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-2xl p-6 text-white md:p-8" style={{ backgroundColor: cardNews.color }}>
                      <h3 className="mb-2 text-2xl font-bold">{cardNews.title}</h3>
                      <p className="mb-4 text-lg opacity-90">{cardNews.subtitle}</p>
                      <p className="text-sm leading-relaxed opacity-80">{cardNews.mainText}</p>
                      <div className="mt-4 border-t border-white/20 pt-4">
                        <span className="text-xs opacity-70">#{cardNews.theme}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'qt' && qt && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        QT 묵상 노트
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(qt.verse)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl bg-primary/5 p-4">
                      <p className="mb-1 text-sm font-medium text-primary">{qt.verse}</p>
                      <p className="text-gray-700">{qt.verseText}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-xl bg-gray-50 p-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-500">묵상</h4>
                        <p className="text-sm text-gray-700">{qt.reflection}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-500">기도</h4>
                        <p className="text-sm text-gray-700">{qt.prayer}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-500">실천</h4>
                        <p className="text-sm text-gray-700">{qt.action}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'sermon' && sermonNote && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        설교 노트
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(sermonNote.title)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{sermonNote.title}</h3>
                        <p className="text-sm text-gray-500">{sermonNote.date}</p>
                      </div>
                      <div className="rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">{sermonNote.mainVerse}</div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-500">설교 개요</h4>
                      <ul className="space-y-2">
                        {sermonNote.outline.map((item, index) => (
                          <li key={item} className="flex items-center gap-2 text-gray-700">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                              {index + 1}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-500">적용 포인트</h4>
                      <p className="text-gray-700">{sermonNote.application}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'sns' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-primary" />
                      SNS 초안
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="whitespace-pre-wrap text-gray-700">{manuscript.substring(0, 500)}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-sm text-primary">#목보메이트</span>
                        <span className="text-sm text-primary">#주일메시지</span>
                        <span className="text-sm text-primary">#교회콘텐츠</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
