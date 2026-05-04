import api from './api';
import { pickBoolean, pickNumber, pickOptionalNumber, pickString, readDataArray, readDataObject, toNumberId } from '../utils/normalizeApi';

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

const normalizeCoupon = (item: Record<string, unknown>): Coupon => ({
  id: toNumberId(item.id ?? item._id),
  maCode: pickString(item, ['maCode', 'code']),
  giamGia: pickNumber(item, ['giamGia', 'discount']),
  loaiGiamGia: pickString(item, ['loaiGiamGia', 'discountType'], 'fixed'),
  donHangToiThieu: pickNumber(item, ['donHangToiThieu', 'minOrderAmount']),
  giamGiaToiDa: pickOptionalNumber(item, ['giamGiaToiDa', 'maxDiscount']),
  gioiHanSuDung: pickOptionalNumber(item, ['gioiHanSuDung', 'usageLimit']),
  soLanDaSuDung: pickNumber(item, ['soLanDaSuDung', 'usedCount']),
  ngayHetHan: pickString(item, ['ngayHetHan', 'expiryDate']),
  hoatDong: pickBoolean(item, ['hoatDong', 'isActive']),
  nguoiTaoId: toNumberId(item.nguoiTaoId ?? item.createdBy),
  ngayTao: pickString(item, ['ngayTao', 'createdAt']) || new Date().toISOString(),
  ngayCapNhat: pickString(item, ['ngayCapNhat', 'updatedAt']) || new Date().toISOString(),
});

const couponService = {
  getAll: async (): Promise<Coupon[]> => {
    const response = await api.get('/coupons');
    const coupons = readDataArray<Record<string, unknown>>(response.data as Record<string, unknown>, 'coupons');
    return coupons.map(normalizeCoupon);
  },

  getById: async (id: number): Promise<Coupon> => {
    const response = await api.get(`/coupons/${id}`);
    const coupon = readDataObject<Record<string, unknown>>(response.data as Record<string, unknown>, 'coupon');
    return normalizeCoupon(coupon);
  },

  getByCode: async (code: string): Promise<Coupon> => {
    const response = await api.get(`/coupons/code/${code}`);
    const coupon = readDataObject<Record<string, unknown>>(response.data as Record<string, unknown>, 'coupon');
    return normalizeCoupon(coupon);
  },

  validate: async (data: ValidateCouponRequest): Promise<ValidateCouponResponse> => {
    const response = await api.post('/coupons/validate', data);
    return response.data;
  },

  create: async (data: CreateCouponRequest): Promise<Coupon> => {
    const response = await api.post('/coupons', data);
    const coupon = readDataObject<Record<string, unknown>>(response.data as Record<string, unknown>, 'coupon');
    return normalizeCoupon(coupon);
  },

  update: async (id: number, data: Coupon): Promise<Coupon> => {
    const response = await api.put(`/coupons/${id}`, data);
    const coupon = readDataObject<Record<string, unknown>>(response.data as Record<string, unknown>, 'coupon');
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
