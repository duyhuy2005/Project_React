import { Card, Row, Col, Statistic, Table, Tag } from "antd";
import { DollarOutlined, RiseOutlined, FallOutlined, WalletOutlined } from "@ant-design/icons";
import "./AdminStyles.css";

const FinancePage = () => {
  const transactions = [
    { id: 1, date: "2026-04-07", type: "income", amount: 12500000, description: "Đơn hàng #1001", status: "completed" },
    { id: 2, date: "2026-04-06", type: "income", amount: 8900000, description: "Đơn hàng #1002", status: "completed" },
    { id: 3, date: "2026-04-05", type: "expense", amount: 2000000, description: "Nhập hàng", status: "completed" },
    { id: 4, date: "2026-04-04", type: "income", amount: 15600000, description: "Đơn hàng #1003", status: "pending" },
  ];

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === "income" ? "green" : "red"} icon={type === "income" ? <RiseOutlined /> : <FallOutlined />}>
          {type === "income" ? "Thu" : "Chi"}
        </Tag>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: { type: string }) => (
        <span style={{ fontWeight: 700, color: record.type === "income" ? "#4caf50" : "#f44336" }}>
          {record.type === "income" ? "+" : "-"}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}
        </span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "completed" ? "green" : "orange"}>
          {status === "completed" ? "Hoàn thành" : "Chờ xử lý"}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý tài chính</h1>
        <p className="admin-page-subtitle">Theo dõi doanh thu và chi phí</p>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card">
            <Statistic
              title="Tổng doanh thu"
              value={37000000}
              prefix={<DollarOutlined />}
              suffix="₫"
              valueStyle={{ color: "#4caf50", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card">
            <Statistic
              title="Tổng chi phí"
              value={2000000}
              prefix={<FallOutlined />}
              suffix="₫"
              valueStyle={{ color: "#f44336", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card">
            <Statistic
              title="Lợi nhuận"
              value={35000000}
              prefix={<RiseOutlined />}
              suffix="₫"
              valueStyle={{ color: "#c9a96e", fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="admin-stat-card">
            <Statistic
              title="Số dư"
              value={35000000}
              prefix={<WalletOutlined />}
              suffix="₫"
              valueStyle={{ color: "#2196f3", fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <div className="admin-table-card">
        <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 700 }}>Lịch sử giao dịch</h3>
        <Table columns={columns} dataSource={transactions} rowKey="id" />
      </div>
    </div>
  );
};

export default FinancePage;
