import type { Product } from "./products";
import { products } from "./products";

// ===== Order Interface & Data =====
export type OrderStatus = "new" | "confirmed" | "shipping" | "completed" | "cancelled";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  note?: string;
}

export const orderStatusConfig: Record<OrderStatus, { label: string; color: string }> = {
  new: { label: "Mới", color: "blue" },
  confirmed: { label: "Xác nhận", color: "cyan" },
  shipping: { label: "Đang giao", color: "orange" },
  completed: { label: "Hoàn thành", color: "green" },
  cancelled: { label: "Đã hủy", color: "red" },
};

export const orders: Order[] = [
  {
    id: "ORD-2024001",
    customerName: "Nguyễn Văn An",
    customerEmail: "an.nguyen@email.com",
    customerPhone: "0901234567",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    items: [
      { product: products[0], quantity: 1, price: products[0].price },
      { product: products[1], quantity: 1, price: products[1].price },
    ],
    totalAmount: products[0].price + products[1].price,
    status: "completed",
    createdAt: "2024-03-20T10:30:00",
    note: "Giao giờ hành chính",
  },
  {
    id: "ORD-2024002",
    customerName: "Trần Thị Bích",
    customerEmail: "bich.tran@email.com",
    customerPhone: "0912345678",
    address: "456 Lê Lợi, Q.3, TP.HCM",
    items: [{ product: products[3], quantity: 1, price: products[3].price }],
    totalAmount: products[3].price,
    status: "shipping",
    createdAt: "2024-03-21T14:15:00",
  },
  {
    id: "ORD-2024003",
    customerName: "Phạm Minh Châu",
    customerEmail: "chau.pham@email.com",
    customerPhone: "0923456789",
    address: "789 Trần Hưng Đạo, Q.5, TP.HCM",
    items: [
      { product: products[2], quantity: 2, price: products[2].price },
    ],
    totalAmount: products[2].price * 2,
    status: "confirmed",
    createdAt: "2024-03-22T09:00:00",
    note: "Khách VIP",
  },
  {
    id: "ORD-2024004",
    customerName: "Lê Hoàng Dũng",
    customerEmail: "dung.le@email.com",
    customerPhone: "0934567890",
    address: "101 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM",
    items: [
      { product: products[5], quantity: 1, price: products[5].price },
    ],
    totalAmount: products[5].price,
    status: "new",
    createdAt: "2024-03-23T16:45:00",
  },
  {
    id: "ORD-2024005",
    customerName: "Hoàng Thu Hà",
    customerEmail: "ha.hoang@email.com",
    customerPhone: "0945678901",
    address: "202 Võ Văn Tần, Q.3, TP.HCM",
    items: [
      { product: products[6], quantity: 1, price: products[6].price },
      { product: products[8], quantity: 1, price: products[8].price },
    ],
    totalAmount: products[6].price + products[8].price,
    status: "completed",
    createdAt: "2024-03-19T11:20:00",
  },
  {
    id: "ORD-2024006",
    customerName: "Đỗ Quang Huy",
    customerEmail: "huy.do@email.com",
    customerPhone: "0956789012",
    address: "303 Hai Bà Trưng, Q.1, TP.HCM",
    items: [{ product: products[7], quantity: 1, price: products[7].price }],
    totalAmount: products[7].price,
    status: "new",
    createdAt: "2024-03-24T08:00:00",
    note: "Gói quà tặng",
  },
  {
    id: "ORD-2024007",
    customerName: "Vũ Thị Kim",
    customerEmail: "kim.vu@email.com",
    customerPhone: "0967890123",
    address: "404 Cách Mạng Tháng 8, Q.10, TP.HCM",
    items: [
      { product: products[4], quantity: 1, price: products[4].price },
    ],
    totalAmount: products[4].price,
    status: "cancelled",
    createdAt: "2024-03-18T13:30:00",
    note: "Khách hủy do thay đổi ý định",
  },
  {
    id: "ORD-2024008",
    customerName: "Bùi Văn Long",
    customerEmail: "long.bui@email.com",
    customerPhone: "0978901234",
    address: "505 Nguyễn Thị Minh Khai, Q.1, TP.HCM",
    items: [
      { product: products[0], quantity: 1, price: products[0].price },
      { product: products[2], quantity: 1, price: products[2].price },
      { product: products[4], quantity: 1, price: products[4].price },
    ],
    totalAmount: products[0].price + products[2].price + products[4].price,
    status: "shipping",
    createdAt: "2024-03-21T17:00:00",
  },
];

