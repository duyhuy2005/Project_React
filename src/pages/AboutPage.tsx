import React from "react";
import { Row, Col, Card, Button, Breadcrumb } from "antd";
import {
  HomeOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  TeamOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Breadcrumb
          items={[
            {
              title: (
                <Link to="/">
                  <HomeOutlined /> Trang chủ
                </Link>
              ),
            },
            { title: "Giới thiệu" },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary to-secondary py-20 mt-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-80 h-80 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Về <span className="text-accent">CHRONOS</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Được thành lập từ năm 2018, CHRONOS đã trở thành địa chỉ tin cậy
            hàng đầu Việt Nam cho những người yêu thích đồng hồ cao cấp. Chúng
            tôi mang đến sự kết hợp hoàn hảo giữa nghệ thuật chế tác truyền
            thống và phong cách hiện đại.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <Row gutter={[24, 24]}>
          {[
            { number: "10K+", label: "Khách hàng tin tưởng", icon: <TeamOutlined /> },
            { number: "50+", label: "Thương hiệu đối tác", icon: <GlobalOutlined /> },
            { number: "100%", label: "Chính hãng", icon: <SafetyCertificateOutlined /> },
            { number: "#1", label: "Uy tín hàng đầu", icon: <TrophyOutlined /> },
          ].map((stat, i) => (
            <Col key={i} xs={12} md={6}>
              <Card className="!rounded-2xl !shadow-md !border-none text-center hover:!shadow-lg transition-shadow">
                <div className="text-3xl text-accent mb-2">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-primary m-0">
                  {stat.number}
                </h3>
                <p className="text-gray-400 text-sm m-0 mt-1">{stat.label}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase">
            Giá trị cốt lõi
          </p>
          <h2 className="text-3xl font-bold text-primary mt-2">
            Tại sao chọn CHRONOS?
          </h2>
        </div>
        <Row gutter={[24, 24]}>
          {[
            {
              title: "Cam kết chính hãng",
              desc: "Mọi sản phẩm đều được nhập khẩu trực tiếp từ nhà sản xuất, đi kèm đầy đủ giấy tờ và phiếu bảo hành quốc tế.",
              emoji: "🛡️",
            },
            {
              title: "Tư vấn chuyên nghiệp",
              desc: "Đội ngũ chuyên viên am hiểu sâu về đồng hồ, sẵn sàng tư vấn giúp bạn tìm được chiếc đồng hồ phù hợp nhất.",
              emoji: "💎",
            },
            {
              title: "Bảo hành toàn diện",
              desc: "Chế độ bảo hành lên đến 5 năm cùng dịch vụ chăm sóc sau bán hàng tận tâm, hỗ trợ kỹ thuật trọn đời.",
              emoji: "🔧",
            },
            {
              title: "Giao hàng an toàn",
              desc: "Đóng gói cẩn thận, bảo hiểm 100% giá trị. Giao hàng toàn quốc trong 1-3 ngày, miễn phí cho đơn từ 5 triệu.",
              emoji: "📦",
            },
          ].map((value, i) => (
            <Col key={i} xs={24} md={12} lg={6}>
              <Card className="!rounded-2xl !shadow-sm !border-gray-100 h-full hover:!shadow-md transition-shadow hover:!-translate-y-1 !transition-all !duration-300">
                <div className="text-4xl mb-4">{value.emoji}</div>
                <h3 className="text-lg font-bold text-primary mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed m-0">
                  {value.desc}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-accent-dark to-accent rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng khám phá?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Hãy bắt đầu hành trình tìm kiếm chiếc đồng hồ hoàn hảo cho bạn
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/products")}
            className="!h-14 !px-12 !rounded-full !font-bold !text-base !bg-primary !border-none"
          >
            Khám phá bộ sưu tập <RightOutlined />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
