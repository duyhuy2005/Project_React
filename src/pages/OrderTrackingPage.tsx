import React, { useState } from "react";
import {
  Input,
  Button,
  Tag,
  Empty,
  Breadcrumb,
  Steps,
  Card,
  Modal,
  Divider,
  message,
} from "antd";
import {
  HomeOutlined,
  SearchOutlined,
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CarOutlined,
  GiftOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders, orderStatusConfig, paymentMethodConfig } from "../context/OrderContext";
import type { Order, OrderStatus } from "../context/OrderContext";
import { formatPrice } from "../data/products";

const statusStepMap: Record<OrderStatus, number> = {
  new: 0,
  confirmed: 1,
  shipping: 2,
  completed: 3,
  cancelled: -1,
};

const OrderTrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { getOrdersByEmail, cancelOrder } = useOrders();
  const [searchOrderId, setSearchOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const userOrders = isLoggedIn && user ? getOrdersByEmail(user.email) : [];

  const handleSearch = () => {
    if (!searchOrderId.trim()) {
      message.warning("Vui lòng nhập mã đơn hàng!");
      return;
    }
    const found = userOrders.find((o) => o.id === searchOrderId.trim());
    if (found) {
      setSelectedOrder(found);
    } else {
      message.error("Không tìm thấy đơn hàng!");
    }
  };

  const handleCancelOrder = (orderId: string) => {
    Modal.confirm({
      title: "Hủy đơn hàng?",
      content: "Bạn có chắc muốn hủy đơn hàng này? Hành động không thể hoàn tác.",
      okText: "Xác nhận hủy",
      cancelText: "Không",
      okButtonProps: { danger: true },
      onOk: () => {
        cancelOrder(orderId);
        message.success("Đã hủy đơn hàng thành công!");
      },
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // If not logged in
  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Vui lòng đăng nhập</h2>
              <p className="text-gray-400">Đăng nhập để xem lịch sử và theo dõi đơn hàng của bạn</p>
            </div>
          }
        >
          <Button type="primary" size="large" onClick={() => navigate("/login")} className="!rounded-full !h-12 !px-8">
            Đăng nhập ngay
          </Button>
        </Empty>
      </div>
    );
  }

  const renderOrderCard = (order: Order) => {
    const statusConf = orderStatusConfig[order.status];
    const stepIndex = statusStepMap[order.status];

    return (
      <Card
        key={order.id}
        className="!rounded-2xl !shadow-sm !border-gray-100 mb-4 hover:!shadow-md transition-shadow"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-400 m-0 mb-1">Mã đơn hàng</p>
            <p className="font-bold text-primary text-lg m-0">{order.id}</p>
          </div>
          <div className="text-right">
            <Tag color={statusConf.color} className="!text-sm !px-3 !py-0.5 !rounded-full !m-0">
              {statusConf.icon} {statusConf.label}
            </Tag>
            <p className="text-xs text-gray-400 m-0 mt-1">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Progress steps */}
        {order.status !== "cancelled" && (
          <div className="mb-6 bg-gray-50 rounded-xl p-4">
            <Steps
              current={stepIndex}
              size="small"
              items={[
                { title: "Chờ xác nhận", icon: <ClockCircleOutlined /> },
                { title: "Đã xác nhận", icon: <CheckCircleOutlined /> },
                { title: "Đang giao", icon: <CarOutlined /> },
                { title: "Hoàn thành", icon: <GiftOutlined /> },
              ]}
            />
          </div>
        )}

        {order.status === "cancelled" && (
          <div className="mb-4 p-3 bg-red-50 rounded-xl text-center">
            <CloseCircleOutlined className="text-red-500 text-xl mb-1" />
            <p className="text-red-500 text-sm font-medium m-0">Đơn hàng đã bị hủy</p>
          </div>
        )}

        {/* Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
              <img src={item.product.image} alt="" className="w-12 h-12 object-contain rounded-lg bg-white" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary m-0 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-400 m-0">{item.product.brand} · x{item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-accent">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Divider className="!my-3" />

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm">
            <span className="text-gray-400">Thanh toán: </span>
            <span className="font-medium">{paymentMethodConfig[order.paymentMethod].icon} {paymentMethodConfig[order.paymentMethod].label}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 m-0">Tổng thanh toán</p>
            <p className="text-xl font-bold text-accent m-0">{formatPrice(order.totalAmount)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(order.status === "new" || order.status === "confirmed") && (
            <Button danger size="small" onClick={() => handleCancelOrder(order.id)} className="!rounded-full">
              Hủy đơn hàng
            </Button>
          )}
          {order.status === "completed" && (
            <Button
              type="primary" size="small"
              icon={<RollbackOutlined />}
              onClick={() => navigate(`/returns?orderId=${order.id}`)}
              className="!rounded-full !bg-gradient-to-r !from-accent !to-accent-dark !border-none"
            >
              Yêu cầu hoàn trả
            </Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb
        className="mb-6"
        items={[
          { title: <Link to="/"><HomeOutlined /> Trang chủ</Link> },
          { title: "Đơn hàng của tôi" },
        ]}
      />

      <h1 className="text-3xl font-bold text-primary mb-2">📦 Đơn hàng của tôi</h1>
      <p className="text-gray-400 mb-8">Theo dõi trạng thái và lịch sử đơn hàng</p>

      {/* Search bar */}
      <div className="flex gap-3 mb-8">
        <Input
          placeholder="Nhập mã đơn hàng (VD: ORD-1234567890)"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
          onPressEnter={handleSearch}
          size="large"
          className="!rounded-xl"
          allowClear
        />
        <Button type="primary" size="large" onClick={handleSearch} className="!rounded-xl !px-6 !bg-accent !border-accent">
          Tìm kiếm
        </Button>
      </div>

      {/* Selected order detail */}
      {selectedOrder && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-primary m-0">Kết quả tìm kiếm</h3>
            <Button type="link" onClick={() => setSelectedOrder(null)} className="!text-accent">
              Đóng
            </Button>
          </div>
          {renderOrderCard(selectedOrder)}
        </div>
      )}

      {/* Order list */}
      {userOrders.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <h3 className="text-lg font-semibold text-primary mb-1">Chưa có đơn hàng nào</h3>
              <p className="text-gray-400 text-sm">Hãy mua sắm để tạo đơn hàng đầu tiên!</p>
            </div>
          }
        >
          <Button type="primary" icon={<ShoppingOutlined />} onClick={() => navigate("/products")} className="!rounded-full">
            Mua sắm ngay
          </Button>
        </Empty>
      ) : (
        <div>
          <h3 className="text-lg font-bold text-primary mb-4">
            Tất cả đơn hàng ({userOrders.length})
          </h3>
          {userOrders.map((order) => renderOrderCard(order))}
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
