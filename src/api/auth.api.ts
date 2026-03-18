import apiClient from './client';
import type { ApiResponse, LoginPayload, LoginResponse, RegisterPayload, User } from '../types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload);
    return data.data;
  },

  register: async (payload: RegisterPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', payload);
    return data.data;
  },

  refresh: async (refreshToken: string) => {
    const { data } = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/auth/refresh',
      null,
      { headers: { Authorization: `Bearer ${refreshToken}` } },
    );
    return data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
    return data.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email });
    return data.data;
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', { token, password });
    return data.data;
  },
};
