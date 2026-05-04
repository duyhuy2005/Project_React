import api from './api';

export interface Category {
  id: number;
  ten: string;
  slug: string;
  bieuTuong?: string;
  moTa?: string;
  hoatDong: boolean;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface CreateCategoryRequest {
  ten: string;
  slug: string;
  bieuTuong?: string;
  moTa?: string;
  hoatDong?: boolean;
}

const toNumberId = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number(value.replace(/\D/g, ''));
    return Number.isNaN(numeric) ? 0 : numeric;
  }
  return 0;
};

const normalizeCategory = (item: Record<string, unknown>): Category => ({
  id: toNumberId(item.id ?? item._id),
  ten: (item.ten as string | undefined) ?? (item.name as string | undefined) ?? '',
  slug: (item.slug as string | undefined) ?? '',
  bieuTuong: (item.bieuTuong as string | undefined) ?? (item.icon as string | undefined),
  moTa: (item.moTa as string | undefined) ?? (item.description as string | undefined),
  hoatDong: Boolean((item.hoatDong as boolean | undefined) ?? (item.isActive as boolean | undefined)),
  ngayTao: (item.ngayTao as string | undefined) ?? (item.createdAt as string | undefined) ?? new Date().toISOString(),
  ngayCapNhat: (item.ngayCapNhat as string | undefined) ?? (item.updatedAt as string | undefined) ?? new Date().toISOString(),
});

const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    const categories = ((response.data.data as Record<string, unknown> | undefined)?.categories as Record<string, unknown>[] | undefined) ?? [];
    return categories.map(normalizeCategory);
  },

  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    const category = ((response.data.data as Record<string, unknown> | undefined)?.category as Record<string, unknown> | undefined) ?? {};
    return normalizeCategory(category);
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/categories/slug/${slug}`);
    const category = ((response.data.data as Record<string, unknown> | undefined)?.category as Record<string, unknown> | undefined) ?? {};
    return normalizeCategory(category);
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post('/categories', data);
    const category = ((response.data.data as Record<string, unknown> | undefined)?.category as Record<string, unknown> | undefined) ?? {};
    return normalizeCategory(category);
  },

  update: async (id: number, data: Category): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    const category = ((response.data.data as Record<string, unknown> | undefined)?.category as Record<string, unknown> | undefined) ?? {};
    return normalizeCategory(category);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  permanentDelete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}/permanent`);
  },
};

export default categoryService;
