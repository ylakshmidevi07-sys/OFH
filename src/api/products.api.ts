import apiClient from './client';
import type { ApiResponse, Product, ProductQueryParams, ProductsResponse } from '../types';

export const productsApi = {
  getProducts: async (params?: ProductQueryParams): Promise<ProductsResponse> => {
    const { data } = await apiClient.get<ApiResponse<ProductsResponse>>('/products', { params });
    return data.data;
  },

  getProduct: async (slug: string): Promise<Product> => {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`);
    return data.data;
  },

  createProduct: async (payload: Partial<Product> & { stock?: number }): Promise<Product> => {
    const { data } = await apiClient.post<ApiResponse<Product>>('/products', payload);
    return data.data;
  },

  updateProduct: async (id: string, payload: Partial<Product> & { stock?: number }): Promise<Product> => {
    const { data } = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, payload);
    return data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};

