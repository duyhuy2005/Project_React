export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  specs: {
    movement: string;
    caseMaterial: string;
    caseSize: string;
    waterResistance: string;
    crystal: string;
    strap: string;
  };
}

export interface CategoryOption {
  key: string;
  label: string;
  icon: string;
}

export interface BrandOption {
  key: string;
  label: string;
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export const categories: CategoryOption[] = [
  { key: 'all', label: 'Tất cả', icon: '⌚' },
  { key: 'dong-ho-nam', label: 'Đồng hồ nam', icon: '⌚' },
  { key: 'dong-ho-nu', label: 'Đồng hồ nữ', icon: '⌚' },
  { key: 'dong-ho-co', label: 'Đồng hồ cơ', icon: '⚙️' },
  { key: 'dong-ho-quartz', label: 'Đồng hồ quartz', icon: '🔋' },
  { key: 'dong-ho-the-thao', label: 'Đồng hồ thể thao', icon: '🏃' },
  { key: 'dong-ho-thong-minh', label: 'Đồng hồ thông minh', icon: '📱' },
];

export const brands: BrandOption[] = [
  { key: 'all', label: 'Tất cả thương hiệu' },
  { key: 'Apple', label: 'Apple' },
  { key: 'Casio', label: 'Casio' },
  { key: 'Citizen', label: 'Citizen' },
  { key: 'Daniel Wellington', label: 'Daniel Wellington' },
  { key: 'Longines', label: 'Longines' },
  { key: 'Orient', label: 'Orient' },
  { key: 'Seiko', label: 'Seiko' },
  { key: 'Tissot', label: 'Tissot' },
];

export const products: Product[] = [];
