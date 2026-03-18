/**
 * Auth action hooks — thin wrappers over authApi + authStore.
 * Drop-in replacements for the old AuthContext methods.
 */
import { useCallback } from 'react';
import { authApi } from '@/api/auth.api';
import { usersApi } from '@/api/users.api';
import { useAuthStore, type Profile } from '@/stores/authStore';
import { useQueryClient } from '@tanstack/react-query';

export function useSignIn() {
  const storeLogin = useAuthStore((s) => s.login);

  return useCallback(async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });
      storeLogin(data.user, data.accessToken, data.refreshToken);
      return { error: null };
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Login failed';
      return { error: new Error(message) };
    }
  }, [storeLogin]);
}

export function useSignUp() {
  const storeLogin = useAuthStore((s) => s.login);

  return useCallback(async (email: string, password: string) => {
    try {
      const data = await authApi.register({ email, password });
      storeLogin(data.user, data.accessToken, data.refreshToken);
      return { error: null };
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Sign up failed';
      return { error: new Error(message) };
    }
  }, [storeLogin]);
}

export function useSignOut() {
  const storeLogout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors — clear local state regardless.
    }
    storeLogout();
    queryClient.clear();
  }, [storeLogout, queryClient]);
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);

  return useCallback(async (data: Partial<Profile>) => {
    try {
      const updated = await usersApi.updateProfile({
        firstName: data.first_name ?? undefined,
        lastName: data.last_name ?? undefined,
        phone: data.phone ?? undefined,
      });
      setUser(updated);
      return { error: null };
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Profile update failed';
      return { error: new Error(message) };
    }
  }, [setUser]);
}

