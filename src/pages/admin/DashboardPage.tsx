import { useEffect, useMemo, useState } from "react";
import { Row, Col, Table, Tag, Typography, Badge } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ShoppingOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useOrderStore, orderStatusConfig } from "../../stores/orderStore";
import { useProductStore } from "../../stores/productStore";
import { useUserStore } from "../../stores/userStore";
import { formatPrice } from "../../data/products";
import statisticsService, { type BestSellingProduct, type DashboardStatistics, type MonthlyRevenue } from "../../services/statisticsService";
import type { Order } from "../../stores/orderStore";
import "./AdminStyles.css";

const { Text } = Typography;

const DashboardPage = () => {
  const navigate = useNavigate();
  const orders = useOrderStore((state) => state.orders);
  const products = useProductStore((state) => state.products);
  const users = useUserStore((state) => state.users);
  const [dashboard, setDashboard] = useState<DashboardStatistics | null>(null);
  const [revenueChartData, setRevenueChartData] = useState<MonthlyRevenue[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<BestSellingProduct[]>([]);

  useEffect(() => {
    void Promise.all([
      statisticsService.getDashboard().then(setDashboard),
      statisticsService.getMonthlyRevenue().then(setRevenueChartData),
      statisticsService.getBestSellers(5).then(setTopSellingProducts),
    ]);
  }, []);

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [orders]
  );
  const totalRevenue = dashboard?.totalRevenue ?? orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = dashboard?.totalOrders ?? orders.length;
  const totalUsers = dashboard?.totalUsers ?? users.length;
  const maxRevenue = Math.max(...revenueChartData.map((d) => d.revenue), 1);

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
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => <Text strong>{formatPrice(amount)}</Text>,
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
  ];

  const stats = [
    { title: "Doanh thu", value: formatPrice(totalRevenue), icon: <DollarOutlined />, color: "stat-card-revenue" },
    { title: "Đơn hàng", value: totalOrders.toString(), icon: <ShoppingCartOutlined />, color: "stat-card-orders", badge: orders.filter((o) => o.status === "new").length || undefined },
    { title: "Khách hàng", value: totalUsers.toString(), icon: <TeamOutlined />, color: "stat-card-customers" },
    { title: "Sản phẩm", value: products.length.toString(), icon: <ShoppingOutlined />, color: "stat-card-products" },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Tổng quan hoạt động kinh doanh từ dữ liệu thật</p>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <div className={`stat-card ${stat.color}`}>
              <Badge count={stat.badge} offset={[-10, 10]}>
                <div className="stat-card-icon">{stat.icon}</div>
              </Badge>
              <div className="stat-card-value">{stat.value}</div>
              <div className="stat-card-label">{stat.title}</div>
            </div>
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <div className="revenue-chart-card">
            <div className="revenue-chart-title">
              <RiseOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
              Doanh thu theo tháng
            </div>
            <div className="chart-bars">
              {revenueChartData.map((item) => (
                <div className="chart-bar-wrapper" key={item.month}>
                  <div className="chart-bar-value">{(item.revenue / 1000000).toFixed(0)}tr</div>
                  <div className="chart-bar" style={{ height: `${(item.revenue / maxRevenue) * 160}px` }} />
                  <div className="chart-bar-label">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <div className="top-products-card">
            <div className="revenue-chart-title">Sản phẩm bán chạy</div>
            {topSellingProducts.map((item, index) => (
              <div className="top-product-item" key={item.productId}>
                <div className={`top-product-rank ${index < 3 ? `rank-${index + 1}` : "rank-other"}`}>{index + 1}</div>
                <div className="top-product-info">
                  <div className="top-product-name">{item.productName}</div>
                  <div className="top-product-brand">{formatPrice(item.totalRevenue)}</div>
                </div>
                <div className="top-product-sold">{item.totalSold} đã bán</div>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <div className="recent-orders-card">
        <div className="recent-orders-title">
          <span>
            <ShoppingCartOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
            Đơn hàng gần đây
          </span>
          <a style={{ fontSize: 13, color: "#c9a96e", cursor: "pointer" }} onClick={() => navigate("/admin/orders")}>
            Xem tất cả →
          </a>
        </div>
        <Table columns={orderColumns} dataSource={recentOrders} rowKey="id" pagination={false} size="small" />
      </div>
    </div>
  );
};

export default DashboardPage;
