import React from "react";
import {
  Table,
  Button,
  InputNumber,
  Empty,
  Breadcrumb,
  Divider,
  Card,
} from "antd";
import {
  DeleteOutlined,
  HomeOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import type { CartItem } from "../context/CartContext";

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Giỏ hàng trống
              </h2>
              <p className="text-gray-400">
                Hãy thêm sản phẩm yêu thích vào giỏ hàng
              </p>
            </div>
          }
        >
          <Button
            type="primary"
            size="large"
            icon={<ShoppingOutlined />}
            onClick={() => navigate("/products")}
            className="!rounded-full !h-12 !px-8"
          >
            Tiếp tục mua sắm
          </Button>
        </Empty>
      </div>
    );
  }

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_: unknown, record: CartItem) => (
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <img
              src={record.product.image}
              alt={record.product.name}
              className="w-16 h-16 object-contain"
            />
          </div>
          <div>
            <Link
              to={`/product/${record.product.id}`}
              className="font-semibold text-primary hover:text-accent no-underline"
            >
              {record.product.name}
            </Link>
            <p className="text-xs text-gray-400 m-0 mt-1">
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
        <span className="font-semibold text-accent">
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
          className="!w-20"
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_: unknown, record: CartItem) => (
        <span className="font-bold text-primary">
          {formatPrice(record.product.price * record.quantity)}
        </span>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_: unknown, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.product.id)}
        />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <Breadcrumb
        className="mb-6"
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

      <h1 className="text-3xl font-bold text-primary mb-8">
        🛒 Giỏ hàng ({items.length} sản phẩm)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <Table
              dataSource={items}
              columns={columns}
              rowKey={(record) => record.product.id}
              pagination={false}
              className="[&_.ant-table-thead_th]:!bg-gray-50 [&_.ant-table-thead_th]:!font-semibold [&_.ant-table-thead_th]:!text-gray-600"
            />
          </div>
          <div className="flex justify-between mt-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/products")}
              className="!rounded-full"
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
          <Card className="!rounded-2xl !shadow-sm !border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-primary mb-4">
              Tóm tắt đơn hàng
            </h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="font-medium text-green-500">
                  {totalPrice >= 5000000 ? "Miễn phí" : formatPrice(50000)}
                </span>
              </div>
              {totalPrice < 5000000 && (
                <p className="text-xs text-gray-400 bg-amber-50 p-2 rounded-lg">
                  💡 Mua thêm{" "}
                  <strong className="text-accent">
                    {formatPrice(5000000 - totalPrice)}
                  </strong>{" "}
                  để được miễn phí vận chuyển
                </p>
              )}
            </div>
            <Divider className="!my-4" />
            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold text-primary">Tổng cộng</span>
              <span className="text-xl font-bold text-accent">
                {formatPrice(
                  totalPrice + (totalPrice >= 5000000 ? 0 : 50000)
                )}
              </span>
            </div>
            <Button
              type="primary"
              size="large"
              block
              onClick={() => navigate("/checkout")}
              className="!h-14 !rounded-full !font-bold !text-base !bg-gradient-to-r !from-accent !to-accent-dark !border-none"
            >
              Thanh toán
            </Button>
            <p className="text-center text-xs text-gray-400 mt-3">
              🔒 Thanh toán an toàn & bảo mật
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
