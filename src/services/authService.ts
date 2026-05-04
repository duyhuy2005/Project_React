import api from './api';
import { pickString, readDataObject, toNumberId } from '../utils/normalizeApi';

export interface LoginRequest {
  email: string;
  matKhau: string;
}

export interface RegisterRequest {
  ten: string;
  email: string;
  matKhau: string;
  soDienThoai?: string;
}

export interface User {
  id: number;
  ten: string;
  email: string;
  soDienThoai?: string;
  vaiTro: string;
  ngayTao: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

const normalizeUser = (user?: Record<string, unknown>): User | undefined => {
  if (!user) return undefined;

  return {
    id: toNumberId(user.id ?? user._id),
    ten: pickString(user, ['ten', 'name']),
    email: pickString(user, ['email']),
    soDienThoai: pickString(user, ['soDienThoai', 'phone']),
    vaiTro: pickString(user, ['vaiTro', 'role'], 'customer'),
    ngayTao: pickString(user, ['ngayTao', 'createdAt']) || new Date().toISOString(),
  };
};

const normalizeAuthResponse = (payload: Record<string, unknown>): AuthResponse => {
  const data = readDataObject<Record<string, unknown>>(payload);
  return {
    success: Boolean(payload.success),
    message: (payload.message as string | undefined) ?? '',
    token: pickString(data, ['token']) || undefined,
    user: normalizeUser((data.user as Record<string, unknown> | undefined) ?? undefined),
  };
};

const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', {
      email: data.email,
      password: data.matKhau,
    });
    const normalized = normalizeAuthResponse(response.data as Record<string, unknown>);
    if (normalized.token) {
      localStorage.setItem('token', normalized.token);
      localStorage.setItem('user', JSON.stringify(normalized.user));
    }
    return normalized;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', {
      name: data.ten,
      email: data.email,
      password: data.matKhau,
      phone: data.soDienThoai,
    });
    const normalized = normalizeAuthResponse(response.data as Record<string, unknown>);
    if (normalized.token) {
      localStorage.setItem('token', normalized.token);
      localStorage.setItem('user', JSON.stringify(normalized.user));
    }
    return normalized;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    const user = normalizeUser((response.data.data as Record<string, unknown> | undefined)?.user as Record<string, unknown> | undefined);
    if (!user) {
      throw new Error('Không lấy được thông tin người dùng');
    }
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.vaiTro === 'admin';
  },
};

export default authService;
