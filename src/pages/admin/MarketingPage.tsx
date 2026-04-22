import { Card, Row, Col, Button, Statistic } from "antd";
import { MailOutlined, MessageOutlined, BellOutlined, ShareAltOutlined, PlusOutlined } from "@ant-design/icons";
import "./AdminStyles.css";

const MarketingPage = () => {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Marketing & Quảng cáo</h1>
        <p className="admin-page-subtitle">Quản lý chiến dịch marketing và quảng cáo</p>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card">
            <Statistic
              title="Email đã gửi"
              value={1250}
              prefix={<MailOutlined />}
              valueStyle={{ color: "#2196f3", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card">
            <Statistic
              title="SMS đã gửi"
              value={450}
              prefix={<MessageOutlined />}
              valueStyle={{ color: "#4caf50", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card">
            <Statistic
              title="Thông báo"
              value={890}
              prefix={<BellOutlined />}
              valueStyle={{ color: "#ff9800", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card">
            <Statistic
              title="Chia sẻ"
              value={320}
              prefix={<ShareAltOutlined />}
              valueStyle={{ color: "#c9a96e", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card className="admin-stat-card" hoverable>
            <div style={{ textAlign: "center" }}>
              <MailOutlined style={{ fontSize: 48, color: "#2196f3", marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Email Marketing</h3>
              <p style={{ color: "#999", marginBottom: 16 }}>Gửi email quảng cáo đến khách hàng</p>
              <Button type="primary" icon={<PlusOutlined />}>Tạo chiến dịch</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="admin-stat-card" hoverable>
            <div style={{ textAlign: "center" }}>
              <MessageOutlined style={{ fontSize: 48, color: "#4caf50", marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>SMS Marketing</h3>
              <p style={{ color: "#999", marginBottom: 16 }}>Gửi tin nhắn SMS đến khách hàng</p>
              <Button type="primary" icon={<PlusOutlined />}>Tạo chiến dịch</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="admin-stat-card" hoverable>
            <div style={{ textAlign: "center" }}>
              <BellOutlined style={{ fontSize: 48, color: "#ff9800", marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Push Notification</h3>
              <p style={{ color: "#999", marginBottom: 16 }}>Gửi thông báo đẩy đến ứng dụng</p>
              <Button type="primary" icon={<PlusOutlined />}>Tạo thông báo</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="admin-stat-card" hoverable>
            <div style={{ textAlign: "center" }}>
              <ShareAltOutlined style={{ fontSize: 48, color: "#c9a96e", marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Social Media</h3>
              <p style={{ color: "#999", marginBottom: 16 }}>Quản lý mạng xã hội</p>
              <Button type="primary" icon={<PlusOutlined />}>Tạo bài viết</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MarketingPage;
