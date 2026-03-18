import apiClient from './client';
import type { ApiResponse, StoreSettings } from '../types';

export const storeSettingsApi = {
  // Admin endpoint
  getSettings: async (): Promise<StoreSettings> => {
    const { data } = await apiClient.get<ApiResponse<StoreSettings>>('/admin/store-settings');
    return data.data;
  },

  updateSettings: async (payload: Partial<StoreSettings>): Promise<StoreSettings> => {
    const { data } = await apiClient.patch<ApiResponse<StoreSettings>>('/admin/store-settings', payload);
    return data.data;
  },

  // Public endpoint
  getPublicSettings: async (): Promise<StoreSettings> => {
    const { data } = await apiClient.get<ApiResponse<StoreSettings>>('/store-settings');
    return data.data;
  },
};

