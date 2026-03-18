import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '../types';

export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

type AppRole = 'admin' | 'moderator' | 'user';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  _bootstrapped: boolean;

  // Derived role helpers
  roles: AppRole[];
  hasRole: (role: AppRole) => boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setProfile: (profile: Profile) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  hydrate: () => void;
  bootstrap: () => Promise<void>;
}

const deriveRoles = (user: User | null): AppRole[] => {
  if (!user) return [];
  const r = user.role as string;
  if (r === 'ADMIN') return ['admin'];
  if (r === 'MODERATOR') return ['moderator'];
  return ['user'];
};

const toProfile = (u: User): Profile => ({
  id: u.id,
  user_id: u.id,
  first_name: u.firstName ?? null,
  last_name: u.lastName ?? null,
  email: u.email ?? null,
  phone: u.phone ?? null,
  avatar_url: null,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: true,
      _bootstrapped: false,
      roles: [],

      hasRole: (role: AppRole) => get().roles.includes(role),

      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ accessToken, refreshToken });
      },

      setUser: (user) => {
        const roles = deriveRoles(user);
        set({
          user,
          profile: toProfile(user),
          isAuthenticated: true,
          isAdmin: user.role === ('ADMIN' as Role),
          roles,
        });
      },

      setProfile: (profile) => {
        set({ profile });
      },

      login: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        const roles = deriveRoles(user);
        set({
          user,
          profile: toProfile(user),
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isAdmin: user.role === ('ADMIN' as Role),
          roles,
          loading: false,
          _bootstrapped: true,
        });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          profile: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isAdmin: false,
          roles: [],
          loading: false,
          _bootstrapped: true,
        });
      },

      hydrate: () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (accessToken && refreshToken) {
          set({ accessToken, refreshToken });
        }
      },

      bootstrap: async () => {
        if (get()._bootstrapped) return;
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          set({ loading: false, _bootstrapped: true });
          return;
        }
        try {
          const { authApi } = await import('../api/auth.api');
          const me = await authApi.getMe();
          let profileUser = me;
          try {
            const { usersApi } = await import('../api/users.api');
            profileUser = await usersApi.getProfile();
          } catch {
            // Fallback to /auth/me payload
          }
          const roles = deriveRoles(profileUser);
          set({
            user: profileUser,
            profile: toProfile(profileUser),
            isAuthenticated: true,
            isAdmin: profileUser.role === ('ADMIN' as Role),
            roles,
            loading: false,
            _bootstrapped: true,
          });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        roles: state.roles,
      }),
    },
  ),
);

