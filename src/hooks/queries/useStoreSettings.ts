import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeSettingsApi } from '../../api/store-settings.api';
import { useAuthStore } from '../../stores/authStore';
import type { StoreSettings } from '../../types';

export const storeSettingsKeys = {
  all: ['storeSettings'] as const,
  public: ['storeSettings', 'public'] as const,
};

export function useStoreSettings() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: storeSettingsKeys.all,
    queryFn: () => storeSettingsApi.getSettings(),
    enabled: isAdmin,
  });
}

export function usePublicStoreSettings() {
  return useQuery({
    queryKey: storeSettingsKeys.public,
    queryFn: () => storeSettingsApi.getPublicSettings(),
    staleTime: 30 * 60 * 1000, // 30 min
  });
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<StoreSettings>) => storeSettingsApi.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeSettingsKeys.all });
      queryClient.invalidateQueries({ queryKey: storeSettingsKeys.public });
    },
  });
}

