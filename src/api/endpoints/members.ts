import apiClient from '../base';
import type { Member, MemberFormData } from '@/types';

// Member API - MCP 연동 시 이 모듈만 교체하면 됨
export const memberApi = {
  getAll: async (params?: { search?: string; role?: string; group?: string }) => {
    const response = await apiClient.get<{ data: Member[]; total: number }>('/members', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<{ data: Member }>(`/members/${id}`);
    return response.data;
  },

  create: async (data: MemberFormData) => {
    const response = await apiClient.post<{ data: Member }>('/members', data);
    return response.data;
  },

  update: async (id: string, data: Partial<MemberFormData>) => {
    const response = await apiClient.put<{ data: Member }>(`/members/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/members/${id}`);
  },
};