import { create } from 'zustand';
import categoryService from '../services/categoryService';
import type { Category, CreateCategoryRequest } from '../services/categoryService';

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

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  getCategoryById: (id: number) => Promise<Category | null>;
  createCategory: (data: CreateCategoryRequest) => Promise<void>;
  updateCategory: (id: number, data: Category) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await categoryService.getAll();
      set({ categories, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải danh mục'),
        loading: false,
      });
    }
  },

  getCategoryById: async (id: number) => {
    try {
      const category = await categoryService.getById(id);
      return category;
    } catch (error: unknown) {
      set({ error: getErrorMessage(error, 'Không tìm thấy danh mục') });
      return null;
    }
  },

  createCategory: async (data) => {
    set({ loading: true, error: null });
    try {
      await categoryService.create(data);
      await get().fetchCategories();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tạo danh mục'),
        loading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id: number, data: Category) => {
    set({ loading: true, error: null });
    try {
      await categoryService.update(id, data);
      await get().fetchCategories();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi cập nhật danh mục'),
        loading: false,
      });
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await categoryService.delete(id);
      await get().fetchCategories();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi xóa danh mục'),
        loading: false,
      });
      throw error;
    }
  },
}));
