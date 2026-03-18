import apiClient from './client';
import type { ApiResponse, Banner } from '../types';

export const bannersApi = {
  // Admin endpoints
  getBanners: async (): Promise<Banner[]> => {
    const { data } = await apiClient.get<ApiResponse<Banner[]>>('/admin/banners');
    return data.data;
  },

  createBanner: async (payload: Partial<Banner>): Promise<Banner> => {
    const { data } = await apiClient.post<ApiResponse<Banner>>('/admin/banners', payload);
    return data.data;
  },

  updateBanner: async (id: string, payload: Partial<Banner>): Promise<Banner> => {
    const { data } = await apiClient.patch<ApiResponse<Banner>>(`/admin/banners/${id}`, payload);
    return data.data;
  },

  deleteBanner: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/banners/${id}`);
  },

  // Public endpoint
  getPublicBanners: async (placement?: string): Promise<Banner[]> => {
    const { data } = await apiClient.get<ApiResponse<Banner[]>>('/banners', {
      params: { placement },
    });
    return data.data;
  },
};

