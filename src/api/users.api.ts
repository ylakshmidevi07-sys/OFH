import apiClient from './client';
import type { ApiResponse, User } from '../types';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string | null;
  isDefault: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'cod';
  cardLastFour?: string | null;
  cardBrand?: string | null;
  isDefault: boolean;
}

export const usersApi = {
  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/users/profile');
    return data.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<User>>('/users/profile', payload);
    return data.data;
  },

  // Addresses
  getAddresses: async (): Promise<Address[]> => {
    const { data } = await apiClient.get<ApiResponse<Address[]>>('/users/addresses');
    return data.data;
  },

  createAddress: async (payload: Omit<Address, 'id' | 'isDefault'>): Promise<Address> => {
    const { data } = await apiClient.post<ApiResponse<Address>>('/users/addresses', payload);
    return data.data;
  },

  updateAddress: async (id: string, payload: Partial<Address>): Promise<Address> => {
    const { data } = await apiClient.patch<ApiResponse<Address>>(`/users/addresses/${id}`, payload);
    return data.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/addresses/${id}`);
  },

  // Payment methods
  getPaymentMethods: async (): Promise<SavedPaymentMethod[]> => {
    const { data } = await apiClient.get<ApiResponse<SavedPaymentMethod[]>>('/users/payment-methods');
    return data.data;
  },

  createPaymentMethod: async (payload: Omit<SavedPaymentMethod, 'id' | 'isDefault'>): Promise<SavedPaymentMethod> => {
    const { data } = await apiClient.post<ApiResponse<SavedPaymentMethod>>('/users/payment-methods', payload);
    return data.data;
  },

  deletePaymentMethod: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/payment-methods/${id}`);
  },
};
