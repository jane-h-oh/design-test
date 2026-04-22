import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';
import { Button, Input, Select, Modal } from '@/components/ui';
import { useAppStore } from '@/store';
import type { Schedule, ScheduleFormData } from '@/types';
import { formatDate } from '@/lib/utils';

const colorOptions = [
  { value: '#2D5A27', label: '녹색' },
  { value: '#8B4513', label: '브라운' },
  { value: '#3B82F6', label: '파란색' },
  { value: '#F59E0B', label: '주황색' },
  { value: '#EF4444', label: '빨간색' },
];

export function SchedulePage() {
  const { schedules, addSchedule, removeSchedule } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    allDay: true,
    color: '#2D5A27',
  });

  const sortedSchedules = [...schedules].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: Schedule = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSchedule(newSchedule);
    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      allDay: true,
      color: '#2D5A27',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      removeSchedule(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">일정 관리</h1>
          <p className="text-gray-500 mt-1">교회의 일정을 관리합니다</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          일정 추가
        </Button>
      </div>

      {/* Schedule List */}
      <div className="grid gap-4">
        {sortedSchedules.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">일정이 없습니다</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsModalOpen(true)}>
                첫 번째 일정 추가하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedSchedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-1 h-full min-h-[60px] rounded-full"
                      style={{ backgroundColor: schedule.color || '#2D5A27' }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{schedule.title}</h3>
                      {schedule.description && (
                        <p className="text-sm text-gray-500 mt-1">{schedule.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>시작: {formatDate(schedule.startDate)}</span>
                        {schedule.endDate && (
                          <span>종료: {formatDate(schedule.endDate)}</span>
                        )}
                        {schedule.allDay && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">종일</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(schedule.id)}>
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Schedule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="일정 추가">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="일정명"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="설명"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="시작 날짜"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="종료 날짜"
              type="date"
              value={formData.endDate || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allDay"
              checked={formData.allDay}
              onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="allDay" className="text-sm text-gray-700">종일 일정</label>
          </div>
          <Select
            label="색상"
            options={colorOptions}
            value={formData.color || '#2D5A27'}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
            <Button type="submit">추가</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}