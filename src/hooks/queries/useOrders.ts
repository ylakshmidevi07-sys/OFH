import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../../api/orders.api';
import { useAuthStore } from '../../stores/authStore';
import { cartKeys } from './useCart';
import { adminKeys } from './useAdmin';
import type { CreateOrderPayload } from '../../types';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: any) => [...orderKeys.lists(), params] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
  admin: () => [...orderKeys.all, 'admin'] as const,
  adminList: (params: any) => [...orderKeys.admin(), params] as const,
};

export function useOrders(params?: { page?: number; status?: string }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.getOrders(params),
    enabled: isAuthenticated,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
  });
}

/** Query hook – fetches order by orderNumber/identifier on mount (OrderDetail page). */
export function useTrackOrder(identifier: string) {
  return useQuery({
    queryKey: [...orderKeys.all, 'track', identifier] as const,
    queryFn: async () => {
      try {
        return await ordersApi.trackOrder(identifier);
      } catch {
        // Fallback: try getOrder by UUID
        return await ordersApi.getOrder(identifier);
      }
    },
    enabled: !!identifier,
    retry: false,
  });
}

/** Mutation hook – triggered by form submit on TrackOrder page. */
export function useTrackOrderMutation() {
  return useMutation({
    mutationFn: (orderNumber: string) => ordersApi.trackOrder(orderNumber),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: adminKeys.inventory });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
    },
  });
}

// Admin
export function useAdminOrders(params?: { page?: number; status?: string; sortBy?: string; sortOrder?: string }) {
  const isAdmin = useAuthStore((s) => s.isAdmin);

  return useQuery({
    queryKey: orderKeys.adminList(params),
    queryFn: () => ordersApi.getAdminOrders(params),
    enabled: isAdmin,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: adminKeys.inventory });
    },
  });
}

