import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        const { data } = await authApi.login({ email, password });
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        set({ user: data.user, isAuthenticated: true, loading: false });
      },

      register: async (formData) => {
        set({ loading: true });
        await authApi.register(formData);
        set({ loading: false });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        try {
          const { data } = await authApi.getProfile();
          set({ user: data, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    { name: 'auth-store', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
);
