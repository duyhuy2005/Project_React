// Export all services
export { default as api } from './api';
export { default as authService } from './authService';
export { default as productService } from './productService';
export { default as categoryService } from './categoryService';
export { default as orderService } from './orderService';
export { default as couponService } from './couponService';
export { default as returnService } from './returnService';
export { default as userService } from './userService';
export { default as statisticsService } from './statisticsService';

// Export types
export type { LoginRequest, RegisterRequest, User, AuthResponse } from './authService';
export type { Product, CreateProductRequest, UpdateProductRequest } from './productService';
export type { Category, CreateCategoryRequest } from './categoryService';
export type { Order, OrderItem, CreateOrderRequest, UpdateOrderStatusRequest } from './orderService';
export type { Coupon, CreateCouponRequest, ValidateCouponRequest, ValidateCouponResponse } from './couponService';
export type { ReturnRequest, CreateReturnRequest, UpdateReturnStatusRequest } from './returnService';
export type { User as UserType, UpdateUserRequest, UserStatistics } from './userService';
export type {
  DashboardStatistics,
  MonthlyRevenue,
  BestSellingProduct,
  CategorySales,
  OrdersByStatus,
  InventoryStatistics,
  CouponUsage,
  ReturnStatistics,
  TopCustomer,
} from './statisticsService';
