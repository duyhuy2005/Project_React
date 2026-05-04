import { useEffect, useMemo, useState } from "react";
import { Row, Col, Typography, Card } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  RiseOutlined,
  TrophyOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useOrderStore, orderStatusConfig } from "../../stores/orderStore";
import { useProductStore } from "../../stores/productStore";
import { useUserStore } from "../../stores/userStore";
import statisticsService, { type CategorySales, type MonthlyRevenue } from "../../services/statisticsService";
import { formatPrice, categories } from "../../data/products";
import "./AdminStyles.css";

const { Text } = Typography;

const StatisticsPage = () => {
  const orders = useOrderStore((state) => state.orders);
  const products = useProductStore((state) => state.products);
  const users = useUserStore((state) => state.users);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);

  useEffect(() => {
    void Promise.all([
      statisticsService.getMonthlyRevenue().then(setMonthlyRevenue),
      statisticsService.getCategorySales().then(setCategorySales),
    ]);
  }, []);

  const maxMonthly = Math.max(...monthlyRevenue.map((d) => d.revenue), 1);
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const vipCount = users.filter((u) => (u.vaiTro || "").toLowerCase() !== "customer").length;

  const statusStats = useMemo(
    () =>
      Object.entries(orderStatusConfig).map(([key, val]) => ({
        status: key,
        label: val.label,
        color: val.color,
        count: orders.filter((o) => o.status === key).length,
      })),
    [orders]
  );

  const categoryStats = useMemo(
    () =>
      categories
        .filter((c) => c.key !== "all")
        .map((c) => {
          const stat = categorySales.find((item) => item.category === c.key);
          return {
            ...c,
            totalSold: stat?.totalSold || 0,
            totalRevenue: stat?.totalRevenue || 0,
          };
        }),
    [categorySales]
  );
  const totalCategoryRevenue = categoryStats.reduce((sum, item) => sum + item.totalRevenue, 0) || 1;

  return (
    <div style={{ width: "100%", display: "block" }}>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Thống kê & Báo cáo</h1>
        <p className="admin-page-subtitle">Dữ liệu thật từ SQL Server</p>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24, width: "100%" }}>
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
            <div className="stat-card-value">{products.length}</div>
            <div className="stat-card-label">Tổng sản phẩm đang bán</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="stat-card stat-card-customers">
            <div className="stat-card-icon"><StarOutlined /></div>
            <div className="stat-card-value">{vipCount}</div>
            <div className="stat-card-label">Vai trò khác customer</div>
          </div>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 24, width: "100%" }}>
        <Col xs={24} lg={14}>
          <div className="revenue-chart-card">
            <div className="revenue-chart-title">
              <RiseOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
              Doanh thu theo tháng
            </div>
            <div className="chart-bars" style={{ height: 220 }}>
              {monthlyRevenue.map((item) => (
                <div className="chart-bar-wrapper" key={item.month}>
                  <div className="chart-bar-value">{(item.revenue / 1000000).toFixed(0)}tr</div>
                  <div className="chart-bar" style={{ height: `${(item.revenue / maxMonthly) * 180}px` }} />
                  <div className="chart-bar-label">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={<span style={{ fontWeight: 700, fontSize: 16 }}><ShoppingCartOutlined style={{ marginRight: 8, color: "#c9a96e" }} />Phân bố theo danh mục</span>}
            style={{ borderRadius: 16, border: "1px solid rgba(0,0,0,0.04)" }}
            styles={{ body: { padding: "16px 24px" } }}
          >
            {categoryStats.map((cat) => {
              const percentage = Math.round((cat.totalRevenue / totalCategoryRevenue) * 100);
              return (
                <div key={cat.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <Text strong style={{ fontSize: 13 }}>{cat.icon} {cat.label}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{cat.totalSold} SP · {percentage}%</Text>
                  </div>
                  <div style={{ width: "100%", height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${percentage}%`, height: "100%", background: "linear-gradient(90deg, #c9a96e, #e0c891)", borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 24, width: "100%" }}>
        <Col xs={24} lg={14}>
          <div className="revenue-chart-card">
            <div className="revenue-chart-title">
              <RiseOutlined style={{ marginRight: 8, color: "#c9a96e" }} />
              Đơn hàng theo trạng thái
            </div>
            <div className="chart-bars" style={{ height: 220 }}>
              {statusStats.map((item) => (
                <div className="chart-bar-wrapper" key={item.status}>
                  <div className="chart-bar-value">{item.count}</div>
                  <div className="chart-bar" style={{ height: `${Math.max(item.count, 1) * 24}px`, background: "linear-gradient(180deg, #4f46e5 0%, #818cf8 100%)" }} />
                  <div className="chart-bar-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={<span style={{ fontWeight: 700, fontSize: 16 }}><TeamOutlined style={{ marginRight: 8, color: "#c9a96e" }} />Tổng quan người dùng</span>}
            style={{ borderRadius: 16, border: "1px solid rgba(0,0,0,0.04)" }}
            styles={{ body: { padding: "16px 24px" } }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <Text strong>Tổng người dùng</Text>
              <Text>{users.length}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <Text strong>Khách hàng</Text>
              <Text>{users.filter((u) => (u.vaiTro || "").toLowerCase() !== "admin").length}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Quản trị viên</Text>
              <Text>{users.filter((u) => (u.vaiTro || "").toLowerCase() === "admin").length}</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;
