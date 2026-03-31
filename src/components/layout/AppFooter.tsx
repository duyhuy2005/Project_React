import React from "react";
import { Layout, Row, Col, Input, Button, Divider } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer className="!bg-primary text-gray-300 !px-0 !py-0 mt-12">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-accent-dark to-accent py-12">
        <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 text-center max-w-[1600px]">
          <h3 className="text-white text-2xl font-bold m-0 font-display">
            Đăng ký nhận tin
          </h3>
          <p className="text-white/80 text-sm m-0 mt-2 mb-6">
            Nhận ưu đãi độc quyền và cập nhật bộ sưu tập mới nhất
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder="Email của bạn..."
              size="large"
              className="!rounded-full"
              prefix={<MailOutlined className="text-gray-400" />}
            />
            <Button
              type="primary"
              size="large"
              icon={<SendOutlined />}
              className="!bg-primary hover:!bg-secondary !rounded-full !px-8"
            >
              Gửi
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-12 max-w-[1600px]">
        <Row gutter={[48, 32]}>
          <Col xs={24} md={8}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">⌚</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-bold m-0">CHRONOS</h3>
                <p className="text-accent text-[10px] tracking-[0.2em] m-0">
                  LUXURY WATCHES
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Chúng tôi mang đến những chiếc đồng hồ cao cấp nhất từ các
              thương hiệu danh tiếng trên toàn thế giới, đảm bảo 100% chính
              hãng với chế độ bảo hành toàn diện.
            </p>
            <div className="flex gap-3 mt-4">
              {[FacebookOutlined, InstagramOutlined, YoutubeOutlined].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:bg-accent hover:text-white transition-all"
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </Col>

          <Col xs={12} md={5}>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">
              Danh mục
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              {["Đồng hồ cao cấp", "Thể thao", "Cổ điển", "Casual"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/products"
                      className="text-gray-400 hover:text-accent text-sm no-underline transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </Col>

          <Col xs={12} md={5}>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">
              Hỗ trợ
            </h4>
            <ul className="list-none p-0 m-0 space-y-2">
              {[
                "Chính sách đổi trả",
                "Hướng dẫn mua hàng",
                "Bảo hành",
                "FAQs",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-accent text-sm no-underline transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          <Col xs={24} md={6}>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">
              Liên hệ
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-gray-400 text-sm">
                <EnvironmentOutlined className="text-accent mt-1" />
                <span>123 Nguyễn Huệ, Q.1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <PhoneOutlined className="text-accent" />
                <span>1900 1234 56</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MailOutlined className="text-accent" />
                <span>support@chronos.vn</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Divider className="!border-white/10 !m-0" />

      {/* Bottom bar */}
      <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-4 flex flex-col md:flex-row items-center justify-between gap-2 max-w-[1600px]">
        <p className="text-gray-500 text-xs m-0">
          © 2026 CHRONOS. Tất cả quyền được bảo lưu.
        </p>
        <div className="flex gap-4">
          {["Điều khoản", "Bảo mật", "Cookies"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-gray-500 hover:text-accent text-xs no-underline transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
