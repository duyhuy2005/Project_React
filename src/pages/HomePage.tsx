import React from "react";
import { Button, Row, Col, Tag } from "antd";
import {
  RightOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
  CustomerServiceOutlined,
  GiftOutlined,
  ArrowRightOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/productStore";
import ProductCard from "../components/product/ProductCard";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const featuredProducts = products.filter((p) => p.isBestSeller || p.isNew).slice(0, 8);
  const newProducts = products.filter((p) => p.isNew).slice(0, 8);

  const getCategoryCount = (cat: string) => products.filter(p => p.category === cat).length;

  const categoryData = [
    { title: "Cao cấp", emoji: "💎", gradient: "from-[#2c1810] via-[#4a2c1a] to-[#6b3a1a]", cat: "luxury" },
    { title: "Thể thao", emoji: "⚡", gradient: "from-[#0a1628] via-[#132d5e] to-[#1a3a7a]", cat: "sport" },
    { title: "Cổ điển", emoji: "🎩", gradient: "from-[#1a1a2e] via-[#2d2d44] to-[#3a3a55]", cat: "classic" },
    { title: "Casual", emoji: "😎", gradient: "from-[#0a2618] via-[#1a4a30] to-[#2a6a45]", cat: "casual" },
  ];

  return (
    <div className="w-full overflow-hidden homepage-content" style={{ background: '#faf9f6' }}>
      {/* ===== HERO BANNER ===== */}
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#2d2d44] to-[#1a1a2e] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#c9a96e] rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#d4af37] rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 max-w-[1600px] relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center py-16 md:py-24">
            <div className="text-white space-y-6 animate-fadeInUp">
              <div className="inline-block">
                <Tag
                  icon={<CrownOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #c9a96e, #d4af37)',
                    border: 'none',
                    color: '#1a1a2e',
                    fontSize: 14,
                    fontWeight: 700,
                    padding: '8px 20px',
                    borderRadius: 30,
                  }}
                >
                  LUXURY COLLECTION 2024
                </Tag>
              </div>
              
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: 24,
              }}>
                Đẳng Cấp Thời Gian
                <br />
                <span className="text-gradient-gold">Phong Cách Vượt Thời Đại</span>
              </h1>
              
              <p style={{
                fontSize: 18,
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.85)',
                maxWidth: 540,
              }}>
                Khám phá bộ sưu tập đồng hồ cao cấp được tuyển chọn kỹ lưỡng, 
                nơi nghệ thuật chế tác gặp gỡ công nghệ tiên tiến.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate("/products")}
                  icon={<ArrowRightOutlined />}
                  style={{
                    height: 56,
                    padding: '0 40px',
                    fontSize: 16,
                    fontWeight: 700,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #c9a96e, #d4af37)',
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(201, 169, 110, 0.4)',
                  }}
                  className="btn-premium"
                >
                  Khám Phá Ngay
                </Button>
                
                <Button
                  size="large"
                  onClick={() => navigate("/products?cat=luxury")}
                  style={{
                    height: 56,
                    padding: '0 40px',
                    fontSize: 16,
                    fontWeight: 700,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    color: 'white',
                  }}
                  className="glass"
                >
                  Bộ Sưu Tập Cao Cấp
                </Button>
              </div>
            </div>

            <div className="relative animate-scaleIn" style={{ animationDelay: '0.3s' }}>
              <div className="watch-hero-glow">
                <img
                  src={products[0]?.image || "/images/watch1.png"}
                  alt="Featured Watch"
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 20px 60px rgba(201, 169, 110, 0.4))',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY CARDS ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 max-w-[1600px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
              Danh Mục Sản Phẩm
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tìm kiếm phong cách hoàn hảo cho mọi dịp
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {categoryData.map((cat, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <div
                  className={`category-card bg-gradient-to-br ${cat.gradient} p-8 text-white text-center h-64 flex flex-col items-center justify-center`}
                  onClick={() => navigate(`/products?cat=${cat.cat}`)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-6xl mb-4">{cat.emoji}</div>
                  <h3 className="text-2xl font-bold mb-2">{cat.title}</h3>
                  <p className="text-sm opacity-90">{getCategoryCount(cat.cat)} sản phẩm</p>
                  <RightOutlined className="mt-4 text-xl" />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16" style={{ background: '#faf9f6' }}>
        <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 max-w-[1600px]">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-2">
                Sản Phẩm Nổi Bật
              </h2>
              <p className="text-gray-600">Những mẫu đồng hồ được yêu thích nhất</p>
            </div>
            <Button
              type="text"
              onClick={() => navigate("/products")}
              icon={<RightOutlined />}
              style={{
                color: '#c9a96e',
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Xem tất cả
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {featuredProducts.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 max-w-[1600px]">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-2">
                Hàng Mới Về
              </h2>
              <p className="text-gray-600">Cập nhật xu hướng mới nhất</p>
            </div>
            <Button
              type="text"
              onClick={() => navigate("/products")}
              icon={<RightOutlined />}
              style={{
                color: '#c9a96e',
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Xem tất cả
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {newProducts.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ===== USP SECTION ===== */}
      <section className="py-16 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44]">
        <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 max-w-[1600px]">
          <Row gutter={[32, 32]}>
            {[
              {
                icon: <SafetyCertificateOutlined style={{ fontSize: 48, color: '#c9a96e' }} />,
                title: "Chính Hãng 100%",
                desc: "Cam kết sản phẩm chính hãng, có nguồn gốc rõ ràng",
              },
              {
                icon: <TruckOutlined style={{ fontSize: 48, color: '#c9a96e' }} />,
                title: "Miễn Phí Vận Chuyển",
                desc: "Giao hàng toàn quốc, miễn phí cho đơn trên 2 triệu",
              },
              {
                icon: <CustomerServiceOutlined style={{ fontSize: 48, color: '#c9a96e' }} />,
                title: "Hỗ Trợ 24/7",
                desc: "Đội ngũ tư vấn chuyên nghiệp, nhiệt tình",
              },
              {
                icon: <GiftOutlined style={{ fontSize: 48, color: '#c9a96e' }} />,
                title: "Quà Tặng Hấp Dẫn",
                desc: "Ưu đãi đặc biệt cho khách hàng thân thiết",
              },
            ].map((item, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <div className="usp-item text-center p-6 rounded-2xl">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
