import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Breadcrumb,
  Divider,
  Card,
  Steps,
  message,
  Result,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { useOrderStore, paymentMethodConfig } from "../stores/orderStore";
import type { PaymentMethod } from "../stores/orderStore";
import { formatPrice } from "../data/products";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const placeOrder = useOrderStore((state) => state.placeOrder);
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = totalPrice >= 5000000 ? 0 : 50000;
  const grandTotal = totalPrice + shippingFee;

  // If cart is empty and no order placed, redirect
  if (items.length === 0 && !placedOrderId) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <Result
          icon={<span className="text-6xl">🛒</span>}
          title="Giỏ hàng trống"
          subTitle="Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán"
          extra={
            <Button type="primary" size="large" onClick={() => navigate("/products")} className="!rounded-full !h-12 !px-8">
              Tiếp tục mua sắm
            </Button>
          }
        />
      </div>
    );
  }

  // Order success
  if (placedOrderId) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Result
          status="success"
          icon={<CheckCircleOutlined className="!text-green-500" />}
          title={<span className="text-2xl font-bold text-primary">Đặt hàng thành công! 🎉</span>}
          subTitle={
            <div className="text-gray-500 mt-2">
              <p className="mb-1">Mã đơn hàng: <strong className="text-accent">{placedOrderId}</strong></p>
              <p>Chúng tôi sẽ xác nhận đơn hàng trong thời gian sớm nhất.</p>
            </div>
          }
          extra={[
            <Button key="orders" type="primary" size="large" onClick={() => navigate("/orders")} className="!rounded-full !h-12 !px-8 !bg-gradient-to-r !from-accent !to-accent-dark !border-none">
              Theo dõi đơn hàng
            </Button>,
            <Button key="home" size="large" onClick={() => navigate("/")} className="!rounded-full !h-12 !px-8">
              Về trang chủ
            </Button>,
          ]}
        />
      </div>
    );
  }

  const handleSubmitOrder = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const order = placeOrder({
        customerName: values.name,
        customerEmail: values.email,
        customerPhone: values.phone,
        address: values.address,
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: grandTotal,
        shippingFee,
        paymentMethod,
        note: values.note,
      });

      setPlacedOrderId(order.id);
      clearCart();
      message.success("Đặt hàng thành công!");
    } catch {
      message.error("Vui lòng điền đầy đủ thông tin!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields(["name", "email", "phone", "address"]);
        setCurrentStep(1);
      } catch {
        message.warning("Vui lòng điền đầy đủ thông tin giao hàng!");
      }
    } else if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb
        className="mb-6"
        items={[
          { title: <Link to="/"><HomeOutlined /> Trang chủ</Link> },
          { title: <Link to="/cart">Giỏ hàng</Link> },
          { title: "Thanh toán" },
        ]}
      />

      <h1 className="text-3xl font-bold text-primary mb-8">💳 Thanh toán</h1>

      <Steps
        current={currentStep}
        className="mb-10 max-w-xl"
        items={[
          { title: "Thông tin", icon: <UserOutlined /> },
          { title: "Thanh toán", icon: <CreditCardOutlined /> },
          { title: "Xác nhận", icon: <CheckCircleOutlined /> },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              name: user?.name || "",
              email: user?.email || "",
              phone: user?.phone || "",
            }}
          >
            {/* Step 1: Shipping Info */}
            <div style={{ display: currentStep === 0 ? "block" : "none" }}>
              <Card className="!rounded-2xl !shadow-sm !border-gray-100">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                  <EnvironmentOutlined className="text-accent" /> Thông tin giao hàng
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <Form.Item
                    name="name" label="Họ và tên"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                  >
                    <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyễn Văn A" size="large" className="!rounded-xl" />
                  </Form.Item>
                  <Form.Item
                    name="phone" label="Số điện thoại"
                    rules={[{ required: true, message: "Vui lòng nhập SĐT!" }, { pattern: /^0\d{9}$/, message: "SĐT không hợp lệ!" }]}
                  >
                    <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="0901234567" size="large" className="!rounded-xl" />
                  </Form.Item>
                </div>

                <Form.Item
                  name="email" label="Email"
                  rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: "email", message: "Email không hợp lệ!" }]}
                >
                  <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="email@example.com" size="large" className="!rounded-xl" />
                </Form.Item>

                <Form.Item
                  name="address" label="Địa chỉ giao hàng"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                >
                  <Input.TextArea rows={3} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" className="!rounded-xl" />
                </Form.Item>

                <Form.Item name="note" label="Ghi chú">
                  <Input.TextArea rows={2} placeholder="VD: Giao giờ hành chính, gọi trước khi giao..." className="!rounded-xl" />
                </Form.Item>
              </Card>
            </div>

            {/* Step 2: Payment method */}
            <div style={{ display: currentStep === 1 ? "block" : "none" }}>
              <Card className="!rounded-2xl !shadow-sm !border-gray-100">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                  <CreditCardOutlined className="text-accent" /> Phương thức thanh toán
                </h3>

                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full"
                >
                  <div className="space-y-3">
                    {(Object.entries(paymentMethodConfig) as [PaymentMethod, { label: string; icon: string }][]).map(
                      ([key, config]) => (
                        <div
                          key={key}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentMethod === key
                              ? "border-accent bg-accent/5 shadow-sm"
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                          onClick={() => setPaymentMethod(key)}
                        >
                          <Radio value={key} className="w-full">
                            <div className="flex items-center gap-3 ml-2">
                              <span className="text-2xl">{config.icon}</span>
                              <div>
                                <p className="font-semibold text-primary m-0">{config.label}</p>
                                {key === "cod" && (
                                  <p className="text-xs text-gray-400 m-0 mt-1">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                )}
                                {key === "bank_transfer" && (
                                  <p className="text-xs text-gray-400 m-0 mt-1">Chuyển khoản qua tài khoản ngân hàng</p>
                                )}
                                {key === "credit_card" && (
                                  <p className="text-xs text-gray-400 m-0 mt-1">Visa, Mastercard, JCB</p>
                                )}
                                {key === "momo" && (
                                  <p className="text-xs text-gray-400 m-0 mt-1">Thanh toán qua ví điện tử MoMo</p>
                                )}
                              </div>
                            </div>
                          </Radio>
                        </div>
                      )
                    )}
                  </div>
                </Radio.Group>
              </Card>
            </div>

            {/* Step 3: Review */}
            <div style={{ display: currentStep === 2 ? "block" : "none" }}>
              <Card className="!rounded-2xl !shadow-sm !border-gray-100">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                  <FileTextOutlined className="text-accent" /> Xác nhận đơn hàng
                </h3>

                {/* Customer info summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-sm text-gray-600 mb-3">THÔNG TIN GIAO HÀNG</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="m-0"><span className="text-gray-400">Họ tên:</span> <strong>{form.getFieldValue("name")}</strong></p>
                    <p className="m-0"><span className="text-gray-400">SĐT:</span> <strong>{form.getFieldValue("phone")}</strong></p>
                    <p className="m-0"><span className="text-gray-400">Email:</span> <strong>{form.getFieldValue("email")}</strong></p>
                    <p className="m-0">
                      <span className="text-gray-400">Thanh toán:</span>{" "}
                      <strong>{paymentMethodConfig[paymentMethod].icon} {paymentMethodConfig[paymentMethod].label}</strong>
                    </p>
                  </div>
                  <p className="m-0 mt-2 text-sm"><span className="text-gray-400">Địa chỉ:</span> <strong>{form.getFieldValue("address")}</strong></p>
                </div>

                {/* Items summary */}
                <h4 className="font-semibold text-sm text-gray-600 mb-3">SẢN PHẨM ({items.length})</h4>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-contain rounded-lg bg-white" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-primary m-0">{item.product.name}</p>
                        <p className="text-xs text-gray-400 m-0">{item.product.brand} · x{item.quantity}</p>
                      </div>
                      <span className="font-bold text-accent text-sm">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Form>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <Button
              size="large"
              onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate("/cart")}
              className="!rounded-full !h-12 !px-8"
            >
              {currentStep === 0 ? "← Giỏ hàng" : "← Quay lại"}
            </Button>

            {currentStep < 2 ? (
              <Button type="primary" size="large" onClick={nextStep}
                className="!rounded-full !h-12 !px-8 !bg-gradient-to-r !from-accent !to-accent-dark !border-none"
              >
                Tiếp tục →
              </Button>
            ) : (
              <Button
                type="primary" size="large" loading={isSubmitting} onClick={handleSubmitOrder}
                className="!rounded-full !h-12 !px-10 !bg-gradient-to-r !from-green-500 !to-green-600 !border-none !font-bold !text-base"
              >
                🛒 Đặt hàng · {formatPrice(grandTotal)}
              </Button>
            )}
          </div>
        </div>

        {/* Order summary sidebar */}
        <div>
          <Card className="!rounded-2xl !shadow-sm !border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-primary mb-4">Tóm tắt đơn hàng</h3>

            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 py-2">
                  <img src={item.product.image} alt="" className="w-10 h-10 object-contain rounded-lg bg-gray-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary m-0 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400 m-0">x{item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-accent whitespace-nowrap">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Divider className="!my-3" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vận chuyển</span>
                <span className={`font-medium ${shippingFee === 0 ? "text-green-500" : ""}`}>
                  {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                </span>
              </div>
            </div>

            <Divider className="!my-3" />

            <div className="flex justify-between">
              <span className="text-lg font-bold text-primary">Tổng cộng</span>
              <span className="text-xl font-bold text-accent">{formatPrice(grandTotal)}</span>
            </div>

            {!isLoggedIn && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-700 m-0">
                  💡 <Link to="/login" className="text-accent font-semibold">Đăng nhập</Link> để theo dõi đơn hàng dễ dàng hơn
                </p>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-4 m-0">🔒 Thanh toán an toàn & bảo mật</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
