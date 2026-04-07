import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { useProductStore } from '../../stores/productStore';
import type { Product } from '../../data/products';

let lastProductCount = 0;

const NewProductNotification = () => {
  const products = useProductStore((state) => state.products);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize on first load
    if (!initialized) {
      lastProductCount = products.length;
      setInitialized(true);
      return;
    }

    // Check if new products were added
    if (products.length > lastProductCount) {
      const newProducts = products.slice(lastProductCount);
      
      newProducts.forEach((product: Product) => {
        notification.success({
          message: '🎉 Sản phẩm mới đã được thêm!',
          description: (
            <div>
              <div className="font-bold text-base mb-2">{product.name}</div>
              <div className="flex items-center gap-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <div className="text-sm text-gray-600">{product.brand}</div>
                  <div className="text-accent font-bold text-lg">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.price)}
                  </div>
                </div>
              </div>
            </div>
          ),
          placement: 'topRight',
          duration: 5,
          style: {
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '2px solid #c9a96e',
          },
        });
      });

      lastProductCount = products.length;
    } else if (products.length < lastProductCount) {
      // Product was deleted
      lastProductCount = products.length;
    }
  }, [products, initialized]);

  return null;
};

export default NewProductNotification;
