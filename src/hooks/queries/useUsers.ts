import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/users.api';
import { useAuthStore } from '../../stores/authStore';
import type { Address, SavedPaymentMethod } from '../../api/users.api';

export const userKeys = {
  all: ['users'] as const,
  addresses: () => [...userKeys.all, 'addresses'] as const,
  paymentMethods: () => [...userKeys.all, 'paymentMethods'] as const,
};

// ── Address hooks ──────────────────────────────────────────────────────────

export function useAddresses() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: userKeys.addresses(),
    queryFn: () => usersApi.getAddresses(),
    enabled: isAuthenticated,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Address, 'id' | 'isDefault'>) =>
      usersApi.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.addresses() });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Address>) =>
      usersApi.updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.addresses() });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.addresses() });
    },
  });
}

// ── Payment method hooks ───────────────────────────────────────────────────

export function usePaymentMethods() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: userKeys.paymentMethods(),
    queryFn: () => usersApi.getPaymentMethods(),
    enabled: isAuthenticated,
  });
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<SavedPaymentMethod, 'id' | 'isDefault'>) =>
      usersApi.createPaymentMethod(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.paymentMethods() });
    },
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.paymentMethods() });
    },
  });
}

