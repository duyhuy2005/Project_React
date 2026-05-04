/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useProductStore } from "../stores/productStore";
import type { Product as APIProduct } from "../services/productService";

// Legacy Product interface
interface Product {
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

// Convert API Product to Legacy Product
function convertToLegacy(apiProduct: APIProduct): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.ten,
    brand: apiProduct.thuongHieu,
    price: apiProduct.gia,
    originalPrice: apiProduct.giaGoc,
    image: apiProduct.hinhAnh || '/images/watch1.png',
    category: apiProduct.danhMuc,
    description: apiProduct.moTa || '',
    rating: apiProduct.danhGia,
    reviews: apiProduct.soDanhGia,
    isNew: apiProduct.sanPhamMoi,
    isBestSeller: apiProduct.banChay,
    specs: {
      movement: apiProduct.boMay || '',
      caseMaterial: apiProduct.chatLieuVo || '',
      caseSize: apiProduct.kichThuocVo || '',
      waterResistance: apiProduct.chongNuoc || '',
      crystal: apiProduct.matKinh || '',
      strap: apiProduct.dayDeo || '',
    },
  };
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: number, product: Product) => void;
  deleteProduct: (id: number) => void;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiProducts, loading, fetchProducts } = useProductStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setProducts(apiProducts.map(convertToLegacy));
  }, [apiProducts]);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product]);
  }, []);

  const updateProduct = useCallback((id: number, product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }
  return context;
};
