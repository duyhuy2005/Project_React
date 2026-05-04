import api from './api';

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

const toStringId = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
};

const toNumberId = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number(value.replace(/\D/g, ''));
    return Number.isNaN(numeric) ? 0 : numeric;
  }
  return 0;
};

const normalizeOrderItemDetail = (item: Record<string, unknown>, index: number): OrderItemDetail => ({
  id: toNumberId(item.id ?? index + 1),
  sanPhamId: toNumberId(item.sanPhamId ?? item.productId ?? item.product),
  tenSanPham:
    (item.tenSanPham as string | undefined) ??
    ((item.product as Record<string, unknown> | undefined)?.name as string | undefined) ??
    `Sản phẩm #${index + 1}`,
  hinhAnhSanPham:
    (item.hinhAnhSanPham as string | undefined) ??
    ((item.product as Record<string, unknown> | undefined)?.image as string | undefined),
  gia: Number((item.gia as number | undefined) ?? (item.price as number | undefined) ?? 0),
  soLuong: Number((item.soLuong as number | undefined) ?? (item.quantity as number | undefined) ?? 0),
  tongPhu:
    Number((item.tongPhu as number | undefined) ?? ((item.price as number | undefined) ?? 0) * ((item.quantity as number | undefined) ?? 0)),
});

const normalizeOrder = (item: Record<string, unknown>): Order => {
  const rawItems = ((item.chiTietDonHangs as Record<string, unknown>[] | undefined) ??
    (item.items as Record<string, unknown>[] | undefined) ??
    []);

  const details = rawItems.map(normalizeOrderItemDetail);
  const total = Number((item.tongTien as number | undefined) ?? (item.totalAmount as number | undefined) ?? details.reduce((sum, detail) => sum + detail.tongPhu, 0));

  return {
    id: toStringId(item.id ?? item._id),
    maDonHang: (item.maDonHang as string | undefined) ?? `ORD-${item.id ?? item._id ?? Date.now()}`,
    nguoiDungId: toStringId(item.nguoiDungId ?? item.userId ?? item.user),
    tenKhachHang: (item.tenKhachHang as string | undefined) ?? (item.customerName as string | undefined) ?? '',
    emailKhachHang: (item.emailKhachHang as string | undefined) ?? (item.customerEmail as string | undefined) ?? '',
    soDienThoaiKhachHang: (item.soDienThoaiKhachHang as string | undefined) ?? (item.customerPhone as string | undefined) ?? '',
    diaChiGiaoHang: (item.diaChiGiaoHang as string | undefined) ?? (item.shippingAddress as string | undefined) ?? (item.address as string | undefined) ?? '',
    tongTien: total,
    trangThai: (item.trangThai as string | undefined) ?? (item.status as string | undefined) ?? 'new',
    phuongThucThanhToan: (item.phuongThucThanhToan as string | undefined) ?? (item.paymentMethod as string | undefined),
    trangThaiThanhToan: (item.trangThaiThanhToan as string | undefined) ?? 'pending',
    ghiChu: (item.ghiChu as string | undefined) ?? (item.note as string | undefined),
    ngayTao: (item.ngayTao as string | undefined) ?? (item.createdAt as string | undefined) ?? new Date().toISOString(),
    ngayCapNhat: (item.ngayCapNhat as string | undefined) ?? (item.updatedAt as string | undefined) ?? new Date().toISOString(),
    chiTietDonHangs: details,
  };
};

const extractOrders = (payload: Record<string, unknown>, key: 'order' | 'orders'): Order[] | Order => {
  const data = (payload.data as Record<string, unknown> | undefined) ?? {};
  if (key === 'orders') {
    const orders = (data.orders as Record<string, unknown>[] | undefined) ?? [];
    return orders.map(normalizeOrder);
  }

  return normalizeOrder((data.order as Record<string, unknown> | undefined) ?? {});
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
