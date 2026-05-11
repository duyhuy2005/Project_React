import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '../services/authService';
import type { User, LegacyUser } from '../types';
import { toLegacyUser } from '../types';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export type UserRole = "customer" | "admin";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  // Helper to get user in legacy format
  getLegacyUser: () => LegacyUser | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({
            email: data.email,
            matKhau: data.password,
          });
          
          if (response.success && response.user && response.token) {
            set({
              user: response.user,
              token: response.token,
              isLoggedIn: true,
              isLoading: false,
            });
            
            localStorage.setItem("chronos_user", JSON.stringify(response.user));
            if (response.user.vaiTro === 'admin') {
              localStorage.setItem("admin_logged_in", "true");
            } else {
              localStorage.removeItem("admin_logged_in");
            }
          }
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, 'Đăng nhập thất bại'),
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register({
            ten: data.name,
            email: data.email,
            matKhau: data.password,
            soDienThoai: data.phone,
          });
          
          if (response.success && response.user && response.token) {
            set({
              user: response.user,
              token: response.token,
              isLoggedIn: true,
              isLoading: false,
            });
            
            localStorage.setItem("chronos_user", JSON.stringify(response.user));
            localStorage.removeItem("admin_logged_in");
          }
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, 'Đăng ký thất bại'),
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          error: null,
        });
        localStorage.removeItem("chronos_user");
        localStorage.removeItem("admin_logged_in");
      },

      clearError: () => set({ error: null }),

      getLegacyUser: () => {
        const user = get().user;
        return user ? toLegacyUser(user) : null;
      },
    }),
    {
      name: 'chronos-auth-storage',
    }
  )
);

// Export User type for backward compatibility
export type { User };
