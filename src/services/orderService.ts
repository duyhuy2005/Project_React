import api from './api';
import { pickNumber, pickString, readDataArray, readDataObject, toStringId } from '../utils/normalizeApi';

export interface OrderItem {
  sanPhamId: number;
  soLuong: number;
}

export interface OrderItemDetail {
  id: number;
  sanPhamId: number;
  tenSanPham: string;
  hinhAnhSanPham?: string;
  gia: number;
  soLuong: number;
  tongPhu: number;
}

export interface Order {
  id: string;
  maDonHang: string;
  nguoiDungId: string;
  tenKhachHang: string;
  emailKhachHang: string;
  soDienThoaiKhachHang: string;
  diaChiGiaoHang: string;
  tongTien: number;
  trangThai: string;
  phuongThucThanhToan?: string;
  trangThaiThanhToan: string;
  ghiChu?: string;
  ngayTao: string;
  ngayCapNhat: string;
  chiTietDonHangs: OrderItemDetail[];
}

export interface CreateOrderRequest {
  tenKhachHang: string;
  emailKhachHang: string;
  soDienThoaiKhachHang: string;
  diaChiGiaoHang: string;
  items: OrderItem[];
  phuongThucThanhToan?: string;
  ghiChu?: string;
}

const normalizeOrderItemDetail = (item: Record<string, unknown>, index: number): OrderItemDetail => ({
  id: pickNumber(item, ['id'], index + 1),
  sanPhamId: pickNumber(item, ['sanPhamId', 'productId']),
  tenSanPham: pickString(item, ['tenSanPham'], `Sản phẩm #${index + 1}`),
  hinhAnhSanPham: pickString(item, ['hinhAnhSanPham']),
  gia: pickNumber(item, ['gia', 'price']),
  soLuong: pickNumber(item, ['soLuong', 'quantity']),
  tongPhu: pickNumber(item, ['tongPhu'], pickNumber(item, ['price']) * pickNumber(item, ['quantity'])),
});

const normalizeOrder = (item: Record<string, unknown>): Order => {
  const rawItems = ((item.chiTietDonHangs as Record<string, unknown>[] | undefined) ??
    (item.items as Record<string, unknown>[] | undefined) ??
    []);

  const details = rawItems.map(normalizeOrderItemDetail);
  const total = Number((item.tongTien as number | undefined) ?? (item.totalAmount as number | undefined) ?? details.reduce((sum, detail) => sum + detail.tongPhu, 0));

  return {
    id: toStringId(item.id ?? item._id),
    maDonHang: pickString(item, ['maDonHang'], `ORD-${item.id ?? item._id ?? Date.now()}`),
    nguoiDungId: toStringId(item.nguoiDungId ?? item.userId ?? item.user),
    tenKhachHang: pickString(item, ['tenKhachHang', 'customerName']),
    emailKhachHang: pickString(item, ['emailKhachHang', 'customerEmail']),
    soDienThoaiKhachHang: pickString(item, ['soDienThoaiKhachHang', 'customerPhone']),
    diaChiGiaoHang: pickString(item, ['diaChiGiaoHang', 'shippingAddress', 'address']),
    tongTien: total,
    trangThai: pickString(item, ['trangThai', 'status'], 'new'),
    phuongThucThanhToan: pickString(item, ['phuongThucThanhToan', 'paymentMethod']),
    trangThaiThanhToan: pickString(item, ['trangThaiThanhToan'], 'pending'),
    ghiChu: pickString(item, ['ghiChu', 'note']),
    ngayTao: pickString(item, ['ngayTao', 'createdAt']) || new Date().toISOString(),
    ngayCapNhat: pickString(item, ['ngayCapNhat', 'updatedAt']) || new Date().toISOString(),
    chiTietDonHangs: details,
  };
};

const extractOrders = (payload: Record<string, unknown>, key: 'order' | 'orders'): Order[] | Order => {
  if (key === 'orders') {
    const orders = readDataArray<Record<string, unknown>>(payload, 'orders');
    return orders.map(normalizeOrder);
  }

  return normalizeOrder(readDataObject<Record<string, unknown>>(payload, 'order'));
};

const orderService = {
  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post('/orders', data);
    return extractOrders(response.data as Record<string, unknown>, 'order') as Order;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders/my');
    return extractOrders(response.data as Record<string, unknown>, 'orders') as Order[];
  },

  getAll: async (status?: string): Promise<Order[]> => {
    const response = await api.get('/orders', { params: { status } });
    return extractOrders(response.data as Record<string, unknown>, 'orders') as Order[];
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return extractOrders(response.data as Record<string, unknown>, 'order') as Order;
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return extractOrders(response.data as Record<string, unknown>, 'order') as Order;
  },
};

export default orderService;
