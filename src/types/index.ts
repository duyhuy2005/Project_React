// User types
export interface User {
  id: number;
  ten: string;
  email: string;
  soDienThoai?: string;
  vaiTro: string;
  ngayTao: string;
}

// Legacy User type for backward compatibility
export interface LegacyUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
  avatar?: string;
}

// Convert new User to legacy format
export function toLegacyUser(user: User): LegacyUser {
  return {
    id: user.id.toString(),
    name: user.ten,
    email: user.email,
    phone: user.soDienThoai,
    role: user.vaiTro === 'admin' ? 'admin' : 'customer',
  };
}

// Product types
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

// Legacy Product type
export interface LegacyProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  isNew: boolean;
  isBestSeller: boolean;
  specs: {
    movement: string;
    caseMaterial: string;
    caseSize: string;
    waterResistance: string;
    crystal: string;
    strap: string;
  };
}

// Convert new Product to legacy format
export function toLegacyProduct(product: Product): LegacyProduct {
  return {
    id: product.id.toString(),
    name: product.ten,
    brand: product.thuongHieu,
    price: product.gia,
    originalPrice: product.giaGoc,
    category: product.danhMuc,
    description: product.moTa || '',
    image: product.hinhAnh || '',
    stock: product.soLuongTon,
    rating: product.danhGia,
    reviews: product.soDanhGia,
    isNew: product.sanPhamMoi,
    isBestSeller: product.banChay,
    specs: {
      movement: product.boMay || '',
      caseMaterial: product.chatLieuVo || '',
      caseSize: product.kichThuocVo || '',
      waterResistance: product.chongNuoc || '',
      crystal: product.matKinh || '',
      strap: product.dayDeo || '',
    },
  };
}
