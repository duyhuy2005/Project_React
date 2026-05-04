import api from './api';

export interface ReturnOrderInfo {
  maDonHang?: string;
  chiTietDonHangs?: Array<{
    id: number;
    sanPhamId: number;
    tenSanPham: string;
    hinhAnhSanPham?: string;
    gia: number;
    soLuong: number;
    tongPhu: number;
  }>;
}

export interface ReturnUserInfo {
  id?: number;
  ten?: string;
  email?: string;
}

export interface ReturnRequest {
  id: string;
  maHoanTra: string;
  donHangId: string;
  nguoiDungId: string;
  lyDo: string;
  trangThai: string;
  soTienHoanTra?: number;
  ghiChuQuanTri?: string;
  ngayTao: string;
  ngayCapNhat: string;
  donHang?: ReturnOrderInfo;
  nguoiDung?: ReturnUserInfo;
}

export interface CreateReturnRequest {
  donHangId: string;
  lyDo: string;
}

export interface UpdateReturnStatusRequest {
  trangThai: string;
  ghiChuQuanTri?: string;
}

const toStringId = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
};

const normalizeReturn = (item: Record<string, unknown>): ReturnRequest => ({
  id: toStringId(item.id ?? item._id),
  maHoanTra: (item.maHoanTra as string | undefined) ?? `RTN-${item.id ?? item._id ?? Date.now()}`,
  donHangId: toStringId(item.donHangId ?? item.orderId ?? item.order),
  nguoiDungId: toStringId(item.nguoiDungId ?? item.userId ?? item.user),
  lyDo: (item.lyDo as string | undefined) ?? (item.reason as string | undefined) ?? '',
  trangThai: (item.trangThai as string | undefined) ?? (item.status as string | undefined) ?? 'pending',
  soTienHoanTra: (item.soTienHoanTra as number | undefined) ?? (item.refundAmount as number | undefined),
  ghiChuQuanTri: (item.ghiChuQuanTri as string | undefined) ?? (item.adminNote as string | undefined) ?? (item.description as string | undefined),
  ngayTao: (item.ngayTao as string | undefined) ?? (item.createdAt as string | undefined) ?? new Date().toISOString(),
  ngayCapNhat: (item.ngayCapNhat as string | undefined) ?? (item.updatedAt as string | undefined) ?? new Date().toISOString(),
  donHang: item.donHang as ReturnOrderInfo | undefined,
  nguoiDung: item.nguoiDung as ReturnUserInfo | undefined,
});

const extractList = (payload: Record<string, unknown>): ReturnRequest[] => {
  const returns = ((payload.data as Record<string, unknown> | undefined)?.returns as Record<string, unknown>[] | undefined) ?? [];
  return returns.map(normalizeReturn);
};

const extractSingle = (payload: Record<string, unknown>): ReturnRequest => {
  const data = (payload.data as Record<string, unknown> | undefined) ?? {};
  const raw = ((data.return as Record<string, unknown> | undefined) ?? (data.request as Record<string, unknown> | undefined) ?? {});
  return normalizeReturn(raw);
};

const returnService = {
  getMyReturns: async (): Promise<ReturnRequest[]> => {
    const response = await api.get('/returns/my');
    return extractList(response.data as Record<string, unknown>);
  },

  getAll: async (status?: string): Promise<ReturnRequest[]> => {
    const response = await api.get('/returns', { params: { status } });
    return extractList(response.data as Record<string, unknown>);
  },

  getById: async (id: string): Promise<ReturnRequest> => {
    const response = await api.get(`/returns/${id}`);
    return extractSingle(response.data as Record<string, unknown>);
  },

  create: async (data: CreateReturnRequest): Promise<ReturnRequest> => {
    const response = await api.post('/returns', {
      orderId: data.donHangId,
      reason: data.lyDo,
      description: '',
    });
    return extractSingle(response.data as Record<string, unknown>);
  },

  updateStatus: async (id: string, data: UpdateReturnStatusRequest): Promise<ReturnRequest> => {
    const response = await api.put(`/returns/${id}/status`, {
      status: data.trangThai,
      adminNote: data.ghiChuQuanTri,
    });
    return extractSingle(response.data as Record<string, unknown>);
  },

  updateRefundAmount: async (id: string, amount: number): Promise<ReturnRequest> => {
    const response = await api.patch(`/returns/${id}/refund-amount`, { amount });
    return extractSingle(response.data as Record<string, unknown>);
  },

  cancel: async (id: string): Promise<void> => {
    await api.delete(`/returns/${id}`);
  },
};

export default returnService;
