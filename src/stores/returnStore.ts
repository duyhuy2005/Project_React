import { create } from 'zustand';
import returnService from '../services/returnService';
import type { ReturnRequest } from '../services/returnService';

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

interface ReturnState {
  returns: ReturnRequest[];
  loading: boolean;
  error: string | null;
  fetchMyReturns: () => Promise<void>;
  fetchAllReturns: (status?: string) => Promise<void>;
  getReturnById: (id: string) => Promise<ReturnRequest | null>;
  createReturn: (donHangId: string, lyDo: string) => Promise<void>;
  updateReturnStatus: (id: string, trangThai: string, ghiChuQuanTri?: string) => Promise<void>;
  cancelReturn: (id: string) => Promise<void>;
}

export const useReturnStore = create<ReturnState>((set, get) => ({
  returns: [],
  loading: false,
  error: null,

  fetchMyReturns: async () => {
    set({ loading: true, error: null });
    try {
      const returns = await returnService.getMyReturns();
      set({ returns, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải yêu cầu hoàn trả'),
        loading: false,
      });
    }
  },

  fetchAllReturns: async (status) => {
    set({ loading: true, error: null });
    try {
      const returns = await returnService.getAll(status);
      set({ returns, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải yêu cầu hoàn trả'),
        loading: false,
      });
    }
  },

  getReturnById: async (id: string) => {
    try {
      const returnRequest = await returnService.getById(id);
      return returnRequest;
    } catch (error: unknown) {
      set({ error: getErrorMessage(error, 'Không tìm thấy yêu cầu hoàn trả') });
      return null;
    }
  },

  createReturn: async (donHangId: string, lyDo: string) => {
    set({ loading: true, error: null });
    try {
      await returnService.create({ donHangId, lyDo });
      await get().fetchMyReturns();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tạo yêu cầu hoàn trả'),
        loading: false,
      });
      throw error;
    }
  },

  updateReturnStatus: async (id: string, trangThai: string, ghiChuQuanTri?: string) => {
    set({ loading: true, error: null });
    try {
      await returnService.updateStatus(id, { trangThai, ghiChuQuanTri });
      await get().fetchAllReturns();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi cập nhật trạng thái'),
        loading: false,
      });
      throw error;
    }
  },

  cancelReturn: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await returnService.cancel(id);
      await get().fetchMyReturns();
      set({ loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi hủy yêu cầu hoàn trả'),
        loading: false,
      });
      throw error;
    }
  },
}));
