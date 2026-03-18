import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailCampaignsApi } from '../../api/email-campaigns.api';
import { useAuthStore } from '../../stores/authStore';
import type { EmailCampaign } from '../../types';

export const campaignKeys = {
  all: ['emailCampaigns'] as const,
  detail: (id: string) => [...campaignKeys.all, id] as const,
};

export function useEmailCampaigns() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: campaignKeys.all,
    queryFn: () => emailCampaignsApi.getCampaigns(),
    enabled: isAdmin,
  });
}

export function useEmailCampaign(id: string) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: campaignKeys.detail(id),
    queryFn: () => emailCampaignsApi.getCampaign(id),
    enabled: isAdmin && !!id,
  });
}

export function useCreateEmailCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<EmailCampaign>) => emailCampaignsApi.createCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
}

export function useUpdateEmailCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<EmailCampaign>) =>
      emailCampaignsApi.updateCampaign(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
}

export function useDeleteEmailCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emailCampaignsApi.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
}

export function useSendEmailCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emailCampaignsApi.sendCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.all });
    },
  });
}

