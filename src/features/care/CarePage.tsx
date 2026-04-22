import { useState } from 'react';
import { Heart, Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea, Input } from '@/components/ui';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'grateful' | 'peaceful' | 'struggling' | 'hopeful';
}

export function CarePage() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2026-04-20',
      title: '오늘의 감사',
      content: '오늘 아침祷告中에 깊은 평화를 느꼈습니다. 主의 사랑에 감사합니다.',
      mood: 'grateful',
    },
    {
      id: '2',
      date: '2026-04-19',
      title: '묵상',
      content: '요한복음 15장을 읽으며葡萄나무와 가지에 대한 말씀을 묵상했습니다.',
      mood: 'peaceful',
    },
  ]);
  
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);

  const handleAddEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      title: newEntry.title,
      content: newEntry.content,
      mood: 'grateful',
    };
    
    setEntries([entry, ...entries]);
    setNewEntry({ title: '', content: '' });
    setShowForm(false);
  };

  const moodEmoji = (mood: string) => {
    switch (mood) {
      case 'grateful': return '🙏';
      case 'peaceful': return '🕊️';
      case 'struggling': return '💪';
      case 'hopeful': return '🌟';
      default: return '💚';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">영적 케어</h1>
          <p className="text-gray-500 mt-1">나의 영적 성장과 묵상을 기록하세요</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          새 항목
        </Button>
      </div>

      {/* 새 항목 입력 */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>새 묵상 기록</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="제목"
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            />
            <Textarea
              placeholder="오늘의 묵상, 감사, 또는 기도를 기록하세요..."
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>취소</Button>
              <Button onClick={handleAddEntry}>저장</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">📖</div>
            <p className="text-sm text-gray-500">총 기록</p>
            <p className="text-xl font-bold text-gray-900">{entries.length}개</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">🙏</div>
            <p className="text-sm text-gray-500">감사</p>
            <p className="text-xl font-bold text-gray-900">
              {entries.filter(e => e.mood === 'grateful').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">🕊️</div>
            <p className="text-sm text-gray-500">평화</p>
            <p className="text-xl font-bold text-gray-900">
              {entries.filter(e => e.mood === 'peaceful').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">🌟</div>
            <p className="text-sm text-gray-500">희망</p>
            <p className="text-xl font-bold text-gray-900">
              {entries.filter(e => e.mood === 'hopeful').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 기록 목록 */}
      <div className="grid gap-4">
        {entries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">아직 기록이 없습니다</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>
                첫 번째 묵상을 기록하세요
              </Button>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{moodEmoji(entry.mood)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {entry.date}
                      </p>
                      <p className="text-gray-700 mt-3">{entry.content}</p>
                    </div>
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