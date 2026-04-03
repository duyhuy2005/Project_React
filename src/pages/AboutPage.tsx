import React from "react";
import { Row, Col, Button, Breadcrumb } from "antd";
import {
  HomeOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  TeamOutlined,
  RightOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ 
        background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d44 25%, #3a3a55 50%, #2d2d44 75%, #1a1a2e 100%)",
        minHeight: '600px',
      }}>
        <div className="absolute inset-0">
          {/* Animated orbs */}
          <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] rounded-full blur-[140px] animate-float" style={{
            background: 'radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)',
          }} />
          <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite reverse',
          }} />
          
          {/* Concentric circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/[0.02] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-accent/[0.08] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/[0.03] rounded-full" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(201,169,110,0.5) 1px, transparent 1px),
              linear-gradient(0deg, rgba(201,169,110,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
          
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-accent/30 rounded-full animate-float" 
              style={{ 
                top: `${15 + i * 10}%`,
                left: `${10 + i * 10}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${10 + i * 2}s`,
              }} 
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-10">
          <Breadcrumb
            className="mb-10"
            items={[
              {
                title: (
                  <Link to="/" className="!text-gray-300 hover:!text-accent transition-colors flex items-center gap-2">
                    <HomeOutlined /> Trang chủ
                  </Link>
                ),
              },
              { title: <span className="text-accent font-bold">Giới thiệu</span> },
            ]}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
          <div className="inline-flex items-center gap-3 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-10 shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}>
            <StarFilled className="text-accent text-base animate-pulse" />
            <span className="text-white text-sm font-bold tracking-widest uppercase">Từ 2018 đến nay</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-8 leading-tight" style={{
            textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 0 60px rgba(201,169,110,0.3)',
          }}>
            Câu chuyện của
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #e0c891 0%, #c9a96e 50%, #d4af37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(201,169,110,0.5))',
            }}>CHRONOS</span>
          </h1>
          <p className="text-gray-200 text-xl leading-relaxed max-w-3xl mx-auto font-medium">
            Được thành lập từ năm 2018, CHRONOS đã trở thành địa chỉ tin cậy
            hàng đầu Việt Nam cho những người yêu thích đồng hồ cao cấp. Chúng
            tôi mang đến sự kết hợp hoàn hảo giữa nghệ thuật chế tác truyền
            thống và phong cách hiện đại.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <Row gutter={[24, 24]}>
          {[
            { number: "10K+", label: "Khách hàng tin tưởng", icon: <TeamOutlined />, gradient: "from-blue-500 to-blue-600", bg: "from-blue-500/15 to-blue-500/5" },
            { number: "50+", label: "Thương hiệu đối tác", icon: <GlobalOutlined />, gradient: "from-accent to-accent-dark", bg: "from-accent/15 to-accent/5" },
            { number: "100%", label: "Chính hãng", icon: <SafetyCertificateOutlined />, gradient: "from-green-500 to-green-600", bg: "from-green-500/15 to-green-500/5" },
            { number: "#1", label: "Uy tín hàng đầu", icon: <TrophyOutlined />, gradient: "from-amber-500 to-amber-600", bg: "from-amber-500/15 to-amber-500/5" },
          ].map((stat, i) => (
            <Col key={i} xs={12} md={6}>
              <div className="premium-card p-8 text-center group hover:shadow-2xl transition-all duration-300" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                border: '2px solid rgba(0,0,0,0.06)',
              }}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.bg} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className={`text-3xl bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-4xl font-black mb-2 font-display" style={{
                  background: `linear-gradient(135deg, ${stat.gradient.includes('blue') ? '#3b82f6' : stat.gradient.includes('green') ? '#10b981' : stat.gradient.includes('amber') ? '#f59e0b' : '#c9a96e'}, ${stat.gradient.includes('blue') ? '#2563eb' : stat.gradient.includes('green') ? '#059669' : stat.gradient.includes('amber') ? '#d97706' : '#a88a4e'})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {stat.number}
                </h3>
                <p className="text-gray-600 text-sm font-semibold m-0 uppercase tracking-wider">{stat.label}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="section-divider max-w-xs mx-auto mb-4">
            <span className="text-accent text-sm font-semibold tracking-[0.25em] uppercase">
              Giá trị cốt lõi
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold text-primary mt-3">
            Tại sao chọn CHRONOS?
          </h2>
        </div>
        <Row gutter={[20, 20]}>
          {[
            {
              title: "Cam kết chính hãng",
              desc: "Mọi sản phẩm đều được nhập khẩu trực tiếp từ nhà sản xuất, đi kèm đầy đủ giấy tờ và phiếu bảo hành quốc tế.",
              emoji: "🛡️",
              gradient: "from-blue-500/10 to-blue-500/5",
            },
            {
              title: "Tư vấn chuyên nghiệp",
              desc: "Đội ngũ chuyên viên am hiểu sâu về đồng hồ, sẵn sàng tư vấn giúp bạn tìm được chiếc đồng hồ phù hợp nhất.",
              emoji: "💎",
              gradient: "from-accent/10 to-accent/5",
            },
            {
              title: "Bảo hành toàn diện",
              desc: "Chế độ bảo hành lên đến 5 năm cùng dịch vụ chăm sóc sau bán hàng tận tâm, hỗ trợ kỹ thuật trọn đời.",
              emoji: "🔧",
              gradient: "from-green-500/10 to-green-500/5",
            },
            {
              title: "Giao hàng an toàn",
              desc: "Đóng gói cẩn thận, bảo hiểm 100% giá trị. Giao hàng toàn quốc trong 1-3 ngày, miễn phí cho đơn từ 5 triệu.",
              emoji: "📦",
              gradient: "from-amber-500/10 to-amber-500/5",
            },
          ].map((value, i) => (
            <Col key={i} xs={24} md={12} lg={6}>
              <div className="premium-card p-7 h-full group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{value.emoji}</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed m-0">
                  {value.desc}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded-[32px]" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #12122e 50%, #0a0a1a 100%)" }}>
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/5 rounded-full blur-[80px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,169,110,0.5) 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }} />
          </div>
          <div className="relative z-10 p-12 md:p-20 text-center">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Sẵn sàng <span className="text-gradient-gold">khám phá</span>?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
              Hãy bắt đầu hành trình tìm kiếm chiếc đồng hồ hoàn hảo cho bạn
            </p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/products")}
              className="btn-premium !h-16 !px-12 !rounded-full !font-bold !text-base !bg-gradient-to-r !from-accent !to-accent-dark !border-none !shadow-[0_8px_30px_rgba(201,169,110,0.4)]"
            >
              Khám phá bộ sưu tập <RightOutlined className="ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
