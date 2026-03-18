import apiClient from './client';
import type { ApiResponse, Cart, CartItem } from '../types';

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const { data } = await apiClient.get<ApiResponse<Cart>>('/cart');
    return data.data;
  },

  addItem: async (productId: string, quantity: number = 1): Promise<CartItem> => {
    const { data } = await apiClient.post<ApiResponse<CartItem>>('/cart/items', {
      productId,
      quantity,
    });
    return data.data;
  },

  updateItem: async (itemId: string, quantity: number): Promise<CartItem> => {
    const { data } = await apiClient.patch<ApiResponse<CartItem>>(`/cart/items/${itemId}`, {
      quantity,
    });
    return data.data;
  },

  removeItem: async (itemId: string): Promise<void> => {
    await apiClient.delete(`/cart/items/${itemId}`);
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart');
  },
};

