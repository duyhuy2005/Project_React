import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Empty,
  Breadcrumb,
  Card,
  Tag,
  Divider,
  message,
  Modal,
} from "antd";
import {
  HomeOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders, returnStatusConfig, orderStatusConfig } from "../context/OrderContext";
import type { Order } from "../context/OrderContext";
import { formatPrice } from "../data/products";

const returnReasons = [
  { value: "defective", label: "Sản phẩm bị lỗi / hỏng" },
  { value: "wrong_item", label: "Nhận sai sản phẩm" },
  { value: "not_as_described", label: "Không đúng mô tả" },
  { value: "change_mind", label: "Đổi ý / Không cần nữa" },
  { value: "size_issue", label: "Kích thước không phù hợp" },
  { value: "other", label: "Lý do khác" },
];

const ReturnRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedOrderId = searchParams.get("orderId") || "";

  const { user, isLoggedIn } = useAuth();
  const { getOrdersByEmail, submitReturnRequest, getReturnsByEmail } = useOrders();
  const [form] = Form.useForm();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userOrders = isLoggedIn && user ? getOrdersByEmail(user.email) : [];
  const completedOrders = userOrders.filter((o) => o.status === "completed");
  const userReturns = isLoggedIn && user ? getReturnsByEmail(user.email) : [];

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Vui lòng đăng nhập</h2>
              <p className="text-gray-400">Đăng nhập để yêu cầu hoàn trả sản phẩm</p>
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

  const handleSelectOrder = (orderId: string) => {
    const order = completedOrders.find((o) => o.id === orderId);
    setSelectedOrder(order || null);
  };

  // Pre-select order if coming from tracking page
  React.useEffect(() => {
    if (preselectedOrderId) {
      handleSelectOrder(preselectedOrderId);
      form.setFieldValue("orderId", preselectedOrderId);
    }
  }, [preselectedOrderId]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedOrder) {
        message.error("Vui lòng chọn đơn hàng!");
        return;
      }

      Modal.confirm({
        title: "Xác nhận yêu cầu hoàn trả",
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            <p>Đơn hàng: <strong>{selectedOrder.id}</strong></p>
            <p>Lý do: <strong>{returnReasons.find((r) => r.value === values.reason)?.label}</strong></p>
            <p className="text-gray-400 text-sm">Chúng tôi sẽ xem xét yêu cầu của bạn trong 1-3 ngày làm việc.</p>
          </div>
        ),
        okText: "Gửi yêu cầu",
        cancelText: "Hủy",
        onOk: async () => {
          setIsSubmitting(true);
          await new Promise((resolve) => setTimeout(resolve, 1000));

          submitReturnRequest({
            orderId: selectedOrder.id,
            reason: values.reason,
            description: values.description || "",
            items: selectedOrder.items,
            refundAmount: selectedOrder.totalAmount,
          });

          message.success("Đã gửi yêu cầu hoàn trả thành công!");
          form.resetFields();
          setSelectedOrder(null);
          setIsSubmitting(false);
        },
      });
    } catch {
      message.warning("Vui lòng điền đầy đủ thông tin!");
    }
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

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb
        className="mb-6"
        items={[
          { title: <Link to="/"><HomeOutlined /> Trang chủ</Link> },
          { title: <Link to="/orders">Đơn hàng</Link> },
          { title: "Hoàn trả" },
        ]}
      />

      <h1 className="text-3xl font-bold text-primary mb-2">🔄 Hoàn trả sản phẩm</h1>
      <p className="text-gray-400 mb-8">Gửi yêu cầu hoàn trả cho đơn hàng đã hoàn thành</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <Card className="!rounded-2xl !shadow-sm !border-gray-100">
            <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <RollbackOutlined className="text-accent" /> Tạo yêu cầu hoàn trả
            </h3>

            {completedOrders.length === 0 ? (
              <Empty
                description={
                  <div>
                    <p className="text-gray-500 mb-1">Không có đơn hàng nào đủ điều kiện hoàn trả</p>
                    <p className="text-gray-400 text-xs">Chỉ đơn hàng đã hoàn thành mới có thể yêu cầu hoàn trả</p>
                  </div>
                }
              />
            ) : (
              <Form form={form} layout="vertical">
                <Form.Item
                  name="orderId"
                  label="Chọn đơn hàng"
                  rules={[{ required: true, message: "Vui lòng chọn đơn hàng!" }]}
                >
                  <Select
                    placeholder="Chọn đơn hàng cần hoàn trả"
                    size="large"
                    className="!rounded-xl"
                    onChange={handleSelectOrder}
                    options={completedOrders.map((o) => ({
                      value: o.id,
                      label: (
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{o.id}</span>
                          <span className="text-accent text-sm">{formatPrice(o.totalAmount)}</span>
                        </div>
                      ),
                    }))}
                  />
                </Form.Item>

                {/* Selected order preview */}
                {selectedOrder && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="font-semibold text-sm text-gray-600 mb-2">Sản phẩm trong đơn hàng:</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img src={item.product.image} alt="" className="w-10 h-10 object-contain rounded-lg bg-white" />
                          <div className="flex-1">
                            <p className="text-sm font-medium m-0">{item.product.name}</p>
                            <p className="text-xs text-gray-400 m-0">x{item.quantity}</p>
                          </div>
                          <span className="text-sm text-accent font-medium">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <Divider className="!my-3" />
                    <p className="text-sm m-0">
                      <span className="text-gray-400">Số tiền hoàn trả: </span>
                      <strong className="text-accent text-lg">{formatPrice(selectedOrder.totalAmount)}</strong>
                    </p>
                  </div>
                )}

                <Form.Item
                  name="reason"
                  label="Lý do hoàn trả"
                  rules={[{ required: true, message: "Vui lòng chọn lý do!" }]}
                >
                  <Select
                    placeholder="Chọn lý do"
                    size="large"
                    className="!rounded-xl"
                    options={returnReasons}
                  />
                </Form.Item>

                <Form.Item name="description" label="Mô tả chi tiết">
                  <Input.TextArea
                    rows={4}
                    placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                    className="!rounded-xl"
                  />
                </Form.Item>

                <Button
                  type="primary"
                  size="large"
                  block
                  loading={isSubmitting}
                  onClick={handleSubmit}
                  className="!h-14 !rounded-full !font-bold !bg-gradient-to-r !from-accent !to-accent-dark !border-none"
                >
                  Gửi yêu cầu hoàn trả
                </Button>
              </Form>
            )}
          </Card>
        </div>

        {/* Return history */}
        <div className="lg:col-span-2">
          <Card className="!rounded-2xl !shadow-sm !border-gray-100">
            <h3 className="text-lg font-bold text-primary mb-4">Lịch sử hoàn trả</h3>

            {userReturns.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<p className="text-gray-400 text-sm">Chưa có yêu cầu hoàn trả nào</p>}
              />
            ) : (
              <div className="space-y-3">
                {userReturns.map((ret) => {
                  const statusConf = returnStatusConfig[ret.status];
                  return (
                    <div key={ret.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-sm text-primary m-0">{ret.id}</p>
                        <Tag color={statusConf.color} className="!rounded-full !m-0 !text-xs">
                          {statusConf.label}
                        </Tag>
                      </div>
                      <p className="text-xs text-gray-400 m-0 mb-1">Đơn hàng: {ret.orderId}</p>
                      <p className="text-xs text-gray-400 m-0 mb-1">
                        Lý do: {returnReasons.find((r) => r.value === ret.reason)?.label || ret.reason}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-400">{formatDate(ret.createdAt)}</span>
                        <span className="text-sm font-bold text-accent">{formatPrice(ret.refundAmount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestPage;
