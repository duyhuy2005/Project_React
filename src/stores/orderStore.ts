import { create } from 'zustand';
import type { Product } from '../data/products';
import orderService, {
  type CreateOrderRequest,
  type Order as BackendOrder,
  type OrderItemDetail,
} from '../services/orderService';

export type OrderStatus = 'new' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type PaymentMethod = 'cod' | 'bank_transfer' | 'credit_card' | 'momo';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  backendId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  note?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  description: string;
  reason: string;
  status: ReturnStatus;
  createdAt: string;
  items: OrderItem[];
  refundAmount: number;
}

export const orderStatusConfig: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  new: { label: 'Chờ xác nhận', color: 'blue', icon: '🆕' },
  confirmed: { label: 'Đã xác nhận', color: 'cyan', icon: '✅' },
  shipping: { label: 'Đang giao hàng', color: 'orange', icon: '🚚' },
  completed: { label: 'Hoàn thành', color: 'green', icon: '🎉' },
  cancelled: { label: 'Đã hủy', color: 'red', icon: '❌' },
};

export const returnStatusConfig: Record<ReturnStatus, { label: string; color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'orange' },
  approved: { label: 'Đã chấp nhận', color: 'blue' },
  rejected: { label: 'Từ chối', color: 'red' },
  completed: { label: 'Hoàn thành', color: 'green' },
};

export const paymentMethodConfig: Record<PaymentMethod, { label: string; icon: string }> = {
  cod: { label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  bank_transfer: { label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  credit_card: { label: 'Thẻ tín dụng / Ghi nợ', icon: '💳' },
  momo: { label: 'Ví MoMo', icon: '📱' },
};

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchMyOrders: () => Promise<void>;
  fetchAllOrders: (status?: string) => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  createOrder: (data: CreateOrderRequest) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrdersByEmail: (email: string) => Order[];
}

const normalizePaymentMethod = (method?: string): PaymentMethod => {
  if (method === 'bank_transfer' || method === 'credit_card' || method === 'momo') {
    return method;
  }
  return 'cod';
};

const normalizeOrderStatus = (status: string): OrderStatus => {
  switch (status) {
    case 'confirmed':
    case 'shipping':
    case 'completed':
    case 'cancelled':
    case 'new':
      return status;
    case 'pending':
      return 'new';
    case 'processing':
      return 'confirmed';
    case 'delivered':
      return 'completed';
    default:
      return 'new';
  }
};

const mapOrderItem = (item: OrderItemDetail): OrderItem => ({
  product: {
    id: item.sanPhamId,
    name: item.tenSanPham,
    brand: '',
    price: item.gia,
    image: item.hinhAnhSanPham || '/images/watch1.png',
    category: '',
    description: '',
    rating: 0,
    reviews: 0,
    specs: {
      movement: '',
      caseMaterial: '',
      caseSize: '',
      waterResistance: '',
      crystal: '',
      strap: '',
    },
  },
  quantity: item.soLuong,
  price: item.gia,
});

const mapBackendOrderToOrder = (order: BackendOrder): Order => ({
  id: order.maDonHang || `ORD-${order.id}`,
  backendId: order.id,
  customerName: order.tenKhachHang,
  customerEmail: order.emailKhachHang,
  customerPhone: order.soDienThoaiKhachHang,
  address: order.diaChiGiaoHang,
  items: order.chiTietDonHangs.map(mapOrderItem),
  totalAmount: order.tongTien,
  shippingFee: 0,
  status: normalizeOrderStatus(order.trangThai),
  paymentMethod: normalizePaymentMethod(order.phuongThucThanhToan),
  createdAt: order.ngayTao,
  note: order.ghiChu,
});

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await orderService.getMyOrders();
      set({ orders: orders.map(mapBackendOrderToOrder), loading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Lỗi tải đơn hàng';
      set({
        error: message,
        loading: false,
      });
    }
  },

  fetchAllOrders: async (status) => {
    set({ loading: true, error: null });
    try {
      const orders = await orderService.getAll(status);
      set({ orders: orders.map(mapBackendOrderToOrder), loading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Lỗi tải đơn hàng';
      set({
        error: message,
        loading: false,
      });
    }
  },

  getOrderById: async (id) => {
    try {
      const order = await orderService.getById(id);
      return mapBackendOrderToOrder(order);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Không tìm thấy đơn hàng';
      set({ error: message });
      return null;
    }
  },

  createOrder: async (data) => {
    set({ loading: true, error: null });
    try {
      const createdOrder = await orderService.create(data);
      const mappedOrder = mapBackendOrderToOrder(createdOrder);
      set((state) => ({
        orders: [mappedOrder, ...state.orders.filter((order) => order.backendId !== mappedOrder.backendId)],
        loading: false,
      }));
      return mappedOrder;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Lỗi tạo đơn hàng';
      set({
        error: message,
        loading: false,
      });
      throw error;
    }
  },

  cancelOrder: async (orderId, ) => {
    const order = get().orders.find((item) => item.id === orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng để hủy');
    }

    set({ loading: true, error: null });
    try {
      await orderService.updateStatus(order.backendId, 'cancelled');
      set((state) => ({
        orders: state.orders.map((item) =>
          item.id === orderId ? { ...item, status: 'cancelled' } : item
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Lỗi hủy đơn hàng';
      set({
        error: message,
        loading: false,
      });
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    const order = get().orders.find((item) => item.id === orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng để cập nhật');
    }

    set({ loading: true, error: null });
    try {
      await orderService.updateStatus(order.backendId, status);
      set((state) => ({
        orders: state.orders.map((item) =>
          item.id === orderId ? { ...item, status } : item
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Lỗi cập nhật trạng thái';
      set({
        error: message,
        loading: false,
      });
      throw error;
    }
  },

  getOrdersByEmail: (email) => get().orders.filter((order) => order.customerEmail === email),
}));
