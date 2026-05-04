import api from './api';

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
  id: (item.id as number | string | undefined) ?? (item._id as number | string | undefined) ?? '',
  ten: (item.ten as string | undefined) ?? (item.name as string | undefined) ?? '',
  email: (item.email as string | undefined) ?? '',
  soDienThoai: (item.soDienThoai as string | undefined) ?? (item.phone as string | undefined),
  vaiTro: (item.vaiTro as string | undefined) ?? (item.role as string | undefined) ?? 'customer',
  ngayTao: (item.ngayTao as string | undefined) ?? (item.createdAt as string | undefined) ?? new Date().toISOString(),
});

const userService = {
  getAll: async (params?: { role?: string; search?: string }): Promise<User[]> => {
    const response = await api.get('/users', { params });
    const users = ((response.data.data as Record<string, unknown> | undefined)?.users as Record<string, unknown>[] | undefined) ?? [];
    return users.map(normalizeUser);
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    const user = ((response.data.data as Record<string, unknown> | undefined)?.user as Record<string, unknown> | undefined) ?? {};
    return normalizeUser(user);
  },

  getStatistics: async (): Promise<UserStatistics> => {
    const response = await api.get('/users/statistics');
    return ((response.data.data as Record<string, unknown> | undefined)?.statistics as UserStatistics | undefined) ?? {
      totalUsers: 0,
      adminCount: 0,
      userCount: 0,
      newUsersThisMonth: 0,
    };
  },

  update: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    const user = ((response.data.data as Record<string, unknown> | undefined)?.user as Record<string, unknown> | undefined) ?? {};
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
    return ((response.data.data as Record<string, unknown> | undefined)?.orders as unknown[] | undefined) ?? [];
  },
};

export default userService;
