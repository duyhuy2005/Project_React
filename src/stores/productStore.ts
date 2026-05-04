import { create } from 'zustand';
import productService from '../services/productService';
import type {
  CreateProductRequest,
  Product as APIProduct,
  UpdateProductRequest,
} from '../services/productService';
import { pickBoolean, pickNumber, pickString, normalizeCategorySlug } from '../utils/normalizeApi';

// Legacy Product interface for components
export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  specs: {
    movement: string;
    caseMaterial: string;
    caseSize: string;
    waterResistance: string;
    crystal: string;
    strap: string;
  };
}

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

// Convert API Product to Legacy Product
function convertToLegacy(apiProduct: APIProduct): Product {
  const specs = (apiProduct as unknown as { specs?: Record<string, string> }).specs;
  const originalPrice = pickNumber(apiProduct as unknown as Record<string, unknown>, ['giaGoc', 'originalPrice']);
  return {
    id: apiProduct.id,
    name: pickString(apiProduct as unknown as Record<string, unknown>, ['ten', 'name']),
    brand: pickString(apiProduct as unknown as Record<string, unknown>, ['thuongHieu', 'brand']),
    price: pickNumber(apiProduct as unknown as Record<string, unknown>, ['gia', 'price']),
    originalPrice: originalPrice > 0 ? originalPrice : undefined,
    image: pickString(apiProduct as unknown as Record<string, unknown>, ['hinhAnh', 'image'], '/images/watch1.png'),
    category: normalizeCategorySlug(pickString(apiProduct as unknown as Record<string, unknown>, ['danhMuc', 'category', 'rawCategory'])),
    description: pickString(apiProduct as unknown as Record<string, unknown>, ['moTa', 'description']),
    rating: pickNumber(apiProduct as unknown as Record<string, unknown>, ['danhGia', 'rating']),
    reviews: pickNumber(apiProduct as unknown as Record<string, unknown>, ['soDanhGia', 'reviews']),
    isNew: pickBoolean(apiProduct as unknown as Record<string, unknown>, ['sanPhamMoi', 'isNew']),
    isBestSeller: pickBoolean(apiProduct as unknown as Record<string, unknown>, ['banChay', 'isBestSeller']),
    specs: {
      movement: pickString(apiProduct as unknown as Record<string, unknown>, ['boMay']) || specs?.movement || '',
      caseMaterial: pickString(apiProduct as unknown as Record<string, unknown>, ['chatLieuVo']) || specs?.caseMaterial || '',
      caseSize: pickString(apiProduct as unknown as Record<string, unknown>, ['kichThuocVo']) || specs?.caseSize || '',
      waterResistance: pickString(apiProduct as unknown as Record<string, unknown>, ['chongNuoc']) || specs?.waterResistance || '',
      crystal: pickString(apiProduct as unknown as Record<string, unknown>, ['matKinh']) || specs?.crystal || '',
      strap: pickString(apiProduct as unknown as Record<string, unknown>, ['dayDeo']) || specs?.strap || '',
    },
  };
}

interface ProductState {
  products: Product[];
  apiProducts: APIProduct[];
  loading: boolean;
  error: string | null;
  fetchProducts: (params?: {
    category?: string;
    search?: string;
    isNew?: boolean;
    isBestSeller?: boolean;
  }) => Promise<void>;
  getProductById: (id: number) => Promise<Product | null>;
  addProduct: (data: Product) => Promise<void>;
  createProduct: (data: CreateProductRequest) => Promise<void>;
  updateProduct: (id: number, data: UpdateProductRequest) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  apiProducts: [],
  loading: false,
  error: null,

  fetchProducts: async (params) => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const apiProducts = await productService.getAll(params);
      const products = apiProducts.map(convertToLegacy);
      set({ apiProducts, products, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải sản phẩm'),
        loading: false,
      });
    }
  },

  getProductById: async (id: number) => {
    try {
      set({ loading: true, error: null });
      const apiProduct = await productService.getById(id);
      set({ loading: false });
      return convertToLegacy(apiProduct);
    } catch (error: unknown) {
      set({ error: getErrorMessage(error, 'Không tìm thấy sản phẩm'), loading: false });
      return null;
    }
  },

  addProduct: async (data) => {
    set((state) => ({
      products: [data, ...state.products],
      error: null,
    }));
  },

  createProduct: async (data) => {
    set({ loading: true, error: null });
    try {
      await productService.create(data);
      await get().fetchProducts();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tạo sản phẩm'),
        loading: false,
      });
      throw error;
    }
  },

  updateProduct: async (id: number, data) => {
    set({ loading: true, error: null });
    try {
      await productService.update(id, data);
      await get().fetchProducts();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi cập nhật sản phẩm'),
        loading: false,
      });
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await productService.delete(id);
      await get().fetchProducts();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi xóa sản phẩm'),
        loading: false,
      });
      throw error;
    }
  },
}));
