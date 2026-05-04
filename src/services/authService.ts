import api from './api';

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

const toNumberId = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number(value.replace(/\D/g, ''));
    return Number.isNaN(numeric) ? 0 : numeric;
  }
  return 0;
};

const normalizeUser = (user?: Record<string, unknown>): User | undefined => {
  if (!user) return undefined;

  return {
    id: toNumberId(user.id ?? user._id),
    ten: (user.ten as string | undefined) ?? (user.name as string | undefined) ?? '',
    email: (user.email as string | undefined) ?? '',
    soDienThoai: (user.soDienThoai as string | undefined) ?? (user.phone as string | undefined),
    vaiTro: (user.vaiTro as string | undefined) ?? (user.role as string | undefined) ?? 'customer',
    ngayTao: (user.ngayTao as string | undefined) ?? (user.createdAt as string | undefined) ?? new Date().toISOString(),
  };
};

const normalizeAuthResponse = (payload: Record<string, unknown>): AuthResponse => {
  const data = (payload.data as Record<string, unknown> | undefined) ?? payload;
  return {
    success: Boolean(payload.success),
    message: (payload.message as string | undefined) ?? '',
    token: data.token as string | undefined,
    user: normalizeUser(data.user as Record<string, unknown> | undefined),
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
