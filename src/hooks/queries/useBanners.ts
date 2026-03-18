import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannersApi } from '../../api/banners.api';
import { useAuthStore } from '../../stores/authStore';
import type { Banner } from '../../types';

export const bannerKeys = {
  all: ['banners'] as const,
  admin: () => [...bannerKeys.all, 'admin'] as const,
  public: (placement?: string) => [...bannerKeys.all, 'public', placement] as const,
};

export function useAdminBanners() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: bannerKeys.admin(),
    queryFn: () => bannersApi.getBanners(),
    enabled: isAdmin,
  });
}

export function usePublicBanners(placement?: string) {
  return useQuery({
    queryKey: bannerKeys.public(placement),
    queryFn: () => bannersApi.getPublicBanners(placement),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Banner>) => bannersApi.createBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Banner>) =>
      bannersApi.updateBanner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bannersApi.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
    },
  });
}

