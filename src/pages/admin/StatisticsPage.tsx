import { Row, Col, Typography, Card } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  RiseOutlined,
  TrophyOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {
  dashboardStats,
  revenueChartData,
  orders,
  customers,
  topSellingProducts,
  orderStatusConfig,
} from "../../data/adminData";
import { formatPrice, products, categories } from "../../data/products";
import type { OrderStatus } from "../../data/adminData";
import "./AdminStyles.css";

const { Text } = Typography;

const StatisticsPage = () => {
  // Monthly revenue data (simulate)
  const monthlyRevenue = [
    { month: "T1", revenue: 320000000 },
    { month: "T2", revenue: 410000000 },
    { month: "T3", revenue: 458500000 },
    { month: "T4", revenue: 380000000 },
    { month: "T5", revenue: 520000000 },
    { month: "T6", revenue: 490000000 },
  ];
  const maxMonthly = Math.max(...monthlyRevenue.map((d) => d.revenue));

  // Category distribution
  const categoryStats = categories
    .filter((c) => c.key !== "all")
    .map((c) => ({
      ...c,
      count: products.filter((p) => p.category === c.key).length,
      revenue:
        products
          .filter((p) => p.category === c.key)
          .reduce((sum, p) => sum + p.price, 0) * Math.floor(Math.random() * 5 + 3),
    }));
  const totalCategoryRevenue = categoryStats.reduce((sum, c) => sum + c.revenue, 0);

  // Order status distribution
  const statusStats = Object.entries(orderStatusConfig).map(([key, val]) => ({
    status: key as OrderStatus,
    label: val.label,
    color: val.color,
    count: orders.filter((o) => o.status === key).length,
  }));

  // Customer stats
  const avgOrderValue = dashboardStats.totalRevenue / dashboardStats.totalOrders;
  const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  const maxWeekly = Math.max(...revenueChartData.map((d) => d.revenue));

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Thống kê & Báo cáo</h1>
        <p className="admin-page-subtitle">Phân tích chi tiết hoạt động kinh doanh</p>
      </div>

      {/* Summary Row */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <div className="stat-card stat-card-revenue">
            <div className="stat-card-icon"><DollarOutlined /></div>
            <div className="stat-card-value" style={{ fontSize: 22 }}>{formatPrice(avgOrderValue)}</div>
            <div className="stat-card-label">Giá trị đơn hàng trung bình</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="stat-card stat-card-orders">
            <div className="stat-card-icon"><TrophyOutlined /></div>
            <div className="stat-card-value">{topSellingProducts[0]?.sold || 0}</div>
            <div className="stat-card-label">Sản phẩm bán chạy nhất (số lượng)</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="stat-card stat-card-customers">
            <div className="stat-card-icon"><StarOutlined /></div>
            <div className="stat-card-value">{customers.filter((c) => c.totalSpent >= 40000000).length}</div>
            <div className="stat-card-label">Khách hàng VIP</div>
          </div>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Monthly Revenue */}
        <Col xs={24} lg={14}>
          <div className="revenue-chart-card">
            <div className="revenue-chart-title">
              <RiseOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
              Doanh thu theo tháng (6 tháng gần nhất)
            </div>
            <div className="chart-bars" style={{ height: 220 }}>
              {monthlyRevenue.map((item, index) => (
                <div className="chart-bar-wrapper" key={index}>
                  <div className="chart-bar-value">
                    {(item.revenue / 1000000).toFixed(0)}tr
                  </div>
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(item.revenue / maxMonthly) * 180}px`,
                      opacity: 0.7 + (item.revenue / maxMonthly) * 0.3,
                    }}
                  />
                  <div className="chart-bar-label">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Category Distribution */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <span style={{ fontWeight: 700, fontSize: 16 }}>
                <ShoppingCartOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
                Phân bố theo danh mục
              </span>
            }
            style={{ borderRadius: 16, border: "1px solid rgba(0,0,0,0.04)" }}
            styles={{ body: { padding: "16px 24px" } }}
          >
            {categoryStats.map((cat) => {
              const percentage = Math.round((cat.revenue / totalCategoryRevenue) * 100);
              return (
                <div key={cat.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <Text strong style={{ fontSize: 13 }}>
                      {cat.icon} {cat.label}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {cat.count} SP · {percentage}%
                    </Text>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 8,
                      background: "#f0f0f0",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background:
                          cat.key === "luxury"
                            ? "linear-gradient(90deg, #c9a96e, #e0c891)"
                            : cat.key === "sport"
                            ? "linear-gradient(90deg, #4f46e5, #818cf8)"
                            : cat.key === "classic"
                            ? "linear-gradient(90deg, #7c3aed, #a78bfa)"
                            : "linear-gradient(90deg, #059669, #34d399)",
                        borderRadius: 4,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {/* Weekly Revenue */}
        <Col xs={24} lg={14}>
          <div className="revenue-chart-card">
            <div className="revenue-chart-title">
              <RiseOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
              Doanh thu 7 ngày gần nhất
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
                      height: `${(item.revenue / maxWeekly) * 160}px`,
                      opacity: 0.7 + (item.revenue / maxWeekly) * 0.3,
                      background: "linear-gradient(180deg, #4f46e5 0%, #818cf8 100%)",
                    }}
                  />
                  <div className="chart-bar-label">{item.day}</div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Order Status Distribution */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <span style={{ fontWeight: 700, fontSize: 16 }}>
                <ShoppingCartOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
                Trạng thái đơn hàng
              </span>
            }
            style={{ borderRadius: 16, border: "1px solid rgba(0,0,0,0.04)" }}
            styles={{ body: { padding: "16px 24px" } }}
          >
            {statusStats.map((stat) => {
              const percentage = orders.length > 0 ? Math.round((stat.count / orders.length) * 100) : 0;
              const colorMap: Record<string, string> = {
                blue: "#1677ff",
                cyan: "#13c2c2",
                orange: "#fa8c16",
                green: "#52c41a",
                red: "#ff4d4f",
              };
              return (
                <div key={stat.status} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <Text strong style={{ fontSize: 13 }}>
                      {stat.label}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {stat.count} đơn · {percentage}%
                    </Text>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 8,
                      background: "#f0f0f0",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: colorMap[stat.color] || "#ccc",
                        borderRadius: 4,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>

      {/* Top Customers */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <div className="top-products-card">
            <div className="revenue-chart-title">
              <TeamOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
              Top khách hàng chi tiêu
            </div>
            {topCustomers.map((customer, index) => (
              <div className="top-product-item" key={customer.id}>
                <div
                  className={`top-product-rank ${
                    index < 3 ? `rank-${index + 1}` : "rank-other"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="top-product-info">
                  <div className="top-product-name">{customer.name}</div>
                  <div className="top-product-brand">{customer.totalOrders} đơn hàng</div>
                </div>
                <div className="top-product-sold">{formatPrice(customer.totalSpent)}</div>
              </div>
            ))}
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="top-products-card">
            <div className="revenue-chart-title">
              <TrophyOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
              Top sản phẩm bán chạy
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
                  <div className="top-product-brand">
                    {item.product.brand} · {formatPrice(item.product.price)}
                  </div>
                </div>
                <div className="top-product-sold">{item.sold} đã bán</div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;