// ===== Customer Interface & Data =====
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  avatar?: string;
}

export const customers: Customer[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    phone: "0901234567",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    totalOrders: 5,
    totalSpent: 45000000,
    joinedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Trần Thị Bích",
    email: "bich.tran@email.com",
    phone: "0912345678",
    address: "456 Lê Lợi, Q.3, TP.HCM",
    totalOrders: 3,
    totalSpent: 32500000,
    joinedAt: "2024-02-01",
  },
  {
    id: 3,
    name: "Phạm Minh Châu",
    email: "chau.pham@email.com",
    phone: "0923456789",
    address: "789 Trần Hưng Đạo, Q.5, TP.HCM",
    totalOrders: 8,
    totalSpent: 78000000,
    joinedAt: "2023-11-20",
  },
  {
    id: 4,
    name: "Lê Hoàng Dũng",
    email: "dung.le@email.com",
    phone: "0934567890",
    address: "101 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM",
    totalOrders: 2,
    totalSpent: 28000000,
    joinedAt: "2024-03-01",
  },
  {
    id: 5,
    name: "Hoàng Thu Hà",
    email: "ha.hoang@email.com",
    phone: "0945678901",
    address: "202 Võ Văn Tần, Q.3, TP.HCM",
    totalOrders: 6,
    totalSpent: 55000000,
    joinedAt: "2023-12-10",
  },
  {
    id: 6,
    name: "Đỗ Quang Huy",
    email: "huy.do@email.com",
    phone: "0956789012",
    address: "303 Hai Bà Trưng, Q.1, TP.HCM",
    totalOrders: 1,
    totalSpent: 35000000,
    joinedAt: "2024-03-20",
  },
  {
    id: 7,
    name: "Vũ Thị Kim",
    email: "kim.vu@email.com",
    phone: "0967890123",
    address: "404 Cách Mạng Tháng 8, Q.10, TP.HCM",
    totalOrders: 4,
    totalSpent: 42000000,
    joinedAt: "2024-01-25",
  },
  {
    id: 8,
    name: "Bùi Văn Long",
    email: "long.bui@email.com",
    phone: "0978901234",
    address: "505 Nguyễn Thị Minh Khai, Q.1, TP.HCM",
    totalOrders: 7,
    totalSpent: 89000000,
    joinedAt: "2023-10-05",
  },
];

// ===== Dashboard Stats =====
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
}

export const dashboardStats: DashboardStats = {
  totalRevenue: 458500000,
  totalOrders: 156,
  totalCustomers: 89,
  totalProducts: products.length,
  revenueGrowth: 12.5,
  orderGrowth: 8.3,
  customerGrowth: 15.2,
};

export const revenueChartData = [
  { day: "T2", revenue: 45000000 },
  { day: "T3", revenue: 62000000 },
  { day: "T4", revenue: 38000000 },
  { day: "T5", revenue: 71000000 },
  { day: "T6", revenue: 55000000 },
  { day: "T7", revenue: 89000000 },
  { day: "CN", revenue: 67000000 },
];

export const topSellingProducts = [
  { product: products[2], sold: 45 },
  { product: products[0], sold: 38 },
  { product: products[4], sold: 32 },
  { product: products[1], sold: 28 },
  { product: products[6], sold: 25 },
];
