import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin.api';
import { useAuthStore } from '../../stores/authStore';
import { productKeys } from './useProducts';
import { reviewKeys } from './useReviews';
import type { PromoCode } from '../../types';

export const adminKeys = {
  dashboard: ['admin', 'dashboard'] as const,
  sales: (startDate?: string, endDate?: string) => ['admin', 'sales', startDate, endDate] as const,
  topProducts: ['admin', 'topProducts'] as const,
  customers: ['admin', 'customers'] as const,
  inventory: ['admin', 'inventory'] as const,
  lowStock: ['admin', 'lowStock'] as const,
  users: (params?: any) => ['admin', 'users', params] as const,
  reviews: (params?: any) => ['admin', 'reviews', params] as const,
  promoCodes: ['admin', 'promoCodes'] as const,
  featuredProducts: ['admin', 'featuredProducts'] as const,
  publicFeaturedProducts: ['featuredProducts'] as const,
  revenueBreakdown: (startDate?: string, endDate?: string) => ['admin', 'revenueBreakdown', startDate, endDate] as const,
  productAnalytics: ['admin', 'productAnalytics'] as const,
  conversionRate: ['admin', 'conversionRate'] as const,
};

export function useDashboard() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: () => adminApi.getDashboard(),
    enabled: isAdmin,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useSalesAnalytics(startDate?: string, endDate?: string) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.sales(startDate, endDate),
    queryFn: () => adminApi.getSalesAnalytics(startDate, endDate),
    enabled: isAdmin,
  });
}

export function useTopProducts() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.topProducts,
    queryFn: () => adminApi.getTopProducts(),
    enabled: isAdmin,
  });
}

export function useCustomerAnalytics() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.customers,
    queryFn: () => adminApi.getCustomerAnalytics(),
    enabled: isAdmin,
  });
}

export function useRevenueBreakdown(startDate?: string, endDate?: string) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.revenueBreakdown(startDate, endDate),
    queryFn: () => adminApi.getRevenueBreakdown(startDate, endDate),
    enabled: isAdmin,
  });
}

export function useProductAnalytics() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.productAnalytics,
    queryFn: () => adminApi.getProductAnalytics(),
    enabled: isAdmin,
  });
}

export function useConversionRate() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.conversionRate,
    queryFn: () => adminApi.getConversionRate(),
    enabled: isAdmin,
  });
}

export function useInventory() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.inventory,
    queryFn: () => adminApi.getInventory(),
    enabled: isAdmin,
  });
}

export function useLowStock() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.lowStock,
    queryFn: () => adminApi.getLowStock(),
    enabled: isAdmin,
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, ...payload }: { productId: string; stock?: number; lowStockThreshold?: number }) =>
      adminApi.updateInventory(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.inventory });
      queryClient.invalidateQueries({ queryKey: adminKeys.lowStock });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useAdminUsers(params?: { page?: number; limit?: number }) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => adminApi.getUsers(params),
    enabled: isAdmin,
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.blockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useActivityLog(params?: { page?: number; pageSize?: number; email?: string; eventType?: string }) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: ['admin', 'activityLog', params] as const,
    queryFn: () => adminApi.getActivityLog(params),
    enabled: isAdmin,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; role?: string; isActive?: boolean }) =>
      adminApi.updateUserRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useInviteUsers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_payload: { emails: string[]; role: string }) => {
      return Promise.resolve({ invited: _payload.emails.length });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// ── Admin Reviews ─────────────────────────────────────────────────────

export function useAdminReviews(params?: { page?: number; limit?: number; status?: string }) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.reviews(params),
    queryFn: () => adminApi.getAdminReviews(params),
    enabled: isAdmin,
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      adminApi.updateReviewStatus(id, verified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

// ── Promo Codes ───────────────────────────────────────────────────────

export function usePromoCodes() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.promoCodes,
    queryFn: () => adminApi.getPromoCodes(),
    enabled: isAdmin,
  });
}

export function useCreatePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<PromoCode, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>) =>
      adminApi.createPromoCode(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.promoCodes });
    },
  });
}

export function useUpdatePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<PromoCode>) =>
      adminApi.updatePromoCode(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.promoCodes });
    },
  });
}

export function useDeletePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deletePromoCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.promoCodes });
    },
  });
}

// ── Featured Products ─────────────────────────────────────────────────

export function useAdminFeaturedProducts() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  return useQuery({
    queryKey: adminKeys.featuredProducts,
    queryFn: () => adminApi.getFeaturedProducts(),
    enabled: isAdmin,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: adminKeys.publicFeaturedProducts,
    queryFn: () => adminApi.getPublicFeaturedProducts(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddFeaturedProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, position }: { productId: string; position?: number }) =>
      adminApi.addFeaturedProduct(productId, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.featuredProducts });
      queryClient.invalidateQueries({ queryKey: adminKeys.publicFeaturedProducts });
    },
  });
}

export function useUpdateFeaturedProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; position?: number; isActive?: boolean }) =>
      adminApi.updateFeaturedProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.featuredProducts });
      queryClient.invalidateQueries({ queryKey: adminKeys.publicFeaturedProducts });
    },
  });
}

export function useRemoveFeaturedProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.removeFeaturedProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.featuredProducts });
      queryClient.invalidateQueries({ queryKey: adminKeys.publicFeaturedProducts });
    },
  });
}
