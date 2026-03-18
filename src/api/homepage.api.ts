import apiClient from './client';
import type { ApiResponse, HomepageSection } from '../types';

export const homepageApi = {
  // Admin endpoints
  getSections: async (): Promise<HomepageSection[]> => {
    const { data } = await apiClient.get<ApiResponse<HomepageSection[]>>('/admin/homepage-sections');
    return data.data;
  },

  createSection: async (payload: Partial<HomepageSection>): Promise<HomepageSection> => {
    const { data } = await apiClient.post<ApiResponse<HomepageSection>>('/admin/homepage-sections', payload);
    return data.data;
  },

  updateSection: async (id: string, payload: Partial<HomepageSection>): Promise<HomepageSection> => {
    const { data } = await apiClient.patch<ApiResponse<HomepageSection>>(`/admin/homepage-sections/${id}`, payload);
    return data.data;
  },

  deleteSection: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/homepage-sections/${id}`);
  },

  reorderSections: async (orderedIds: string[]): Promise<void> => {
    await apiClient.post('/admin/homepage-sections/reorder', { orderedIds });
  },

  // Public endpoint
  getPublicLayout: async (): Promise<HomepageSection[]> => {
    const { data } = await apiClient.get<ApiResponse<HomepageSection[]>>('/homepage-layout');
    return data.data;
  },
};

