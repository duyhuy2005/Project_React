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
  ShareAltOutlined,
} from "@ant-design/icons";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../data/products";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";
import ProductCard from "../components/product/ProductCard";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="text-center py-32">
        <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-6xl">😔</span>
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          Không tìm thấy sản phẩm
        </h2>
        <p className="text-gray-400 mb-6">Sản phẩm bạn tìm không tồn tại hoặc đã bị xóa</p>
        <Button type="primary" onClick={() => navigate("/products")} className="!rounded-full !h-12 !px-8 !bg-gradient-to-r !from-accent !to-accent-dark !border-none">
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

  const specLabels: Record<string, string> = {
    movement: "Bộ máy",
    caseMaterial: "Chất liệu vỏ",
    caseSize: "Kích thước",
    waterResistance: "Chống nước",
    crystal: "Kính",
    strap: "Dây đeo",
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #f8f7f4 0%, #faf9f6 100%)" }}>
      {/* Breadcrumb bar */}
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
              {
                title: <Link to="/products">Sản phẩm</Link>,
              },
              { title: product.name },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* ===== MAIN SECTION ===== */}
        <div className="premium-card overflow-hidden mb-12">
          <Row>
            {/* Image */}
            <Col xs={24} md={12}>
              <div className="relative p-8 md:p-12 flex items-center justify-center min-h-[400px] md:min-h-[550px]"
                style={{ background: "linear-gradient(135deg, #f8f7f4 0%, #f0ede6 50%, #e8e4db 100%)" }}
              >
                {/* Subtle glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent/[0.08] rounded-full blur-[80px]" />
                
                {/* Tags */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                  {discount > 0 && (
                    <Tag className="!rounded-full !text-sm !px-4 !py-1 !bg-red-500 !text-white !border-none !font-bold !shadow-lg">
                      -{discount}%
                    </Tag>
                  )}
                  {product.isNew && (
                    <Tag className="!rounded-full !text-sm !px-4 !py-1 !bg-blue-500 !text-white !border-none !font-bold !shadow-lg">
                      MỚI
                    </Tag>
                  )}
                  {product.isBestSeller && (
                    <Tag className="!rounded-full !text-sm !px-4 !py-1 !bg-gradient-to-r !from-accent !to-accent-dark !text-white !border-none !font-bold !shadow-lg">
                      BÁN CHẠY
                    </Tag>
                  )}
                </div>

                {/* Share button */}
                <Button
                  type="text"
                  icon={<ShareAltOutlined />}
                  className="!absolute !top-6 !right-6 !w-10 !h-10 !rounded-full !bg-white/80 !backdrop-blur-sm !shadow-sm hover:!bg-white z-10"
                />

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-w-sm h-auto object-contain drop-shadow-2xl relative z-[1] hover:scale-105 transition-transform duration-700"
                />
              </div>
            </Col>

            {/* Info */}
            <Col xs={24} md={12}>
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-3">
                  <Tag className="!bg-accent/10 !text-accent !border-accent/20 !rounded-full !text-xs !font-bold !tracking-wider !uppercase !m-0">
                    {product.brand}
                  </Tag>
                  <span className="text-xs text-gray-400">ID: #{product.id}</span>
                </div>
                
                <h1 className="font-display text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-3 mb-6">
                  <Rate disabled defaultValue={product.rating} allowHalf className="!text-accent !text-sm" />
                  <span className="text-gray-400 text-sm">
                    {product.rating} · {product.reviews} đánh giá
                  </span>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-accent/5 to-transparent rounded-2xl p-5 mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl md:text-4xl font-bold text-gradient-gold font-display">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="text-red-500 text-sm font-bold bg-red-50 px-2 py-0.5 rounded-full">
                          Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-500 leading-relaxed mb-6 text-[15px]">
                  {product.description}
                </p>

                <Divider className="!my-6" />

                {/* Qty & Actions */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-600">Số lượng:</span>
                    <InputNumber
                      min={1}
                      max={10}
                      value={quantity}
                      onChange={(v) => setQuantity(v || 1)}
                      size="large"
                      className="!w-28 !rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    className="btn-premium !h-14 !px-10 !rounded-full !font-bold !text-base !bg-gradient-to-r !from-accent !to-accent-dark !border-none !shadow-[0_8px_30px_rgba(201,169,110,0.4)] flex-1 md:flex-none"
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button
                    size="large"
                    icon={<HeartOutlined />}
                    className="!h-14 !w-14 !rounded-full !border-gray-200 hover:!border-red-300 hover:!text-red-500 !transition-all"
                  />
                </div>

                {/* Perks */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <TruckOutlined className="text-accent text-lg" />, text: "Giao hàng miễn phí", sub: "Đơn từ 5 triệu" },
                    { icon: <SafetyCertificateOutlined className="text-accent text-lg" />, text: "Bảo hành 2 năm", sub: "Chính hãng" },
                    { icon: <SwapOutlined className="text-accent text-lg" />, text: "Đổi trả 30 ngày", sub: "Miễn phí" },
                  ].map((perk, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center text-center gap-1.5 p-3 bg-gray-50/80 rounded-2xl hover:bg-accent/5 transition-colors"
                    >
                      {perk.icon}
                      <span className="text-xs font-semibold text-primary leading-tight">{perk.text}</span>
                      <span className="text-[10px] text-gray-400">{perk.sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* ===== TABS ===== */}
        <div className="premium-card p-6 md:p-8 mb-12">
          <Tabs
            defaultActiveKey="specs"
            className="[&_.ant-tabs-tab]:!text-base [&_.ant-tabs-tab-active]:!font-bold"
            items={[
              {
                key: "specs",
                label: "Thông số kỹ thuật",
                children: (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
                    {Object.entries(product.specs).map(([key, value], i) => (
                      <div
                        key={key}
                        className={`flex justify-between items-center py-3.5 px-5 rounded-xl transition-colors ${
                          i % 2 === 0 ? "bg-gray-50" : "bg-accent/[0.03]"
                        }`}
                      >
                        <span className="text-gray-500 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                          {specLabels[key] || key}
                        </span>
                        <span className="font-semibold text-primary text-sm">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: "description",
                label: "Mô tả chi tiết",
                children: (
                  <div className="max-w-3xl space-y-4">
                    <p className="text-gray-600 leading-relaxed text-[15px]">
                      {product.description}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-[15px]">
                      Sản phẩm được nhập khẩu chính hãng từ nhà sản xuất, đi kèm
                      đầy đủ hộp, giấy tờ và phiếu bảo hành quốc tế. Đội ngũ
                      CHRONOS cam kết mang đến cho khách hàng trải nghiệm mua sắm
                      tuyệt vời nhất với dịch vụ tư vấn chuyên nghiệp và chế độ
                      hậu mãi chu đáo.
                    </p>
                    <div className="bg-accent/5 rounded-2xl p-5 border border-accent/10">
                      <h4 className="font-semibold text-primary mb-2 text-sm">📦 Bao gồm trong hộp</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-none p-0 m-0">
                        <li>✓ Đồng hồ chính hãng {product.brand}</li>
                        <li>✓ Hộp và túi thương hiệu</li>
                        <li>✓ Sổ bảo hành quốc tế</li>
                        <li>✓ Hướng dẫn sử dụng</li>
                      </ul>
                    </div>
                  </div>
                ),
              },
              {
                key: "reviews",
                label: `Đánh giá (${product.reviews})`,
                children: (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">⭐</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gradient-gold mb-1 font-display">
                      {product.rating}/5
                    </h3>
                    <p className="text-gray-400">{product.reviews} đánh giá từ khách hàng</p>
                    <Rate disabled defaultValue={product.rating} allowHalf className="!text-accent !text-xl mt-3" />
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* ===== RELATED ===== */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="section-divider max-w-xs mb-3">
                  <span className="text-accent text-sm font-semibold tracking-[0.2em] uppercase">Gợi ý</span>
                </div>
                <h2 className="font-display text-3xl font-bold text-primary">
                  Sản phẩm liên quan
                </h2>
              </div>
            </div>
            <Row gutter={[20, 20]}>
              {relatedProducts.map((p, i) => (
                <Col key={p.id} xs={12} sm={12} md={8} lg={6}>
                  <div className="animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                    <ProductCard product={p} />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
