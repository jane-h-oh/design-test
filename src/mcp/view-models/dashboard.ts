type CalendarTagTone = 'worship' | 'sermon' | 'care' | 'draft' | 'rehearsal';

interface CalendarTag {
  label: string;
  tone: CalendarTagTone;
}

interface CalendarDay {
  date: number;
  isToday: boolean;
  summary: string;
  tags: CalendarTag[];
}

const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

function buildTags(weekday: number): CalendarTag[] {
  if (weekday === 0) {
    return [{ label: '예배', tone: 'worship' }];
  }

  if (weekday === 2 || weekday === 4) {
    return [{ label: '케어', tone: 'care' }];
  }

  if (weekday === 3) {
    return [{ label: '설교', tone: 'sermon' }];
  }

  if (weekday === 5) {
    return [
      { label: '설교', tone: 'sermon' },
      { label: '원고', tone: 'draft' },
    ];
  }

  if (weekday === 6) {
    return [{ label: '리허설', tone: 'rehearsal' }];
  }

  return [];
}

function buildSummary(weekday: number): string {
  if (weekday === 0) return '주일 1, 2, 3부 예배';
  if (weekday === 2 || weekday === 4) return '교구 심방 및 성경 공부';
  if (weekday === 3) return '수요 기도회';
  if (weekday === 5) return '금요 철야 기도회 및 주일 원고 마감';
  if (weekday === 6) return '결혼식 및 주일 예배 리허설';
  return '';
}

export function getDashboardCalendar() {
  const year = 2026;
  const month = 3;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: firstDay }, () => null as CalendarDay | null);

  for (let date = 1; date <= daysInMonth; date += 1) {
    const weekday = new Date(year, month, date).getDay();
    days.push({
      date,
      isToday: date === 22,
      summary: buildSummary(weekday),
      tags: buildTags(weekday),
    });
  }

  return {
    year,
    monthLabel: monthNames[month],
    weekdays,
    days,
  };
}

export function getSeasonalBriefing() {
  return {
    season: '사순절 가이드',
    headline: '묵상과 회복의 리듬을 깊게 가져가면 반응이 좋습니다.',
    summary:
      '사순절 메시지는 길게 설명하기보다 회복, 침묵, 순종의 흐름을 짧고 또렷하게 연결할 때 전달력이 높아집니다.',
    actionGuide:
      '이번 주는 주일 설교 문장을 묵상형 카드 한 장과 심방용 질문 두 개로 나눠 재활용하면 준비 시간이 가장 효율적입니다.',
    focuses: [
      { title: '설교 톤', description: '짧고 단단한 문장으로 여운을 남기고, 적용은 한 단계씩 제안합니다.' },
      { title: '심방 포인트', description: '화요일과 목요일 일정에는 회복, 위로, 재결단 질문을 우선 배치합니다.' },
    ],
  };
}
