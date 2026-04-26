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

const couponService = {
  // Lấy danh sách mã giảm giá (Admin)
  getAll: async (): Promise<Coupon[]> => {
    const response = await api.get('/coupons');
    return response.data.data;
  },

  // Lấy chi tiết mã giảm giá (Admin)
  getById: async (id: number): Promise<Coupon> => {
    const response = await api.get(`/coupons/${id}`);
    return response.data.data;
  },

  // Lấy mã giảm giá theo code
  getByCode: async (code: string): Promise<Coupon> => {
    const response = await api.get(`/coupons/code/${code}`);
    return response.data.data;
  },

  // Validate mã giảm giá
  validate: async (data: ValidateCouponRequest): Promise<ValidateCouponResponse> => {
    const response = await api.post('/coupons/validate', data);
    return response.data;
  },

  // Tạo mã giảm giá mới (Admin)
  create: async (data: CreateCouponRequest): Promise<Coupon> => {
    const response = await api.post('/coupons', data);
    return response.data.data;
  },

  // Cập nhật mã giảm giá (Admin)
  update: async (id: number, data: Coupon): Promise<Coupon> => {
    const response = await api.put(`/coupons/${id}`, data);
    return response.data.data;
  },

  // Xóa mã giảm giá (Admin)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/coupons/${id}`);
  },

  // Vô hiệu hóa mã giảm giá (Admin)
  deactivate: async (id: number): Promise<void> => {
    await api.patch(`/coupons/${id}/deactivate`);
  },
};

export default couponService;
