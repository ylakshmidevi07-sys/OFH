import apiClient from './client';
import type { ApiResponse, Category } from '../types';

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },

  getCategory: async (slug: string): Promise<Category> => {
    const { data } = await apiClient.get<ApiResponse<Category>>(`/categories/${slug}`);
    return data.data;
  },

  createCategory: async (payload: Partial<Category>): Promise<Category> => {
    const { data } = await apiClient.post<ApiResponse<Category>>('/categories', payload);
    return data.data;
  },

  updateCategory: async (id: string, payload: Partial<Category>): Promise<Category> => {
    const { data } = await apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, payload);
    return data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};

