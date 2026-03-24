import React, { useState } from "react";
import {
  Row,
  Col,
  Button,
  Rate,
  Tag,
  InputNumber,
  Breadcrumb,
  Tabs,
  Divider,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products, formatPrice } from "../data/products";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/product/ProductCard";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="text-center py-32">
        <p className="text-6xl mb-4">😔</p>
        <h2 className="text-2xl font-bold text-primary">
          Không tìm thấy sản phẩm
        </h2>
        <Button type="primary" onClick={() => navigate("/products")} className="mt-4 !rounded-full">
          Quay lại cửa hàng
        </Button>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    message.success({
      content: `Đã thêm ${quantity} sản phẩm vào giỏ hàng!`,
      icon: <CheckCircleOutlined className="text-green-500" />,
    });
  };

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
          {
            title: <Link to="/products">Sản phẩm</Link>,
          },
          { title: product.name },
        ]}
      />

      {/* ===== MAIN SECTION ===== */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <Row>
          {/* Image */}
          <Col xs={24} md={12}>
            <div className="relative bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 flex items-center justify-center min-h-[400px] md:min-h-[550px]">
              {discount > 0 && (
                <Tag color="red" className="!absolute !top-6 !left-6 !rounded-full !text-sm !px-4 !py-1">
                  -{discount}%
                </Tag>
              )}
              {product.isNew && (
                <Tag color="blue" className="!absolute !top-6 !right-6 !rounded-full !text-sm !px-4 !py-1">
                  MỚI
                </Tag>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-sm h-auto object-contain drop-shadow-xl"
              />
            </div>
          </Col>

          {/* Info */}
          <Col xs={24} md={12}>
            <div className="p-8 md:p-12">
              <Tag className="!bg-accent/10 !text-accent !border-accent/20 !rounded-full !mb-3">
                {product.brand}
              </Tag>
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <Rate disabled defaultValue={product.rating} allowHalf className="!text-accent" />
                <span className="text-gray-400 text-sm">
                  {product.rating} ({product.reviews} đánh giá)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-accent">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-gray-500 leading-relaxed mb-6">
                {product.description}
              </p>

              <Divider />

              {/* Qty & Actions */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Số lượng:</span>
                  <InputNumber
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(v) => setQuantity(v || 1)}
                    size="large"
                    className="!w-24"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  className="!h-14 !px-10 !rounded-full !font-semibold !bg-gradient-to-r !from-accent !to-accent-dark !border-none flex-1 md:flex-none"
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  size="large"
                  icon={<HeartOutlined />}
                  className="!h-14 !w-14 !rounded-full !border-gray-300"
                />
              </div>

              <Divider />

              {/* Perks */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { icon: <TruckOutlined className="text-accent" />, text: "Giao hàng miễn phí" },
                  { icon: <SafetyCertificateOutlined className="text-accent" />, text: "Bảo hành 2 năm" },
                  { icon: <SwapOutlined className="text-accent" />, text: "Đổi trả 30 ngày" },
                ].map((perk, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3"
                  >
                    {perk.icon}
                    <span>{perk.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* ===== TABS ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-12">
        <Tabs
          defaultActiveKey="specs"
          items={[
            {
              key: "specs",
              label: "Thông số kỹ thuật",
              children: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  {Object.entries(product.specs).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      movement: "Bộ máy",
                      caseMaterial: "Chất liệu vỏ",
                      caseSize: "Kích thước",
                      waterResistance: "Chống nước",
                      crystal: "Kính",
                      strap: "Dây đeo",
                    };
                    return (
                      <div
                        key={key}
                        className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-50"
                      >
                        <span className="text-gray-500 text-sm">
                          {labels[key] || key}
                        </span>
                        <span className="font-medium text-primary text-sm">
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ),
            },
            {
              key: "description",
              label: "Mô tả chi tiết",
              children: (
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Sản phẩm được nhập khẩu chính hãng từ nhà sản xuất, đi kèm
                    đầy đủ hộp, giấy tờ và phiếu bảo hành quốc tế. Đội ngũ
                    CHRONOS cam kết mang đến cho khách hàng trải nghiệm mua sắm
                    tuyệt vời nhất với dịch vụ tư vấn chuyên nghiệp và chế độ
                    hậu mãi chu đáo.
                  </p>
                </div>
              ),
            },
            {
              key: "reviews",
              label: `Đánh giá (${product.reviews})`,
              children: (
                <div className="text-center py-12">
                  <p className="text-4xl mb-2">⭐</p>
                  <h3 className="text-xl font-bold text-primary mb-1">
                    {product.rating}/5
                  </h3>
                  <p className="text-gray-400">{product.reviews} đánh giá</p>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* ===== RELATED ===== */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">
            Sản phẩm liên quan
          </h2>
          <Row gutter={[20, 20]}>
            {relatedProducts.map((p) => (
              <Col key={p.id} xs={12} sm={12} md={8} lg={6}>
                <ProductCard product={p} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
