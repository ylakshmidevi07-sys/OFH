import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../../api/categories.api';
import type { Category } from '../../types';
import { productKeys } from './useProducts';

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (slug: string) => [...categoryKeys.all, slug] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoriesApi.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 min
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => categoriesApi.getCategory(slug),
    enabled: !!slug,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Category>) => categoriesApi.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Category>) =>
      categoriesApi.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
