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

const categoryService = {
  // Lấy danh sách danh mục
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data.data;
  },

  // Lấy chi tiết danh mục
  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  // Lấy danh mục theo slug
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data.data;
  },

  // Tạo danh mục mới (Admin)
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data.data;
  },

  // Cập nhật danh mục (Admin)
  update: async (id: number, data: Category): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  // Xóa danh mục - soft delete (Admin)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  // Xóa vĩnh viễn danh mục (Admin)
  permanentDelete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}/permanent`);
  },
};

export default categoryService;
