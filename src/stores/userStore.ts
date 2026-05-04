import { create } from 'zustand';
import userService from '../services/userService';
import type { UpdateUserRequest, User } from '../services/userService';

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

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (params?: { role?: string; search?: string }) => Promise<void>;
  getUserById: (id: number) => Promise<User | null>;
  updateUser: (id: number, data: UpdateUserRequest) => Promise<void>;
  changeUserRole: (id: number, role: string) => Promise<void>;
  changeUserPassword: (id: number, newPassword: string) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async (params) => {
    set({ loading: true, error: null });
    try {
      const users = await userService.getAll(params);
      set({ users, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải người dùng'),
        loading: false,
      });
    }
  },

  getUserById: async (id: number) => {
    try {
      const user = await userService.getById(id);
      return user;
    } catch (error: unknown) {
      set({ error: getErrorMessage(error, 'Không tìm thấy người dùng') });
      return null;
    }
  },

  updateUser: async (id: number, data: UpdateUserRequest) => {
    set({ loading: true, error: null });
    try {
      await userService.update(id, data);
      await get().fetchUsers();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi cập nhật người dùng'),
        loading: false,
      });
      throw error;
    }
  },

  changeUserRole: async (id: number, role: string) => {
    set({ loading: true, error: null });
    try {
      await userService.changeRole(id, role);
      await get().fetchUsers();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi đổi vai trò'),
        loading: false,
      });
      throw error;
    }
  },

  changeUserPassword: async (id: number, newPassword: string) => {
    set({ loading: true, error: null });
    try {
      await userService.changePassword(id, newPassword);
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi đổi mật khẩu'),
        loading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await userService.delete(id);
      await get().fetchUsers();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi xóa người dùng'),
        loading: false,
      });
      throw error;
    }
  },
}));
