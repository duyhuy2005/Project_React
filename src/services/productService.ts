import api from './api';
import {
  normalizeCategorySlug,
  pickBoolean,
  pickNumber,
  pickOptionalNumber,
  pickString,
  readDataArray,
  readDataObject,
  toNumberId,
} from '../utils/normalizeApi';

export interface Product {
  id: number;
  ten: string;
  thuongHieu: string;
  gia: number;
  giaGoc?: number;
  danhMuc: string;
  moTa?: string;
  hinhAnh?: string;
  soLuongTon: number;
  danhGia: number;
  soDanhGia: number;
  sanPhamMoi: boolean;
  banChay: boolean;
  boMay?: string;
  chatLieuVo?: string;
  kichThuocVo?: string;
  chongNuoc?: string;
  matKinh?: string;
  dayDeo?: string;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface CreateProductRequest {
  ten: string;
  thuongHieu: string;
  gia: number;
  giaGoc?: number;
  danhMuc: string;
  moTa?: string;
  hinhAnh?: string;
  soLuongTon: number;
  sanPhamMoi?: boolean;
  banChay?: boolean;
  boMay?: string;
  chatLieuVo?: string;
  kichThuocVo?: string;
  chongNuoc?: string;
  matKinh?: string;
  dayDeo?: string;
}

export interface UpdateProductRequest {
  ten?: string;
  thuongHieu?: string;
  gia?: number;
  giaGoc?: number;
  danhMuc?: string;
  moTa?: string;
  hinhAnh?: string;
  soLuongTon?: number;
  sanPhamMoi?: boolean;
  banChay?: boolean;
  boMay?: string;
  chatLieuVo?: string;
  kichThuocVo?: string;
  chongNuoc?: string;
  matKinh?: string;
  dayDeo?: string;
}

const normalizeProduct = (item: Record<string, unknown>): Product => ({
  id: toNumberId(item.id ?? item._id),
  ten: pickString(item, ['ten', 'name']),
  thuongHieu: pickString(item, ['thuongHieu', 'brand']),
  gia: pickNumber(item, ['gia', 'price']),
  giaGoc: pickOptionalNumber(item, ['giaGoc', 'originalPrice']),
  danhMuc: normalizeCategorySlug(pickString(item, ['danhMuc', 'category', 'rawCategory'])),
  moTa: pickString(item, ['moTa', 'description']),
  hinhAnh: pickString(item, ['hinhAnh', 'image']),
  soLuongTon: pickNumber(item, ['soLuongTon', 'stock']),
  danhGia: pickNumber(item, ['danhGia', 'rating']),
  soDanhGia: pickNumber(item, ['soDanhGia', 'reviews']),
  sanPhamMoi: pickBoolean(item, ['sanPhamMoi', 'isNew']),
  banChay: pickBoolean(item, ['banChay', 'isBestSeller']),
  boMay: pickString(item, ['boMay']) || ((item.specs as Record<string, unknown> | undefined)?.movement as string | undefined) || '',
  chatLieuVo:
    pickString(item, ['chatLieuVo']) ||
    ((item.specs as Record<string, unknown> | undefined)?.caseMaterial as string | undefined) ||
    '',
  kichThuocVo:
    pickString(item, ['kichThuocVo']) ||
    ((item.specs as Record<string, unknown> | undefined)?.caseSize as string | undefined) ||
    '',
  chongNuoc:
    pickString(item, ['chongNuoc']) ||
    ((item.specs as Record<string, unknown> | undefined)?.waterResistance as string | undefined) ||
    '',
  matKinh: pickString(item, ['matKinh']) || ((item.specs as Record<string, unknown> | undefined)?.crystal as string | undefined) || '',
  dayDeo: pickString(item, ['dayDeo']) || ((item.specs as Record<string, unknown> | undefined)?.strap as string | undefined) || '',
  ngayTao: pickString(item, ['ngayTao', 'createdAt']) || new Date().toISOString(),
  ngayCapNhat: pickString(item, ['ngayCapNhat', 'updatedAt']) || new Date().toISOString(),
});

const extractList = <T>(payload: Record<string, unknown>, key: string, mapper: (item: Record<string, unknown>) => T): T[] =>
  readDataArray<Record<string, unknown>>(payload, key).map(mapper);

const extractSingle = <T>(payload: Record<string, unknown>, key: string, mapper: (item: Record<string, unknown>) => T): T =>
  mapper(readDataObject<Record<string, unknown>>(payload, key));

const productService = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    isNew?: boolean;
    isBestSeller?: boolean;
  }): Promise<Product[]> => {
    const response = await api.get('/products', { params });
    return extractList(response.data as Record<string, unknown>, 'products', normalizeProduct);
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return extractSingle(response.data as Record<string, unknown>, 'product', normalizeProduct);
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post('/products', data);
    return extractSingle(response.data as Record<string, unknown>, 'product', normalizeProduct);
  },

  update: async (id: number, data: UpdateProductRequest): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return extractSingle(response.data as Record<string, unknown>, 'product', normalizeProduct);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export default productService;
