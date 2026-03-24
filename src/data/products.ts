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

export const products: Product[] = [
  {
    id: 1,
    name: "Royal Oak Classic Gold",
    brand: "LuxTime",
    price: 12500000,
    originalPrice: 15000000,
    image: "/images/watch1.png",
    category: "luxury",
    description: "Đồng hồ nam cao cấp với mặt số đen sang trọng, kim vàng thanh lịch và dây da đen. Phong cách cổ điển vượt thời gian dành cho quý ông thành đạt.",
    rating: 4.8,
    reviews: 234,
    isNew: true,
    specs: {
      movement: "Automatic",
      caseMaterial: "Thép không gỉ mạ vàng 18K",
      caseSize: "42mm",
      waterResistance: "100m",
      crystal: "Sapphire",
      strap: "Da bê Ý cao cấp",
    },
  },
  {
    id: 2,
    name: "Minimalist Silver Elite",
    brand: "ChronoX",
    price: 8900000,
    image: "/images/watch2.png",
    category: "classic",
    description: "Thiết kế tối giản hiện đại với mặt số trắng tinh khiết, kim mảnh thanh lịch và dây thép bạc sáng bóng. Hoàn hảo cho phong cách công sở.",
    rating: 4.6,
    reviews: 189,
    isBestSeller: true,
    specs: {
      movement: "Quartz Nhật Bản",
      caseMaterial: "Thép không gỉ 316L",
      caseSize: "40mm",
      waterResistance: "50m",
      crystal: "Sapphire",
      strap: "Thép không gỉ",
    },
  },
  {
    id: 3,
    name: "Sport Chrono X1",
    brand: "VeloTime",
    price: 6750000,
    originalPrice: 8200000,
    image: "/images/watch3.png",
    category: "sport",
    description: "Đồng hồ thể thao chronograph mạnh mẽ với nhiều mặt phụ, điểm nhấn cam nổi bật và dây cao su bền bỉ. Dành cho người yêu thể thao.",
    rating: 4.7,
    reviews: 312,
    isNew: true,
    isBestSeller: true,
    specs: {
      movement: "Quartz Chronograph",
      caseMaterial: "Thép không gỉ PVD đen",
      caseSize: "44mm",
      waterResistance: "200m",
      crystal: "Sapphire chống xước",
      strap: "Cao su FKM",
    },
  },
  {
    id: 4,
    name: "Heritage Rose Gold",
    brand: "LuxTime",
    price: 18500000,
    image: "/images/watch1.png",
    category: "luxury",
    description: "Đồng hồ vàng hồng sang trọng với mặt số ngọc trai, chỉ số kim cương và dây lưới vàng hồng thanh lịch. Tuyệt phẩm cho phái đẹp.",
    rating: 4.9,
    reviews: 156,
    specs: {
      movement: "Automatic Thụy Sĩ",
      caseMaterial: "Vàng hồng 18K",
      caseSize: "36mm",
      waterResistance: "30m",
      crystal: "Sapphire",
      strap: "Lưới vàng hồng",
    },
  },
  {
    id: 5,
    name: "Ocean Diver Pro",
    brand: "AquaForce",
    price: 9800000,
    originalPrice: 11500000,
    image: "/images/watch2.png",
    category: "sport",
    description: "Đồng hồ lặn chuyên nghiệp xanh navy với các vạch dạ quang, vành xoay và dây thép bền bỉ. Bạn đồng hành tin cậy dưới lòng đại dương.",
    rating: 4.5,
    reviews: 278,
    isBestSeller: true,
    specs: {
      movement: "Automatic",
      caseMaterial: "Thép không gỉ 316L",
      caseSize: "43mm",
      waterResistance: "300m",
      crystal: "Sapphire chống xước",
      strap: "Thép không gỉ",
    },
  },
  {
    id: 6,
    name: "Skeleton Maestro",
    brand: "ChronoX",
    price: 22000000,
    image: "/images/watch3.png",
    category: "luxury",
    description: "Đồng hồ skeleton tuyệt đẹp phô diễn bộ máy cơ học tinh xảo, vỏ vàng và dây da nâu. Kiệt tác nghệ thuật chế tác đồng hồ.",
    rating: 4.9,
    reviews: 98,
    isNew: true,
    specs: {
      movement: "Tourbillon thủ công",
      caseMaterial: "Vàng 18K",
      caseSize: "41mm",
      waterResistance: "30m",
      crystal: "Sapphire đôi",
      strap: "Da cá sấu",
    },
  },
  {
    id: 7,
    name: "Urban Street V2",
    brand: "VeloTime",
    price: 3500000,
    originalPrice: 4200000,
    image: "/images/watch1.png",
    category: "casual",
    description: "Đồng hồ casual phong cách đường phố với thiết kế trẻ trung, năng động. Phù hợp cho mọi hoạt động hàng ngày.",
    rating: 4.3,
    reviews: 445,
    specs: {
      movement: "Quartz Nhật Bản",
      caseMaterial: "Thép không gỉ",
      caseSize: "38mm",
      waterResistance: "50m",
      crystal: "Mineral cứng",
      strap: "Vải NATO",
    },
  },
  {
    id: 8,
    name: "Executive Platinum",
    brand: "LuxTime",
    price: 35000000,
    image: "/images/watch2.png",
    category: "luxury",
    description: "Đồng hồ platinum đỉnh cao xa xỉ với mặt số thiên thạch, kim platimum và dây da đà điểu. Biểu tượng của đẳng cấp tuyệt đối.",
    rating: 5.0,
    reviews: 42,
    isNew: true,
    specs: {
      movement: "Automatic Thụy Sĩ COSC",
      caseMaterial: "Platinum 950",
      caseSize: "40mm",
      waterResistance: "100m",
      crystal: "Sapphire AR coating",
      strap: "Da đà điểu",
    },
  },
  {
    id: 9,
    name: "Titan Field Watch",
    brand: "AquaForce",
    price: 5200000,
    image: "/images/watch3.png",
    category: "casual",
    description: "Đồng hồ field watch titanium siêu nhẹ với mặt số xanh lá quân đội, chữ số rõ ràng. Bền bỉ cho mọi cuộc phiêu lưu.",
    rating: 4.4,
    reviews: 367,
    specs: {
      movement: "Quartz",
      caseMaterial: "Titanium Grade 5",
      caseSize: "42mm",
      waterResistance: "100m",
      crystal: "Sapphire",
      strap: "Vải Canvas",
    },
  },
];

export const categories = [
  { key: "all", label: "Tất cả", icon: "🕐" },
  { key: "luxury", label: "Cao cấp", icon: "💎" },
  { key: "sport", label: "Thể thao", icon: "⚡" },
  { key: "classic", label: "Cổ điển", icon: "🎩" },
  { key: "casual", label: "Casual", icon: "😎" },
];

export const brands = [
  { key: "all", label: "Tất cả" },
  { key: "LuxTime", label: "LuxTime" },
  { key: "ChronoX", label: "ChronoX" },
  { key: "VeloTime", label: "VeloTime" },
  { key: "AquaForce", label: "AquaForce" },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
