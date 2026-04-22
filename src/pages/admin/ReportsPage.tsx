import { Card, Row, Col, Statistic, DatePicker, Button, Space } from "antd";
import { DownloadOutlined, LineChartOutlined, BarChartOutlined, PieChartOutlined } from "@ant-design/icons";
import "./AdminStyles.css";

const { RangePicker } = DatePicker;

const ReportsPage = () => {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Báo cáo & Phân tích</h1>
        <p className="admin-page-subtitle">Xem báo cáo chi tiết về hoạt động kinh doanh</p>
      </div>

      <div className="admin-table-card" style={{ marginBottom: 24 }}>
        <Space size="middle">
          <RangePicker />
          <Button type="primary" icon={<DownloadOutlined />}>Xuất báo cáo</Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="admin-stat-card" hoverable>
            <div style={{ textAlign: "center" }}>
              <LineChartOutlined style={{ fontSize: 48, color: "#c9a96e", marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Báo cáo doanh thu</h3>
              <p style={{ color: "#999", marginBottom: 16 }}>Phân tích doanh thu theo thời gian</p>
              <Button type="primary">Xem báo cáo</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="admin-stat-card" hoverable>
            <div style={{ textAlign: "center" }}>
              <BarChartOutlined style={{ fontSize: 48, color: "#4caf50", marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Báo cáo sản phẩm</h3>
              <p style={{ color: "#999", marginBottom: 16 }}>Sản phẩm bán chạy nhất</p>
              <Button type="primary">Xem báo cáo</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="admin-stat-card" hoverable>
            <div style={{ textAlign: "center" }}>
              <PieChartOutlined style={{ fontSize: 48, color: "#2196f3", marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Báo cáo khách hàng</h3>
              <p style={{ color: "#999", marginBottom: 16 }}>Phân tích hành vi khách hàng</p>
              <Button type="primary">Xem báo cáo</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportsPage;
