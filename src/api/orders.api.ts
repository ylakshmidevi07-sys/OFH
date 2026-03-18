import apiClient from './client';
import type {
  ApiResponse,
  Order,
  OrdersResponse,
  CreateOrderPayload,
} from '../types';

export const ordersApi = {
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await apiClient.post<ApiResponse<Order>>('/orders', payload);
    return data.data;
  },

  getOrders: async (params?: { page?: number; limit?: number; status?: string }): Promise<OrdersResponse> => {
    const { data } = await apiClient.get<ApiResponse<OrdersResponse>>('/orders', { params });
    return data.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },

  trackOrder: async (orderNumber: string): Promise<Order> => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/track/${orderNumber}`);
    return data.data;
  },

  validatePromo: async (code: string, orderTotal: number): Promise<{ valid: boolean; promoCode?: any; discount?: number; error?: string }> => {
    const { data } = await apiClient.post<ApiResponse<any>>('/orders/validate-promo', { code, orderTotal });
    return data.data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const { data } = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return data.data;
  },

  // Admin endpoints
  getAdminOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<OrdersResponse> => {
    const { data } = await apiClient.get<ApiResponse<OrdersResponse>>('/orders/admin/all', { params });
    return data.data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const { data } = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    return data.data;
  },
};


