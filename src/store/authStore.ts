// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/utils/axios';
import type { LoginRequest, LoginResponse, ApiResponse } from '@/types/api';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,

      login: async ({ username, password }) => {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/auth/login', {
          username,
          password,
        });
        set({ token: response.data.data.token, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);