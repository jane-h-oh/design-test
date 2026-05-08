import { useEffect, useState } from 'react';
import { BookOpen, Calendar, Heart, Sparkles } from 'lucide-react';
import { ChevronLeftIcon, ChevronRightIcon } from '@polaris/ui/icons';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';

const getSeasonalInfo = () => {
  const month = new Date().getMonth();

  const seasons = [
    { name: '봄', emoji: '🌱', start: 2, end: 4, themes: ['새출발', '부활', '성장'], verse: '이사야 40:31' },
    { name: '여름', emoji: '☀️', start: 5, end: 7, themes: ['사명', '열매', '비전'], verse: '요한복음 15:5' },
    { name: '가을', emoji: '🍁', start: 8, end: 10, themes: ['감사', '수확', '회복'], verse: '시편 23:1' },
    { name: '겨울', emoji: '❄️', start: 11, end: 1, themes: ['소망', '기다림', '빛'], verse: '요한복음 1:9' },
  ];

  return (
    seasons.find(
      (season) =>
        (season.start <= season.end && month >= season.start && month <= season.end) ||
        (season.start > season.end && (month >= season.start || month <= season.end))
    ) ?? seasons[0]
  );
};

const getScheduleData = () => [
  { day: 5, title: '주일 예배', type: 'worship' },
  { day: 7, title: '수요 예배', type: 'worship' },
  { day: 12, title: '주일 예배', type: 'worship' },
  { day: 14, title: '수요 예배', type: 'worship' },
  { day: 19, title: '주일 예배', type: 'worship' },
  { day: 21, title: '수요 예배', type: 'worship' },
  { day: 26, title: '주일 예배', type: 'worship' },
  { day: 28, title: '수요 예배', type: 'worship' },
];

export function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [seasonalInfo, setSeasonalInfo] = useState(getSeasonalInfo());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('ko-KR', { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const schedules = getScheduleData();

  useEffect(() => {
    setSeasonalInfo(getSeasonalInfo());
  }, []);

  const days = Array.from({ length: firstDay }, () => null as number | null);
  for (let i = 1; i <= daysInMonth; i += 1) {
    days.push(i);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="mt-1 text-gray-500">오늘의 사역 일정과 콘텐츠 준비 상태를 빠르게 확인하세요.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              사역 캘린더
            </CardTitle>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="rounded-lg p-1 transition-colors hover:bg-gray-100"
                aria-label="이전 달"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
              <span className="min-w-[96px] text-center text-sm font-medium">
                {year}년 {monthName}
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="rounded-lg p-1 transition-colors hover:bg-gray-100"
                aria-label="다음 달"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-gray-500 md:text-xs">
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const schedule = day ? schedules.find((item) => item.day === day) : null;
                const isToday =
                  day === new Date().getDate() &&
                  month === new Date().getMonth() &&
                  year === new Date().getFullYear();

                return (
                  <div
                    key={`${day ?? 'empty'}-${index}`}
                    className={cn(
                      'min-h-[72px] rounded-xl border p-1.5 text-center md:min-h-[88px] md:p-2',
                      day ? 'bg-white' : 'bg-gray-50',
                      isToday && 'ring-2 ring-primary'
                    )}
                  >
                    {day && (
                      <>
                        <div
                          className={cn(
                            'mb-1 text-xs font-semibold md:text-sm',
                            index % 7 === 0 ? 'text-red-500' : index % 7 === 6 ? 'text-blue-500' : 'text-gray-700'
                          )}
                        >
                          {day}
                        </div>
                        {schedule && (
                          <div className="rounded-lg bg-primary/10 px-1 py-1 text-[10px] text-primary md:text-xs">
                            {schedule.title}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              절기 가이드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-4 text-center">
              <div className="mb-2 text-4xl">{seasonalInfo.emoji}</div>
              <h3 className="text-lg font-bold text-gray-900">{seasonalInfo.name}</h3>
              <p className="mt-1 text-sm text-gray-500">이번 달 콘텐츠에 잘 어울리는 분위기입니다.</p>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500">추천 주제</p>
                <div className="flex flex-wrap gap-2">
                  {seasonalInfo.themes.map((theme) => (
                    <span key={theme} className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-gray-500">이번 달 말씀</p>
                <p className="rounded-lg bg-white/70 p-3 text-sm text-gray-700">{seasonalInfo.verse}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">빠른 작업</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="flex w-full items-center justify-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50">
              <div className="rounded-lg bg-primary/10 p-2">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm">성경 연구 바로가기</span>
            </Button>
            <Button variant="ghost" className="flex w-full items-center justify-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50">
              <div className="rounded-lg bg-secondary/10 p-2">
                <Sparkles className="h-4 w-4 text-secondary" />
              </div>
              <span className="text-sm">콘텐츠 초안 생성</span>
            </Button>
            <Button variant="ghost" className="flex w-full items-center justify-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50">
              <div className="rounded-lg bg-accent/10 p-2">
                <Heart className="h-4 w-4 text-accent" />
              </div>
              <span className="text-sm">목양 메모 정리</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
