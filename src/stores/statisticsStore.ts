import { create } from 'zustand';
import statisticsService from '../services/statisticsService';
import type {
  DashboardStatistics,
  MonthlyRevenue,
  BestSellingProduct,
  CategorySales,
  InventoryStatistics,
  TopCustomer,
} from '../services/statisticsService';

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

interface StatisticsState {
  dashboard: DashboardStatistics | null;
  monthlyRevenue: MonthlyRevenue[];
  bestSellers: BestSellingProduct[];
  categorySales: CategorySales[];
  inventory: InventoryStatistics | null;
  topCustomers: TopCustomer[];
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
  fetchMonthlyRevenue: (year?: number) => Promise<void>;
  fetchBestSellers: (limit?: number) => Promise<void>;
  fetchCategorySales: () => Promise<void>;
  fetchInventory: () => Promise<void>;
  fetchTopCustomers: (limit?: number) => Promise<void>;
}

export const useStatisticsStore = create<StatisticsState>((set) => ({
  dashboard: null,
  monthlyRevenue: [],
  bestSellers: [],
  categorySales: [],
  inventory: null,
  topCustomers: [],
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const dashboard = await statisticsService.getDashboard();
      set({ dashboard, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải thống kê'),
        loading: false,
      });
    }
  },

  fetchMonthlyRevenue: async (year) => {
    set({ loading: true, error: null });
    try {
      const monthlyRevenue = await statisticsService.getMonthlyRevenue(year);
      set({ monthlyRevenue, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải doanh thu'),
        loading: false,
      });
    }
  },

  fetchBestSellers: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const bestSellers = await statisticsService.getBestSellers(limit);
      set({ bestSellers, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải sản phẩm bán chạy'),
        loading: false,
      });
    }
  },

  fetchCategorySales: async () => {
    set({ loading: true, error: null });
    try {
      const categorySales = await statisticsService.getCategorySales();
      set({ categorySales, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải thống kê danh mục'),
        loading: false,
      });
    }
  },

  fetchInventory: async () => {
    set({ loading: true, error: null });
    try {
      const inventory = await statisticsService.getInventory();
      set({ inventory, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải thống kê tồn kho'),
        loading: false,
      });
    }
  },

  fetchTopCustomers: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const topCustomers = await statisticsService.getTopCustomers(limit);
      set({ topCustomers, loading: false });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, 'Lỗi tải top khách hàng'),
        loading: false,
      });
    }
  },
}));
