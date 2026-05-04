import { create } from 'zustand';
import productService from '../services/productService';
import type {
  CreateProductRequest,
  Product as APIProduct,
  UpdateProductRequest,
} from '../services/productService';

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
  return {
    id: apiProduct.id,
    name: apiProduct.ten || (apiProduct as unknown as { name?: string }).name || '',
    brand: apiProduct.thuongHieu || (apiProduct as unknown as { brand?: string }).brand || '',
    price: apiProduct.gia || (apiProduct as unknown as { price?: number }).price || 0,
    originalPrice: apiProduct.giaGoc || (apiProduct as unknown as { originalPrice?: number }).originalPrice,
    image: apiProduct.hinhAnh || (apiProduct as unknown as { image?: string }).image || '/images/watch1.png',
    category: apiProduct.danhMuc || (apiProduct as unknown as { category?: string }).category || '',
    description: apiProduct.moTa || (apiProduct as unknown as { description?: string }).description || '',
    rating: apiProduct.danhGia || (apiProduct as unknown as { rating?: number }).rating || 0,
    reviews: apiProduct.soDanhGia || (apiProduct as unknown as { reviews?: number }).reviews || 0,
    isNew: apiProduct.sanPhamMoi ?? (apiProduct as unknown as { isNew?: boolean }).isNew,
    isBestSeller: apiProduct.banChay ?? (apiProduct as unknown as { isBestSeller?: boolean }).isBestSeller,
    specs: {
      movement: apiProduct.boMay || (apiProduct as unknown as { specs?: { movement?: string } }).specs?.movement || '',
      caseMaterial: apiProduct.chatLieuVo || (apiProduct as unknown as { specs?: { caseMaterial?: string } }).specs?.caseMaterial || '',
      caseSize: apiProduct.kichThuocVo || (apiProduct as unknown as { specs?: { caseSize?: string } }).specs?.caseSize || '',
      waterResistance: apiProduct.chongNuoc || (apiProduct as unknown as { specs?: { waterResistance?: string } }).specs?.waterResistance || '',
      crystal: apiProduct.matKinh || (apiProduct as unknown as { specs?: { crystal?: string } }).specs?.crystal || '',
      strap: apiProduct.dayDeo || (apiProduct as unknown as { specs?: { strap?: string } }).specs?.strap || '',
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
      const apiProduct = await productService.getById(id);
      return convertToLegacy(apiProduct);
    } catch (error: unknown) {
      set({ error: getErrorMessage(error, 'Không tìm thấy sản phẩm') });
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
