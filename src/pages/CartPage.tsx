import React from "react";
import {
  Table,
  Button,
  InputNumber,
  Breadcrumb,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  HomeOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { formatPrice } from "../data/products";
import type { CartItem } from "../stores/cartStore";

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="w-28 h-28 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingOutlined className="text-5xl text-accent" />
        </div>
        <h2 className="font-display text-3xl font-bold text-primary mb-3">
          Giỏ hàng trống
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Hãy thêm những chiếc đồng hồ yêu thích vào giỏ hàng của bạn
        </p>
        <Button
          type="primary"
          size="large"
          icon={<ShoppingOutlined />}
          onClick={() => navigate("/products")}
          className="btn-premium !rounded-full !h-14 !px-10 !font-bold !bg-gradient-to-r !from-accent !to-accent-dark !border-none !shadow-[0_8px_30px_rgba(201,169,110,0.3)]"
        >
          Khám phá bộ sưu tập
        </Button>
      </div>
    );
  }

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_: unknown, record: CartItem) => (
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-white rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100">
            <img
              src={record.product.image}
              alt={record.product.name}
              className="w-16 h-16 object-contain"
            />
          </div>
          <div>
            <Link
              to={`/product/${record.product.id}`}
              className="font-semibold text-primary hover:text-accent no-underline transition-colors"
            >
              {record.product.name}
            </Link>
            <p className="text-xs text-accent font-bold tracking-wider uppercase m-0 mt-1">
              {record.product.brand}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      key: "price",
      render: (_: unknown, record: CartItem) => (
        <span className="font-semibold text-primary text-sm">
          {formatPrice(record.product.price)}
        </span>
      ),
    },
    {
      title: "Số lượng",
      key: "quantity",
      render: (_: unknown, record: CartItem) => (
        <InputNumber
          min={1}
          max={10}
          value={record.quantity}
          onChange={(val) => updateQuantity(record.product.id, val || 1)}
          size="small"
          className="!w-20 !rounded-lg"
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_: unknown, record: CartItem) => (
        <span className="font-bold text-accent text-base">
          {formatPrice(record.product.price * record.quantity)}
        </span>
      ),
    },
    {
      title: "",
      key: "action",
      width: 50,
      render: (_: unknown, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.product.id)}
          className="!rounded-full hover:!bg-red-50"
        />
      ),
    },
  ];

  const shippingFee = totalPrice >= 5000000 ? 0 : 50000;

  return (
    <div style={{ background: "linear-gradient(180deg, #f8f7f4 0%, #faf9f6 100%)", minHeight: "80vh" }}>
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Breadcrumb
            items={[
              {
                title: (
                  <Link to="/">
                    <HomeOutlined /> Trang chủ
                  </Link>
                ),
              },
              { title: "Giỏ hàng" },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary mb-1">
              Giỏ hàng
            </h1>
            <p className="text-gray-400 text-sm m-0">{items.length} sản phẩm trong giỏ hàng</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table */}
          <div className="lg:col-span-2">
            <div className="premium-card overflow-hidden">
              <Table
                dataSource={items}
                columns={columns}
                rowKey={(record) => record.product.id}
                pagination={false}
                className="[&_.ant-table-thead_th]:!bg-gradient-to-r [&_.ant-table-thead_th]:!from-accent/[0.06] [&_.ant-table-thead_th]:!to-accent/[0.02] [&_.ant-table-thead_th]:!font-semibold [&_.ant-table-thead_th]:!text-primary/70 [&_.ant-table-thead_th]:!text-xs [&_.ant-table-thead_th]:!uppercase [&_.ant-table-thead_th]:!tracking-wider"
              />
            </div>
            <div className="flex justify-between mt-5">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/products")}
                className="!rounded-full !border-gray-200 hover:!border-accent hover:!text-accent"
              >
                Tiếp tục mua
              </Button>
              <Button danger onClick={clearCart} className="!rounded-full">
                Xóa giỏ hàng
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="premium-card p-6 sticky top-24">
              <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-accent" />
                Tóm tắt đơn hàng
              </h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính ({items.length} sản phẩm)</span>
                  <span className="font-medium text-primary">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span className={`font-medium ${shippingFee === 0 ? "text-green-500" : "text-primary"}`}>
                    {shippingFee === 0 ? "Miễn phí ✓" : formatPrice(shippingFee)}
                  </span>
                </div>
                {totalPrice < 5000000 && (
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <p className="text-xs text-amber-700 m-0">
                      💡 Mua thêm{" "}
                      <strong className="text-accent">
                        {formatPrice(5000000 - totalPrice)}
                      </strong>{" "}
                      để được miễn phí vận chuyển
                    </p>
                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-accent-dark rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((totalPrice / 5000000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <Divider className="!my-5" />
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-primary">Tổng cộng</span>
                <span className="text-2xl font-bold text-gradient-gold font-display">
                  {formatPrice(totalPrice + shippingFee)}
                </span>
              </div>
              <Button
                type="primary"
                size="large"
                block
                onClick={() => navigate("/checkout")}
                className="btn-premium !h-14 !rounded-full !font-bold !text-base !bg-gradient-to-r !from-accent !to-accent-dark !border-none !shadow-[0_8px_30px_rgba(201,169,110,0.3)]"
              >
                Tiến hành thanh toán
              </Button>
              <p className="text-center text-xs text-gray-400 mt-4 m-0">
                🔒 Thanh toán an toàn & bảo mật
              </p>

              {/* Trust badges */}
              <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2">
                {[
                  { icon: <TruckOutlined className="text-accent" />, text: "Giao nhanh" },
                  { icon: <SafetyCertificateOutlined className="text-accent" />, text: "Chính hãng" },
                  { icon: <GiftOutlined className="text-accent" />, text: "Quà tặng" },
                ].map((badge, i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg mb-1">{badge.icon}</div>
                    <span className="text-[10px] text-gray-400 font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
