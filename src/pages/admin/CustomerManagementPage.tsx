import { useEffect, useMemo, useState } from "react";
import { Table, Input, Button, Drawer, Descriptions, Typography, Avatar, Row, Col } from "antd";
import { SearchOutlined, EyeOutlined, UserOutlined, MailOutlined, PhoneOutlined, ShoppingCartOutlined, DollarOutlined, CalendarOutlined } from "@ant-design/icons";
import { useUserStore } from "../../stores/userStore";
import { useOrderStore } from "../../stores/orderStore";
import { formatPrice } from "../../data/products";
import "./AdminStyles.css";

const { Text } = Typography;

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
}

const CustomerManagementPage = () => {
  const users = useUserStore((state) => state.users);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const orders = useOrderStore((state) => state.orders);
  const [searchText, setSearchText] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(null);

  useEffect(() => {
    if (users.length === 0) {
      void fetchUsers();
    }
  }, [fetchUsers, users.length]);

  const customerRows = useMemo(() => {
    const map = new Map<string, CustomerRow>();
    orders.forEach((order) => {
      const key = order.customerEmail || order.customerName;
      const current = map.get(key) || {
        id: key,
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        totalOrders: 0,
        totalSpent: 0,
        joinedAt: order.createdAt,
      };
      current.totalOrders += 1;
      current.totalSpent += order.totalAmount;
      map.set(key, current);
    });

    return [...map.values()].filter((customer) =>
      [customer.name, customer.email, customer.phone].some((value) => String(value || "").toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [orders, searchText]);

  const columns = [
    {
      title: "Khách hàng",
      key: "customer",
      render: (_: unknown, record: CustomerRow) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar size={40} style={{ background: "#c9a96e", fontWeight: 700 }}>{String(record.name || "U").charAt(0)}</Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "#999" }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Đơn hàng", dataIndex: "totalOrders", key: "totalOrders" },
    {
      title: "Tổng chi tiêu",
      dataIndex: "totalSpent",
      key: "totalSpent",
      render: (amount: number) => <Text strong style={{ color: "#c9a96e" }}>{formatPrice(amount)}</Text>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, record: CustomerRow) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedCustomer(record); setDrawerOpen(true); }}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const totalCustomers = customerRows.length;
  const totalRevenue = customerRows.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const avgSpent = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const vipCount = customerRows.filter((customer) => customer.totalSpent >= 40000000).length;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý khách hàng</h1>
        <p className="admin-page-subtitle">{totalCustomers} khách hàng từ đơn hàng thật</p>
      </div>

      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <div className="stat-card stat-card-customers">
            <div className="stat-card-icon"><UserOutlined /></div>
            <div className="stat-card-value">{totalCustomers}</div>
            <div className="stat-card-label">Tổng khách hàng</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="stat-card stat-card-revenue">
            <div className="stat-card-icon"><DollarOutlined /></div>
            <div className="stat-card-value" style={{ fontSize: 22 }}>{formatPrice(avgSpent)}</div>
            <div className="stat-card-label">Chi tiêu trung bình</div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="stat-card stat-card-orders">
            <div className="stat-card-icon"><ShoppingCartOutlined /></div>
            <div className="stat-card-value">{vipCount}</div>
            <div className="stat-card-label">Khách hàng VIP</div>
          </div>
        </Col>
      </Row>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar-left">
            <Input placeholder="Tìm tên, email, số điện thoại..." prefix={<SearchOutlined style={{ color: "#999" }} />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 300 }} allowClear />
          </div>
        </div>

        <Table columns={columns} dataSource={customerRows} rowKey="id" pagination={{ pageSize: 8, showSizeChanger: false }} />
      </div>

      <Drawer title="Thông tin khách hàng" open={drawerOpen} onClose={() => setDrawerOpen(false)} width={420}>
        {selectedCustomer && (
          <Descriptions column={1} size="small">
            <Descriptions.Item label={<span><MailOutlined /> Email</span>}>{selectedCustomer.email}</Descriptions.Item>
            <Descriptions.Item label={<span><PhoneOutlined /> SĐT</span>}>{selectedCustomer.phone}</Descriptions.Item>
            <Descriptions.Item label={<span><CalendarOutlined /> Ngày tham gia</span>}>{new Date(selectedCustomer.joinedAt).toLocaleDateString("vi-VN")}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default CustomerManagementPage;
