import apiClient from './client';
import type { ApiResponse, PricingRule } from '../types';

export const pricingRulesApi = {
  getRules: async (): Promise<PricingRule[]> => {
    const { data } = await apiClient.get<ApiResponse<PricingRule[]>>('/admin/pricing-rules');
    return data.data;
  },

  createRule: async (payload: Partial<PricingRule>): Promise<PricingRule> => {
    const { data } = await apiClient.post<ApiResponse<PricingRule>>('/admin/pricing-rules', payload);
    return data.data;
  },

  updateRule: async (id: string, payload: Partial<PricingRule>): Promise<PricingRule> => {
    const { data } = await apiClient.patch<ApiResponse<PricingRule>>(`/admin/pricing-rules/${id}`, payload);
    return data.data;
  },

  deleteRule: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/pricing-rules/${id}`);
  },
};

