import apiClient from './client';
import type { ApiResponse, HealthCheck, SystemMetrics } from '../types';

export const observabilityApi = {
  getHealth: async (): Promise<HealthCheck> => {
    const { data } = await apiClient.get<ApiResponse<HealthCheck>>('/health');
    return data.data;
  },

  getMetrics: async (): Promise<SystemMetrics> => {
    const { data } = await apiClient.get<ApiResponse<SystemMetrics>>('/metrics');
    return data.data;
  },
};

