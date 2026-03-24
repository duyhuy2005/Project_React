import { Row, Col, Table, Tag, Typography } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  dashboardStats,
  revenueChartData,
  orders,
  topSellingProducts,
  orderStatusConfig,
} from "../../data/adminData";
import { formatPrice } from "../../data/products";
import type { Order } from "../../data/adminData";
import "./AdminStyles.css";

const { Text } = Typography;

const DashboardPage = () => {
  const navigate = useNavigate();
  const maxRevenue = Math.max(...revenueChartData.map((d) => d.revenue));

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const orderColumns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <Text strong style={{ color: "#4f46e5", fontSize: 13 }}>{id}</Text>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (name: string) => <Text style={{ fontSize: 13 }}>{name}</Text>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <Text strong style={{ fontSize: 13 }}>{formatPrice(amount)}</Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: Order["status"]) => {
        const config = orderStatusConfig[status];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {new Date(date).toLocaleDateString("vi-VN")}
        </Text>
      ),
    },
  ];

  const stats = [
    {
      title: "Doanh thu",
      value: formatPrice(dashboardStats.totalRevenue),
      growth: dashboardStats.revenueGrowth,
      icon: <DollarOutlined />,
      className: "stat-card-revenue",
    },
    {
      title: "Đơn hàng",
      value: dashboardStats.totalOrders.toString(),
      growth: dashboardStats.orderGrowth,
      icon: <ShoppingCartOutlined />,
      className: "stat-card-orders",
    },
    {
      title: "Khách hàng",
      value: dashboardStats.totalCustomers.toString(),
      growth: dashboardStats.customerGrowth,
      icon: <TeamOutlined />,
      className: "stat-card-customers",
    },
    {
      title: "Sản phẩm",
      value: dashboardStats.totalProducts.toString(),
      growth: 0,
      icon: <ShoppingOutlined />,
      className: "stat-card-products",
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Tổng quan hoạt động kinh doanh</p>
      </div>

      {/* Stat Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <div className={`stat-card ${stat.className}`}>
              <div className="stat-card-icon">{stat.icon}</div>
              <div className="stat-card-value">{stat.value}</div>
              <div className="stat-card-label">{stat.title}</div>
              {stat.growth > 0 && (
                <span className="stat-card-growth positive">
                  <ArrowUpOutlined /> +{stat.growth}%
                </span>
              )}
            </div>
          </Col>
        ))}
      </Row>

      {/* Charts & Recent */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Revenue Chart */}
        <Col xs={24} lg={14}>
          <div className="revenue-chart-card">
            <div className="revenue-chart-title">
              <RiseOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
              Doanh thu 7 ngày qua
            </div>
            <div className="chart-bars">
              {revenueChartData.map((item, index) => (
                <div className="chart-bar-wrapper" key={index}>
                  <div className="chart-bar-value">
                    {(item.revenue / 1000000).toFixed(0)}tr
                  </div>
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(item.revenue / maxRevenue) * 160}px`,
                      opacity: 0.7 + (item.revenue / maxRevenue) * 0.3,
                    }}
                  />
                  <div className="chart-bar-label">{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Top Products */}
        <Col xs={24} lg={10}>
          <div className="top-products-card">
            <div className="revenue-chart-title">
              <ShoppingOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
              Sản phẩm bán chạy
            </div>
            {topSellingProducts.map((item, index) => (
              <div className="top-product-item" key={item.product.id}>
                <div
                  className={`top-product-rank ${
                    index < 3 ? `rank-${index + 1}` : "rank-other"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="top-product-info">
                  <div className="top-product-name">{item.product.name}</div>
                  <div className="top-product-brand">{item.product.brand}</div>
                </div>
                <div className="top-product-sold">{item.sold} đã bán</div>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Recent Orders */}
      <div className="recent-orders-card">
        <div className="recent-orders-title">
          <span>
            <ShoppingCartOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
            Đơn hàng gần đây
          </span>
          <a
            style={{ fontSize: 13, color: "#c9a96e", cursor: "pointer" }}
            onClick={() => navigate("/admin/orders")}
          >
            Xem tất cả →
          </a>
        </div>
        <Table
          columns={orderColumns}
          dataSource={recentOrders}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
