import api from './api';

export interface Coupon {
  id: number;
  maCode: string;
  giamGia: number;
  loaiGiamGia: string;
  donHangToiThieu: number;
  giamGiaToiDa?: number;
  gioiHanSuDung?: number;
  soLanDaSuDung: number;
  ngayHetHan?: string;
  hoatDong: boolean;
  nguoiTaoId: number;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface CreateCouponRequest {
  maCode: string;
  giamGia: number;
  loaiGiamGia: string;
  donHangToiThieu: number;
  giamGiaToiDa?: number;
  gioiHanSuDung?: number;
  ngayHetHan?: string;
  hoatDong?: boolean;
}

export interface ValidateCouponRequest {
  code: string;
  orderAmount: number;
}

export interface ValidateCouponResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    maCode: string;
    giamGia: number;
    loaiGiamGia: string;
    discount: number;
    finalAmount: number;
  };
}

const toNumberId = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number(value.replace(/\D/g, ''));
    return Number.isNaN(numeric) ? 0 : numeric;
  }
  return 0;
};

const normalizeCoupon = (item: Record<string, unknown>): Coupon => ({
  id: toNumberId(item.id ?? item._id),
  maCode: (item.maCode as string | undefined) ?? (item.code as string | undefined) ?? '',
  giamGia: Number((item.giamGia as number | undefined) ?? (item.discount as number | undefined) ?? 0),
  loaiGiamGia: (item.loaiGiamGia as string | undefined) ?? (item.discountType as string | undefined) ?? 'fixed',
  donHangToiThieu: Number((item.donHangToiThieu as number | undefined) ?? (item.minOrderAmount as number | undefined) ?? 0),
  giamGiaToiDa: (item.giamGiaToiDa as number | undefined) ?? (item.maxDiscount as number | undefined),
  gioiHanSuDung: (item.gioiHanSuDung as number | undefined) ?? (item.usageLimit as number | undefined),
  soLanDaSuDung: Number((item.soLanDaSuDung as number | undefined) ?? (item.usedCount as number | undefined) ?? 0),
  ngayHetHan: (item.ngayHetHan as string | undefined) ?? (item.expiryDate as string | undefined),
  hoatDong: Boolean((item.hoatDong as boolean | undefined) ?? (item.isActive as boolean | undefined)),
  nguoiTaoId: toNumberId(item.nguoiTaoId ?? item.createdBy),
  ngayTao: (item.ngayTao as string | undefined) ?? (item.createdAt as string | undefined) ?? new Date().toISOString(),
  ngayCapNhat: (item.ngayCapNhat as string | undefined) ?? (item.updatedAt as string | undefined) ?? new Date().toISOString(),
});

const couponService = {
  getAll: async (): Promise<Coupon[]> => {
    const response = await api.get('/coupons');
    const coupons = ((response.data.data as Record<string, unknown> | undefined)?.coupons as Record<string, unknown>[] | undefined) ?? [];
    return coupons.map(normalizeCoupon);
  },

  getById: async (id: number): Promise<Coupon> => {
    const response = await api.get(`/coupons/${id}`);
    const coupon = ((response.data.data as Record<string, unknown> | undefined)?.coupon as Record<string, unknown> | undefined) ?? {};
    return normalizeCoupon(coupon);
  },

  getByCode: async (code: string): Promise<Coupon> => {
    const response = await api.get(`/coupons/code/${code}`);
    const coupon = ((response.data.data as Record<string, unknown> | undefined)?.coupon as Record<string, unknown> | undefined) ?? {};
    return normalizeCoupon(coupon);
  },

  validate: async (data: ValidateCouponRequest): Promise<ValidateCouponResponse> => {
    const response = await api.post('/coupons/validate', data);
    return response.data;
  },

  create: async (data: CreateCouponRequest): Promise<Coupon> => {
    const response = await api.post('/coupons', data);
    const coupon = ((response.data.data as Record<string, unknown> | undefined)?.coupon as Record<string, unknown> | undefined) ?? {};
    return normalizeCoupon(coupon);
  },

  update: async (id: number, data: Coupon): Promise<Coupon> => {
    const response = await api.put(`/coupons/${id}`, data);
    const coupon = ((response.data.data as Record<string, unknown> | undefined)?.coupon as Record<string, unknown> | undefined) ?? {};
    return normalizeCoupon(coupon);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/coupons/${id}`);
  },

  deactivate: async (id: number): Promise<void> => {
    await api.patch(`/coupons/${id}/deactivate`);
  },
};

export default couponService;
