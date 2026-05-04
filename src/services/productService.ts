import api from './api';

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

const toNumberId = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number(value.replace(/\D/g, ''));
    return Number.isNaN(numeric) ? 0 : numeric;
  }
  return 0;
};

const normalizeCategoryValue = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';

  const normalized = trimmed
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || trimmed.toLowerCase();
};

const normalizeProduct = (item: Record<string, unknown>): Product => ({
  id: toNumberId(item.id ?? item._id),
  ten: (item.ten as string | undefined) ?? (item.name as string | undefined) ?? '',
  thuongHieu: (item.thuongHieu as string | undefined) ?? (item.brand as string | undefined) ?? '',
  gia: Number((item.gia as number | undefined) ?? (item.price as number | undefined) ?? 0),
  giaGoc: (item.giaGoc as number | undefined) ?? (item.originalPrice as number | undefined),
  danhMuc: normalizeCategoryValue((item.danhMuc as string | undefined) ?? (item.category as string | undefined)),
  moTa: (item.moTa as string | undefined) ?? (item.description as string | undefined) ?? '',
  hinhAnh: (item.hinhAnh as string | undefined) ?? (item.image as string | undefined) ?? '',
  soLuongTon: Number((item.soLuongTon as number | undefined) ?? (item.stock as number | undefined) ?? 0),
  danhGia: Number((item.danhGia as number | undefined) ?? (item.rating as number | undefined) ?? 0),
  soDanhGia: Number((item.soDanhGia as number | undefined) ?? (item.reviews as number | undefined) ?? 0),
  sanPhamMoi: Boolean((item.sanPhamMoi as boolean | undefined) ?? (item.isNew as boolean | undefined)),
  banChay: Boolean((item.banChay as boolean | undefined) ?? (item.isBestSeller as boolean | undefined)),
  boMay: (item.boMay as string | undefined) ?? ((item.specs as Record<string, unknown> | undefined)?.movement as string | undefined),
  chatLieuVo:
    (item.chatLieuVo as string | undefined) ??
    ((item.specs as Record<string, unknown> | undefined)?.caseMaterial as string | undefined),
  kichThuocVo:
    (item.kichThuocVo as string | undefined) ??
    ((item.specs as Record<string, unknown> | undefined)?.caseSize as string | undefined),
  chongNuoc:
    (item.chongNuoc as string | undefined) ??
    ((item.specs as Record<string, unknown> | undefined)?.waterResistance as string | undefined),
  matKinh: (item.matKinh as string | undefined) ?? ((item.specs as Record<string, unknown> | undefined)?.crystal as string | undefined),
  dayDeo: (item.dayDeo as string | undefined) ?? ((item.specs as Record<string, unknown> | undefined)?.strap as string | undefined),
  ngayTao: (item.ngayTao as string | undefined) ?? (item.createdAt as string | undefined) ?? new Date().toISOString(),
  ngayCapNhat: (item.ngayCapNhat as string | undefined) ?? (item.updatedAt as string | undefined) ?? new Date().toISOString(),
});

const extractList = <T>(payload: Record<string, unknown>, key: string, mapper: (item: Record<string, unknown>) => T): T[] => {
  const data = payload.data as Record<string, unknown> | undefined;
  const raw = (data?.[key] as Record<string, unknown>[] | undefined) ?? [];
  return raw.map(mapper);
};

const extractSingle = <T>(payload: Record<string, unknown>, key: string, mapper: (item: Record<string, unknown>) => T): T => {
  const data = payload.data as Record<string, unknown> | undefined;
  const raw = (data?.[key] as Record<string, unknown> | undefined) ?? {};
  return mapper(raw);
};

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
