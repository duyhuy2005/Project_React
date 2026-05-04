import api from './api';
import { pickString, readApiArray, readApiObject, toNumberId } from '../utils/normalizeApi';

export interface User {
  id: number | string;
  ten: string;
  email: string;
  soDienThoai?: string;
  vaiTro: string;
  ngayTao: string;
}

export interface UpdateUserRequest {
  ten?: string;
  email?: string;
  soDienThoai?: string;
  vaiTro?: string;
}

export interface UserStatistics {
  totalUsers: number;
  adminCount: number;
  userCount: number;
  newUsersThisMonth: number;
}

const normalizeUser = (item: Record<string, unknown>): User => ({
  id: toNumberId(item.id ?? item._id),
  ten: pickString(item, ['ten', 'name']),
  email: pickString(item, ['email']),
  soDienThoai: pickString(item, ['soDienThoai', 'phone']),
  vaiTro: pickString(item, ['vaiTro', 'role'], 'customer'),
  ngayTao: pickString(item, ['ngayTao', 'createdAt']) || new Date().toISOString(),
});

const userService = {
  getAll: async (params?: { role?: string; search?: string }): Promise<User[]> => {
    const response = await api.get('/users', { params });
    const users = readApiArray<Record<string, unknown>>(response.data as Record<string, unknown>);
    return users.map(normalizeUser);
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    const user = readApiObject<Record<string, unknown>>(response.data as Record<string, unknown>);
    return normalizeUser(user);
  },

  getStatistics: async (): Promise<UserStatistics> => {
    const response = await api.get('/users/statistics');
    const statistics = readApiObject<UserStatistics>(response.data as Record<string, unknown>);
    return Object.keys(statistics).length > 0
      ? statistics
      : {
          totalUsers: 0,
          adminCount: 0,
          userCount: 0,
          newUsersThisMonth: 0,
        };
  },

  update: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    const user = readApiObject<Record<string, unknown>>(response.data as Record<string, unknown>);
    return normalizeUser(user);
  },

  changePassword: async (id: number, newPassword: string): Promise<void> => {
    await api.patch(`/users/${id}/password`, { newPassword });
  },

  changeRole: async (id: number, role: string): Promise<void> => {
    await api.patch(`/users/${id}/role`, { role });
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getUserOrders: async (id: number): Promise<unknown[]> => {
    const response = await api.get(`/users/${id}/orders`);
    return readApiArray<unknown>(response.data as Record<string, unknown>);
  },
};

export default userService;
