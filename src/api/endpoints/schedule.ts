import apiClient from '../base';
import type { Schedule, ScheduleFormData } from '@/types';

export const scheduleApi = {
  getAll: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get<{ data: Schedule[] }>('/schedules', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Schedule }>(`/schedules/${id}`);
    return response.data;
  },

  create: async (data: ScheduleFormData) => {
    const response = await apiClient.post<{ data: Schedule }>('/schedules', data);
    return response.data;
  },

  update: async (id: string, data: Partial<ScheduleFormData>) => {
    const response = await apiClient.put<{ data: Schedule }>(`/schedules/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/schedules/${id}`);
  },
};