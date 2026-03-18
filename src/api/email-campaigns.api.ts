import apiClient from './client';
import type { ApiResponse, EmailCampaign } from '../types';

export const emailCampaignsApi = {
  getCampaigns: async (): Promise<EmailCampaign[]> => {
    const { data } = await apiClient.get<ApiResponse<EmailCampaign[]>>('/admin/email-campaigns');
    return data.data;
  },

  getCampaign: async (id: string): Promise<EmailCampaign> => {
    const { data } = await apiClient.get<ApiResponse<EmailCampaign>>(`/admin/email-campaigns/${id}`);
    return data.data;
  },

  createCampaign: async (payload: Partial<EmailCampaign>): Promise<EmailCampaign> => {
    const { data } = await apiClient.post<ApiResponse<EmailCampaign>>('/admin/email-campaigns', payload);
    return data.data;
  },

  updateCampaign: async (id: string, payload: Partial<EmailCampaign>): Promise<EmailCampaign> => {
    const { data } = await apiClient.patch<ApiResponse<EmailCampaign>>(`/admin/email-campaigns/${id}`, payload);
    return data.data;
  },

  deleteCampaign: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/email-campaigns/${id}`);
  },

  sendCampaign: async (id: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(`/admin/email-campaigns/${id}/send`);
    return data.data;
  },
};

