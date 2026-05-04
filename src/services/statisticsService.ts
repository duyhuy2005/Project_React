import api from './api';
import { readApiArray, readApiObject } from '../utils/normalizeApi';

export interface DashboardStatistics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  ordersByStatus: {
    pending: number;
    processing: number;
    shipping: number;
    delivered: number;
  };
  lowStockProducts: number;
  pendingReturns: number;
}

export interface MonthlyRevenue {
  month: number;
  revenue: number;
  orderCount: number;
}

export interface BestSellingProduct {
  productId: number;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}

export interface CategorySales {
  category: string;
  totalSold: number;
  totalRevenue: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
  totalAmount: number;
}

export interface InventoryStatistics {
  totalProducts: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
  totalStockValue: number;
}

export interface CouponUsage {
  maCode: string;
  giamGia: number;
  loaiGiamGia: string;
  soLanDaSuDung: number;
  gioiHanSuDung?: number;
  hoatDong: boolean;
  usagePercentage: number;
}

export interface ReturnStatistics {
  totalReturns: number;
  pendingReturns: number;
  approvedReturns: number;
  rejectedReturns: number;
  totalRefundAmount: number;
}

export interface TopCustomer {
  userId: number;
  userName: string;
  userEmail: string;
  totalOrders: number;
  totalSpent: number;
}

const statisticsService = {
  // Lấy thống kê tổng quan (Dashboard)
  getDashboard: async (): Promise<DashboardStatistics> => {
    const response = await api.get('/statistics/dashboard');
    return readApiObject<DashboardStatistics>(response.data as Record<string, unknown>);
  },

  // Thống kê doanh thu theo tháng
  getMonthlyRevenue: async (year?: number): Promise<MonthlyRevenue[]> => {
    const response = await api.get('/statistics/revenue/monthly', { params: { year } });
    return readApiArray<MonthlyRevenue>(response.data as Record<string, unknown>);
  },

  // Thống kê sản phẩm bán chạy
  getBestSellers: async (limit: number = 10): Promise<BestSellingProduct[]> => {
    const response = await api.get('/statistics/products/best-sellers', { params: { limit } });
    return readApiArray<BestSellingProduct>(response.data as Record<string, unknown>);
  },

  // Thống kê theo danh mục
  getCategorySales: async (): Promise<CategorySales[]> => {
    const response = await api.get('/statistics/categories/sales');
    return readApiArray<CategorySales>(response.data as Record<string, unknown>);
  },

  // Thống kê đơn hàng theo trạng thái
  getOrdersByStatus: async (): Promise<OrdersByStatus[]> => {
    const response = await api.get('/statistics/orders/by-status');
    return readApiArray<OrdersByStatus>(response.data as Record<string, unknown>);
  },

  // Thống kê người dùng mới theo tháng
  getNewUsers: async (year?: number): Promise<{ month: number; count: number }[]> => {
    const response = await api.get('/statistics/users/new-users', { params: { year } });
    return readApiArray<{ month: number; count: number }>(response.data as Record<string, unknown>);
  },

  // Thống kê sản phẩm tồn kho
  getInventory: async (): Promise<InventoryStatistics> => {
    const response = await api.get('/statistics/products/inventory');
    return readApiObject<InventoryStatistics>(response.data as Record<string, unknown>);
  },

  // Thống kê mã giảm giá
  getCouponUsage: async (): Promise<CouponUsage[]> => {
    const response = await api.get('/statistics/coupons/usage');
    return readApiArray<CouponUsage>(response.data as Record<string, unknown>);
  },

  // Thống kê yêu cầu hoàn trả
  getReturns: async (): Promise<ReturnStatistics> => {
    const response = await api.get('/statistics/returns/statistics');
    return readApiObject<ReturnStatistics>(response.data as Record<string, unknown>);
  },

  // Thống kê top khách hàng
  getTopCustomers: async (limit: number = 10): Promise<TopCustomer[]> => {
    const response = await api.get('/statistics/customers/top', { params: { limit } });
    return readApiArray<TopCustomer>(response.data as Record<string, unknown>);
  },
};

export default statisticsService;
