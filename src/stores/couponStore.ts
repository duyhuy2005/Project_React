import { create } from 'zustand';
import couponService from '../services/couponService';
import type {
  Coupon,
  CreateCouponRequest,
  ValidateCouponResponse,
} from '../services/couponService';

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

interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  fetchCoupons: () => Promise<void>;
  validateCoupon: (code: string, orderAmount: number) => Promise<ValidateCouponResponse>;
  createCoupon: (data: CreateCouponRequest) => Promise<void>;
  updateCoupon: (id: number, data: Coupon) => Promise<void>;
  deleteCoupon: (id: number) => Promise<void>;
  deactivateCoupon: (id: number) => Promise<void>;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  coupons: [],
  loading: false,
  error: null,

  fetchCoupons: async () => {
    set({ loading: true, error: null });
    try {
      const coupons = await couponService.getAll();
      set({ coupons, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải mã giảm giá'),
        loading: false,
      });
    }
  },

  validateCoupon: async (code: string, orderAmount: number) => {
    try {
      const result = await couponService.validate({ code, orderAmount });
      return result;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Mã giảm giá không hợp lệ'));
    }
  },

  createCoupon: async (data) => {
    set({ loading: true, error: null });
    try {
      await couponService.create(data);
      await get().fetchCoupons();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tạo mã giảm giá'),
        loading: false,
      });
      throw error;
    }
  },

  updateCoupon: async (id: number, data: Coupon) => {
    set({ loading: true, error: null });
    try {
      await couponService.update(id, data);
      await get().fetchCoupons();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi cập nhật mã giảm giá'),
        loading: false,
      });
      throw error;
    }
  },

  deleteCoupon: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await couponService.delete(id);
      await get().fetchCoupons();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi xóa mã giảm giá'),
        loading: false,
      });
      throw error;
    }
  },

  deactivateCoupon: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await couponService.deactivate(id);
      await get().fetchCoupons();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi vô hiệu hóa mã giảm giá'),
        loading: false,
      });
      throw error;
    }
  },
}));
