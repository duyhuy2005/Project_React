import { useEffect, useRef } from 'react';
import { notification } from 'antd';
import { CheckCircleOutlined, CarOutlined, GiftOutlined } from '@ant-design/icons';
import { useOrderStore } from '../../stores/orderStore';
import { useAuthStore } from '../../stores/authStore';
import { formatPrice } from '../../data/products';
import type { OrderStatus } from '../../stores/orderStore';

export const OrderStatusNotification = () => {
  const orders = useOrderStore((state) => state.orders);
  const user = useAuthStore((state) => state.user);
  const prevOrdersRef = useRef<typeof orders>([]);

  useEffect(() => {
    if (!user) return;

    // Lọc đơn hàng của user hiện tại
    const userOrders = orders.filter(o => o.customerEmail === user.email);
    const prevUserOrders = prevOrdersRef.current.filter(o => o.customerEmail === user.email);

    // Kiểm tra thay đổi trạng thái
    userOrders.forEach(order => {
      const prevOrder = prevUserOrders.find(o => o.id === order.id);
      
      // Nếu có thay đổi trạng thái
      if (prevOrder && prevOrder.status !== order.status) {
        showStatusNotification(order.id, order.status, order.totalAmount);
      }
    });

    prevOrdersRef.current = orders;
  }, [orders, user]);

  const showStatusNotification = (
    orderId: string, 
    newStatus: OrderStatus,
    totalAmount: number
  ) => {
    let icon = <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    let title = '';
    let description: React.ReactNode = '';
    let notifStyle: any = {};

    switch (newStatus) {
      case 'confirmed':
        icon = <CheckCircleOutlined style={{ color: '#52c41a' }} />;
        title = '✅ Đơn hàng đã được xác nhận!';
        description = (
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>
              Mã đơn: {orderId}
            </p>
            <p style={{ margin: '4px 0 0 0' }}>
              Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.
            </p>
            <p style={{ margin: '4px 0 0 0', color: '#c9a96e', fontWeight: 600 }}>
              Tổng tiền: {formatPrice(totalAmount)}
            </p>
          </div>
        );
        notifStyle = {
          background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)',
          border: '2px solid #b7eb8f',
        };
        break;

      case 'shipping':
        icon = <CarOutlined style={{ color: '#1890ff' }} />;
        title = '🚚 Đơn hàng đang được giao!';
        description = (
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>
              Mã đơn: {orderId}
            </p>
            <p style={{ margin: '4px 0 0 0' }}>
              Đơn hàng đang trên đường giao đến bạn. Vui lòng chú ý điện thoại!
            </p>
          </div>
        );
        notifStyle = {
          background: 'linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%)',
          border: '2px solid #91d5ff',
        };
        break;

      case 'completed':
        icon = <GiftOutlined style={{ color: '#faad14' }} />;
        title = '🎉 Đơn hàng đã hoàn thành!';
        description = (
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>
              Mã đơn: {orderId}
            </p>
            <p style={{ margin: '4px 0 0 0' }}>
              Cảm ơn bạn đã mua hàng! Hãy đánh giá sản phẩm để nhận ưu đãi.
            </p>
          </div>
        );
        notifStyle = {
          background: 'linear-gradient(135deg, #fffbe6 0%, #ffffff 100%)',
          border: '2px solid #ffe58f',
        };
        break;

      case 'cancelled':
        title = '❌ Đơn hàng đã bị hủy';
        description = (
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>
              Mã đơn: {orderId}
            </p>
            <p style={{ margin: '4px 0 0 0' }}>
              Đơn hàng của bạn đã bị hủy. Vui lòng liên hệ CSKH nếu cần hỗ trợ.
            </p>
          </div>
        );
        notifStyle = {
          background: 'linear-gradient(135deg, #fff1f0 0%, #ffffff 100%)',
          border: '2px solid #ffccc7',
        };
        break;

      default:
        return;
    }

    notification.open({
      message: title,
      description,
      icon,
      placement: 'topRight',
      duration: 10,
      style: notifStyle,
      onClick: () => {
        // Có thể navigate đến trang tracking
        window.location.href = '/order-tracking';
      },
    });
  };

  return null;
};
