import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { homepageApi } from '../../api/homepage.api';
import { useAuthStore } from '../../stores/authStore';
import type { HomepageSection } from '../../types';

export const homepageKeys = {
  all: ['homepage'] as const,
  sections: () => [...homepageKeys.all, 'sections'] as const,
  publicLayout: () => [...homepageKeys.all, 'public'] as const,
};

export function useHomepageSections() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: homepageKeys.sections(),
    queryFn: () => homepageApi.getSections(),
    enabled: isAdmin,
  });
}

export function usePublicHomepage() {
  return useQuery({
    queryKey: homepageKeys.publicLayout(),
    queryFn: () => homepageApi.getPublicLayout(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateHomepageSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<HomepageSection>) => homepageApi.createSection(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageKeys.all });
    },
  });
}

export function useUpdateHomepageSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<HomepageSection>) =>
      homepageApi.updateSection(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageKeys.all });
    },
  });
}

export function useDeleteHomepageSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => homepageApi.deleteSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageKeys.all });
    },
  });
}

export function useReorderHomepageSections() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => homepageApi.reorderSections(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageKeys.all });
    },
  });
}

