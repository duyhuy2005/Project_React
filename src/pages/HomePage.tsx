import React from "react";
import { Button, Row, Col, Tag, Carousel } from "antd";
import {
  RightOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
  CustomerServiceOutlined,
  GiftOutlined,
  ArrowRightOutlined,
  StarFilled,
  CrownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/product/ProductCard";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const featuredProducts = products.filter((p) => p.isBestSeller || p.isNew).slice(0, 4);
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* ===== HERO BANNER ===== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-dark">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f1125] to-[#0a0a1a]" />
          {/* Decorative orbs */}
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-accent/[0.06] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-accent/[0.04] rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
          {/* Decorative circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/[0.03] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-accent/[0.05] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/[0.02] rounded-full" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(201,169,110,0.3) 50px, rgba(201,169,110,0.3) 51px),
                              repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(201,169,110,0.3) 50px, rgba(201,169,110,0.3) 51px)`
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
          {/* Left content */}
          <div className="animate-slideInLeft">
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-8">
              <StarFilled className="text-accent text-sm animate-pulse" />
              <span className="text-accent text-sm font-medium tracking-wider">
                Bộ sưu tập 2026
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Thời gian là
              <br />
              <span className="text-gradient-gold">
                Nghệ thuật
              </span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
              Khám phá bộ sưu tập đồng hồ cao cấp từ các thương hiệu danh
              tiếng. Mỗi chiếc đồng hồ là một câu chuyện về sự tinh xảo và
              đẳng cấp vượt thời gian.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/products")}
                className="btn-premium !h-16 !px-12 !rounded-full !text-base !font-bold !bg-gradient-to-r !from-accent !to-accent-dark !border-none !shadow-[0_8px_30px_rgba(201,169,110,0.4)]"
              >
                Khám phá ngay
                <RightOutlined className="ml-2" />
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/about")}
                className="glass !h-16 !px-10 !rounded-full !text-base !font-semibold !text-white hover:!text-accent !border-white/20 hover:!border-accent/50 !bg-transparent transition-all"
              >
                <CrownOutlined className="mr-2" />
                Giới thiệu
              </Button>
            </div>

            {/* Mini stats */}
            <div className="flex gap-8 mt-12">
              {[
                { num: "50+", label: "Thương hiệu" },
                { num: "10K+", label: "Khách hàng" },
                { num: "100%", label: "Chính hãng" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-gradient-gold m-0 font-display">{s.num}</p>
                  <p className="text-gray-500 text-xs mt-1 m-0 tracking-wider uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Watch showcase */}
          <div className="relative flex items-center justify-center animate-slideInRight">
            {/* Glow ring behind watch */}
            <div className="absolute w-[380px] h-[380px] rounded-full bg-gradient-to-br from-accent/20 via-accent/5 to-transparent blur-xl animate-pulse" />
            <div className="absolute w-[320px] h-[320px] rounded-full border border-accent/10" />
            <div className="absolute w-[360px] h-[360px] rounded-full border border-accent/5" />

            <Carousel autoplay effect="fade" dots={false} autoplaySpeed={4000} className="w-full max-w-md">
              {products.slice(0, 3).map((p) => (
                <div key={p.id}>
                  <div className="flex items-center justify-center p-8 watch-hero-glow">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-80 h-80 object-contain drop-shadow-[0_20px_60px_rgba(201,169,110,0.3)] animate-float"
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-gray-500 text-xs tracking-widest uppercase">Cuộn xuống</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-accent/50 to-transparent" />
        </div>
      </section>

      {/* ===== USP BAR ===== */}
      <section className="relative bg-white border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <TruckOutlined className="text-xl text-accent" />, title: "Miễn phí vận chuyển", desc: "Đơn hàng từ 5 triệu" },
            { icon: <SafetyCertificateOutlined className="text-xl text-accent" />, title: "Chính hãng 100%", desc: "Cam kết bảo đảm" },
            { icon: <CustomerServiceOutlined className="text-xl text-accent" />, title: "Hỗ trợ 24/7", desc: "Tư vấn chuyên nghiệp" },
            { icon: <GiftOutlined className="text-xl text-accent" />, title: "Quà tặng VIP", desc: "Đơn hàng trên 10 triệu" },
          ].map((item, idx) => (
            <div key={idx} className="usp-item flex items-center gap-3 p-4 rounded-2xl cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center flex-shrink-0 shadow-sm">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-primary text-sm m-0">{item.title}</p>
                <p className="text-gray-400 text-xs m-0 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="section-divider max-w-xs mx-auto mb-4">
            <span className="text-accent text-sm font-semibold tracking-[0.25em] uppercase">
              Danh mục
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold text-primary mt-3">
            Khám phá theo phong cách
          </h2>
        </div>
        <Row gutter={[20, 20]}>
          {[
            { title: "Cao cấp", emoji: "💎", gradient: "from-[#2c1810] via-[#4a2c1a] to-[#6b3a1a]", count: 4, cat: "luxury" },
            { title: "Thể thao", emoji: "⚡", gradient: "from-[#0a1628] via-[#132d5e] to-[#1a3a7a]", count: 2, cat: "sport" },
            { title: "Cổ điển", emoji: "🎩", gradient: "from-[#1a1a2e] via-[#2d2d44] to-[#3a3a55]", count: 1, cat: "classic" },
            { title: "Casual", emoji: "😎", gradient: "from-[#0a2618] via-[#1a4a30] to-[#2a6a45]", count: 2, cat: "casual" },
          ].map((cat, i) => (
            <Col key={cat.cat} xs={12} md={6}>
              <div
                onClick={() => navigate(`/products?cat=${cat.cat}`)}
                className={`category-card bg-gradient-to-br ${cat.gradient} p-8 md:p-10 min-h-[180px] flex flex-col justify-end`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative z-10">
                  <span className="text-5xl block mb-4 drop-shadow-lg">{cat.emoji}</span>
                  <h3 className="text-white font-bold text-xl m-0 font-display">{cat.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-white/40 text-xs m-0">{cat.count} sản phẩm</p>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                      <ArrowRightOutlined className="text-white/60 text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="relative py-20">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/80 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-divider max-w-xs mb-4">
                <span className="text-accent text-sm font-semibold tracking-[0.25em] uppercase">
                  Bán chạy
                </span>
              </div>
              <h2 className="font-display text-4xl font-bold text-primary mt-3">
                Sản phẩm nổi bật
              </h2>
            </div>
            <Button
              type="link"
              onClick={() => navigate("/products")}
              className="!text-accent !font-semibold !text-base hover:!text-accent-dark group"
            >
              Xem tất cả
              <RightOutlined className="ml-1 group-hover:ml-3 transition-all" />
            </Button>
          </div>
          <Row gutter={[24, 24]}>
            {featuredProducts.map((product, i) => (
              <Col key={product.id} xs={12} sm={12} md={8} lg={6}>
                <div className="animate-fadeInUp" style={{ animationDelay: `${i * 0.15}s` }}>
                  <ProductCard product={product} />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ===== LARGE SHOWCASE BANNER ===== */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="relative rounded-[32px] overflow-hidden min-h-[400px]">
          {/* Dark luxury background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a] via-[#12122e] to-[#0a0a1a]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,169,110,0.5) 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }} />
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-accent/[0.08] to-transparent" />

          <div className="relative z-10 grid md:grid-cols-2 items-center p-10 md:p-16 gap-8">
            <div>
              <Tag className="!bg-red-500/20 !border-red-500/30 !text-red-400 !rounded-full !px-4 !py-1 !text-sm !font-medium mb-6 inline-block">
                🔥 Ưu đãi có hạn
              </Tag>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Giảm đến
                <br />
                <span className="text-gradient-gold text-6xl md:text-7xl">30%</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-md text-base leading-relaxed">
                Cơ hội sở hữu đồng hồ cao cấp với giá ưu đãi chưa từng có.
                Chương trình áp dụng đến hết tháng này!
              </p>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/products")}
                className="btn-premium !h-14 !px-10 !rounded-full !font-bold !bg-gradient-to-r !from-accent !to-accent-dark !border-none !shadow-[0_8px_30px_rgba(201,169,110,0.3)]"
              >
                Mua ngay <RightOutlined className="ml-2" />
              </Button>
            </div>
            <div className="hidden md:flex justify-center items-center">
              <div className="relative">
                <div className="absolute inset-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
                <img
                  src="/images/watch1.png"
                  alt="Sale"
                  className="w-72 h-72 object-contain drop-shadow-[0_20px_50px_rgba(201,169,110,0.3)] animate-float relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="section-divider max-w-xs mb-4">
              <span className="text-accent text-sm font-semibold tracking-[0.25em] uppercase">
                Hàng mới
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold text-primary mt-3">
              Mới nhất 2026
            </h2>
          </div>
          <Button
            type="link"
            onClick={() => navigate("/products")}
            className="!text-accent !font-semibold !text-base hover:!text-accent-dark group"
          >
            Xem tất cả
            <RightOutlined className="ml-1 group-hover:ml-3 transition-all" />
          </Button>
        </div>
        <Row gutter={[24, 24]}>
          {newProducts.map((product, i) => (
            <Col key={product.id} xs={12} sm={12} md={8} lg={6}>
              <div className="animate-fadeInUp" style={{ animationDelay: `${i * 0.15}s` }}>
                <ProductCard product={product} />
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* ===== TESTIMONIAL / TRUST ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="section-divider max-w-xs mx-auto mb-4">
            <span className="text-accent text-sm font-semibold tracking-[0.25em] uppercase">
              Đánh giá
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold text-primary mt-3 mb-12">
            Khách hàng nói gì
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Minh Tuấn", role: "Doanh nhân", text: "Dịch vụ chuyên nghiệp, sản phẩm chính hãng. Tôi rất hài lòng với chiếc Royal Oak.", stars: 5 },
              { name: "Thu Hà", role: "Designer", text: "Đồng hồ đẹp xuất sắc, đóng gói cẩn thận. Đội ngũ tư vấn rất nhiệt tình và am hiểu.", stars: 5 },
              { name: "Đức Anh", role: "Kỹ sư", text: "Giá cả hợp lý cho hàng chính hãng. Bảo hành tốt, sẽ quay lại mua tiếp!", stars: 5 },
            ].map((review, i) => (
              <div key={i} className="premium-card p-6 text-left">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: review.stars }).map((_, j) => (
                    <StarFilled key={j} className="text-accent text-sm" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-primary text-sm m-0">{review.name}</p>
                    <p className="text-gray-400 text-xs m-0">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
