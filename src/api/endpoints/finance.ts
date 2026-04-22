import apiClient from '../base';
import type { Finance, FinanceFormData } from '@/types';

export const financeApi = {
  getAll: async (params?: { startDate?: string; endDate?: string; type?: string; category?: string }) => {
    const response = await apiClient.get<{ data: Finance[]; total: number }>('/finance', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Finance }>(`/finance/${id}`);
    return response.data;
  },

  create: async (data: FinanceFormData) => {
    const response = await apiClient.post<{ data: Finance }>('/finance', data);
    return response.data;
  },

  update: async (id: string, data: Partial<FinanceFormData>) => {
    const response = await apiClient.put<{ data: Finance }>(`/finance/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/finance/${id}`);
  },

  getSummary: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get<{ income: number; expense: number; balance: number }>('/finance/summary', { params });
    return response.data;
  },
};