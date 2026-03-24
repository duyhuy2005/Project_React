import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Drawer,
  Descriptions,
  Typography,
  Avatar,
  Tag,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { customers } from "../../data/adminData";
import type { Customer } from "../../data/adminData";
import { formatPrice } from "../../data/products";
import "./AdminStyles.css";

const { Text } = Typography;

const CustomerManagementPage = () => {
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      c.email.toLowerCase().includes(searchText.toLowerCase()) ||
      c.phone.includes(searchText);
    return matchSearch;
  });

  const handleViewDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerOpen(true);
  };

  const getCustomerTier = (spent: number) => {
    if (spent >= 70000000) return { label: "VIP Diamond", color: "#722ed1" };
    if (spent >= 40000000) return { label: "VIP Gold", color: "#c9a96e" };
    if (spent >= 20000000) return { label: "Silver", color: "#8c8c8c" };
    return { label: "Standard", color: "#1890ff" };
  };

  const columns = [
    {
      title: "Khách hàng",
      key: "customer",
      render: (_: unknown, record: Customer) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            size={40}
            style={{
              background: `hsl(${(record.id * 60) % 360}, 60%, 60%)`,
              fontWeight: 700,
            }}
          >
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>
              {record.name}
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => (
        <Text style={{ fontSize: 13 }}>{phone}</Text>
      ),
    },
    {
      title: "Đơn hàng",
      dataIndex: "totalOrders",
      key: "totalOrders",
      sorter: (a: Customer, b: Customer) => a.totalOrders - b.totalOrders,
      render: (count: number) => (
        <Text strong style={{ fontSize: 14 }}>
          {count}
        </Text>
      ),
    },
    {
      title: "Tổng chi tiêu",
      dataIndex: "totalSpent",
      key: "totalSpent",
      sorter: (a: Customer, b: Customer) => a.totalSpent - b.totalSpent,
      render: (amount: number) => (
        <Text strong style={{ color: "#c9a96e", fontSize: 14 }}>
          {formatPrice(amount)}
        </Text>
      ),
    },
    {
      title: "Hạng khách hàng",
      key: "tier",
      render: (_: unknown, record: Customer) => {
        const tier = getCustomerTier(record.totalSpent);
        return <Tag color={tier.color}>{tier.label}</Tag>;
      },
    },
    {
      title: "Ngày tham gia",
      dataIndex: "joinedAt",
      key: "joinedAt",
      sorter: (a: Customer, b: Customer) =>
        new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime(),
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {new Date(date).toLocaleDateString("vi-VN")}
        </Text>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 100,
      render: (_: unknown, record: Customer) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
          style={{ color: "#4f46e5" }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Summary stats
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpent = totalRevenue / totalCustomers;
  const vipCount = customers.filter((c) => c.totalSpent >= 40000000).length;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý khách hàng</h1>
        <p className="admin-page-subtitle">{totalCustomers} khách hàng đã đăng ký</p>
      </div>

      {/* Summary Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <div className="stat-card stat-card-customers">
            <div className="stat-card-icon">
              <UserOutlined />
            </div>
            <div className="stat-card-value">{totalCustomers}</div>
            <div className="stat-card-label">Tổng khách hàng</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="stat-card stat-card-revenue">
            <div className="stat-card-icon">
              <DollarOutlined />
            </div>
            <div className="stat-card-value" style={{ fontSize: 22 }}>
              {formatPrice(avgSpent)}
            </div>
            <div className="stat-card-label">Chi tiêu trung bình</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="stat-card stat-card-orders">
            <div className="stat-card-icon">
              <ShoppingCartOutlined />
            </div>
            <div className="stat-card-value">{vipCount}</div>
            <div className="stat-card-label">Khách hàng VIP</div>
          </div>
        </Col>
      </Row>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar-left">
            <Input
              placeholder="Tìm tên, email, số điện thoại..."
              prefix={<SearchOutlined style={{ color: "#999" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showTotal: (total) => `Tổng ${total} khách hàng`,
            showSizeChanger: false,
          }}
        />
      </div>

      {/* Customer Detail Drawer */}
      <Drawer
        title={
          <span style={{ fontSize: 16, fontWeight: 700 }}>Thông tin khách hàng</span>
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{ wrapper: { width: 480 } }}
      >
        {selectedCustomer && (
          <div>
            {/* Header */}
            <div
              style={{
                textAlign: "center",
                marginBottom: 24,
                padding: "24px 0",
                background: "#f8f9fa",
                borderRadius: 16,
              }}
            >
              <Avatar
                size={72}
                style={{
                  background: `hsl(${(selectedCustomer.id * 60) % 360}, 60%, 60%)`,
                  fontSize: 28,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                {selectedCustomer.name.charAt(0)}
              </Avatar>
              <div
                style={{ fontWeight: 700, fontSize: 18, color: "#1a1a2e", marginBottom: 4 }}
              >
                {selectedCustomer.name}
              </div>
              <Tag color={getCustomerTier(selectedCustomer.totalSpent).color}>
                {getCustomerTier(selectedCustomer.totalSpent).label}
              </Tag>
            </div>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Statistic
                  title="Tổng đơn hàng"
                  value={selectedCustomer.totalOrders}
                  prefix={<ShoppingCartOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Tổng chi tiêu"
                  value={selectedCustomer.totalSpent}
                  formatter={(value) => formatPrice(value as number)}
                  prefix={<DollarOutlined />}
                />
              </Col>
            </Row>

            {/* Info */}
            <Descriptions
              column={1}
              size="small"
              labelStyle={{ fontWeight: 600, color: "#666" }}
            >
              <Descriptions.Item
                label={
                  <span>
                    <MailOutlined style={{ marginRight: 8 }} /> Email
                  </span>
                }
              >
                {selectedCustomer.email}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <PhoneOutlined style={{ marginRight: 8 }} /> SĐT
                  </span>
                }
              >
                {selectedCustomer.phone}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <EnvironmentOutlined style={{ marginRight: 8 }} /> Địa chỉ
                  </span>
                }
              >
                {selectedCustomer.address}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <CalendarOutlined style={{ marginRight: 8 }} /> Ngày tham gia
                  </span>
                }
              >
                {new Date(selectedCustomer.joinedAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CustomerManagementPage;
