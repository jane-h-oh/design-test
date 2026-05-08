import { useState } from 'react';
import { Archive, FileText, Heart, Clock } from 'lucide-react';
import { DeleteIcon, DownloadIcon } from '@polaris/ui/icons';
import { Card, CardContent, Button } from '@/components/ui';

interface ArchiveItem {
  id: string;
  type: 'sermon' | 'qt' | 'card' | 'journal';
  title: string;
  date: string;
  preview: string;
}

export function ArchivePage() {
  const [items] = useState<ArchiveItem[]>([
    {
      id: '1',
      type: 'sermon',
      title: '주일 설교 - 사랑의 말씀',
      date: '2026-04-20',
      preview: '요한복음 13:34를 통한 사랑의 명령...',
    },
    {
      id: '2',
      type: 'qt',
      title: 'QT - 오늘의 묵상',
      date: '2026-04-19',
      preview: '시편 23편을 통한 Shepherd의 사랑...',
    },
    {
      id: '3',
      type: 'card',
      title: '말씀 카드 - 믿음',
      date: '2026-04-18',
      preview: '히브리서 11:1 믿음은 바라는 것들의 실체...',
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sermon': return <FileText className="w-4 h-4" />;
      case 'qt': return <Heart className="w-4 h-4" />;
      case 'card': return <Archive className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sermon': return '설교';
      case 'qt': return 'QT';
      case 'card': return '카드';
      case 'journal': return '묵상';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">사역 아카이브</h1>
        <p className="text-gray-500 mt-1">생성한 콘텐츠를 저장하고 관리하세요</p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm text-gray-500">설교</p>
            <p className="text-xl font-bold text-gray-900">
              {items.filter(i => i.type === 'sermon').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-sm text-gray-500">QT</p>
            <p className="text-xl font-bold text-gray-900">
              {items.filter(i => i.type === 'qt').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Archive className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-sm text-gray-500">카드</p>
            <p className="text-xl font-bold text-gray-900">
              {items.filter(i => i.type === 'card').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">전체</p>
            <p className="text-xl font-bold text-gray-900">{items.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* 아카이브 목록 */}
      <div className="grid gap-4">
        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">저장된 콘텐츠가 없습니다</p>
              <p className="text-sm text-gray-400 mt-1">콘텐츠 스튜디오에서 생성한 콘텐츠가 여기에 저장됩니다</p>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.preview}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <DownloadIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <DeleteIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
