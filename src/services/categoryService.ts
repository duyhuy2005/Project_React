import api from './api';
import {
  pickString,
  readDataArray,
  readDataObject,
  toBoolean,
  toNumberId,
} from '../utils/normalizeApi';

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

const normalizeCategory = (item: Record<string, unknown>): Category => ({
  id: toNumberId(item.id ?? item._id),
  ten: pickString(item, ['ten', 'name']),
  slug: pickString(item, ['slug']),
  bieuTuong: pickString(item, ['bieuTuong', 'icon']),
  moTa: pickString(item, ['moTa', 'description']),
  hoatDong: toBoolean(item.hoatDong ?? item.isActive),
  ngayTao: pickString(item, ['ngayTao', 'createdAt']) || new Date().toISOString(),
  ngayCapNhat: pickString(item, ['ngayCapNhat', 'updatedAt']) || new Date().toISOString(),
});

const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    const categories = readDataArray<Record<string, unknown>>(response.data as Record<string, unknown>, 'categories');
    return categories.map(normalizeCategory);
  },

  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    const category = readDataObject<Record<string, unknown>>(response.data as Record<string, unknown>, 'category');
    return normalizeCategory(category);
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/categories/slug/${slug}`);
    const category = readDataObject<Record<string, unknown>>(response.data as Record<string, unknown>, 'category');
    return normalizeCategory(category);
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post('/categories', data);
    const category = readDataObject<Record<string, unknown>>(response.data as Record<string, unknown>, 'category');
    return normalizeCategory(category);
  },

  update: async (id: number, data: Category): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    const category = readDataObject<Record<string, unknown>>(response.data as Record<string, unknown>, 'category');
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
