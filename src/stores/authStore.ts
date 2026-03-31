import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = "customer" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      
      login: (userData) => {
        set({ user: userData, isLoggedIn: true });
        localStorage.setItem("chronos_user", JSON.stringify(userData));
      },
      
      logout: () => {
        set({ user: null, isLoggedIn: false });
        localStorage.removeItem("chronos_user");
        localStorage.removeItem("admin_logged_in");
      },
      
      register: (userData) => {
        set({ user: userData, isLoggedIn: true });
        localStorage.setItem("chronos_user", JSON.stringify(userData));
      },
    }),
    {
      name: 'chronos-auth-storage',
    }
  )
);
