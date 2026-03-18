import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../stores/authStore';
import type { LoginPayload, RegisterPayload } from '../../types';

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
    },
  });
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => {
      login(data.user, data.accessToken, data.refreshToken);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}

