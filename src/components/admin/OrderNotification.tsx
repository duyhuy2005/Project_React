import { useEffect, useRef } from 'react';
import { notification } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useOrderStore } from '../../stores/orderStore';
import { formatPrice } from '../../data/products';

export const OrderNotification = () => {
  const orders = useOrderStore((state) => state.orders);
  const prevOrderCountRef = useRef(orders.length);

  useEffect(() => {
    // Chỉ hiển thị notification khi có đơn hàng mới (không phải lần đầu load)
    if (prevOrderCountRef.current > 0 && orders.length > prevOrderCountRef.current) {
      const newOrder = orders[0]; // Đơn hàng mới nhất
      
      if (newOrder.status === 'new') {
        notification.success({
          message: '🎉 Đơn hàng mới!',
          description: (
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>
                Mã đơn: {newOrder.id}
              </p>
              <p style={{ margin: '4px 0 0 0' }}>
                Khách hàng: {newOrder.customerName}
              </p>
              <p style={{ margin: '4px 0 0 0', color: '#c9a96e', fontWeight: 600 }}>
                Tổng tiền: {formatPrice(newOrder.totalAmount)}
              </p>
            </div>
          ),
          icon: <ShoppingCartOutlined style={{ color: '#52c41a' }} />,
          placement: 'topRight',
          duration: 8,
          style: {
            background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)',
            border: '2px solid #b7eb8f',
          },
        });
      }
    }
    
    prevOrderCountRef.current = orders.length;
  }, [orders]);

  return null;
};
