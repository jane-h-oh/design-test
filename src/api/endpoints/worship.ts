import apiClient from '../base';
import type { Worship, WorshipFormData } from '@/types';

export const worshipApi = {
  getAll: async (params?: { startDate?: string; endDate?: string; type?: string }) => {
    const response = await apiClient.get<{ data: Worship[] }>('/worships', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Worship }>(`/worships/${id}`);
    return response.data;
  },

  create: async (data: WorshipFormData) => {
    const response = await apiClient.post<{ data: Worship }>('/worships', data);
    return response.data;
  },

  update: async (id: string, data: Partial<WorshipFormData>) => {
    const response = await apiClient.put<{ data: Worship }>(`/worships/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/worships/${id}`);
  },
};