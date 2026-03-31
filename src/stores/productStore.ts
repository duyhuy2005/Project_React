import { create } from 'zustand';
import { products as initialProducts } from '../data/products';
import type { Product } from '../data/products';

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: number, product: Product) => void;
  deleteProduct: (id: number) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: initialProducts,
  
  addProduct: (product) => {
    set((state) => ({ products: [...state.products, product] }));
  },
  
  updateProduct: (id, product) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? product : p)),
    }));
  },
  
  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },
}));
