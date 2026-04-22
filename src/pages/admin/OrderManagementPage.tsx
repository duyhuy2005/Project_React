import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Drawer,
  Typography,
  Timeline,
  message,
  Divider,
  Card,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CloseCircleOutlined,
  PrinterOutlined,
  DownloadOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useOrderStore, orderStatusConfig } from "../../stores/orderStore";
import type { Order, OrderStatus } from "../../stores/orderStore";
import { formatPrice } from "../../data/products";
import "./AdminStyles.css";

const { Text } = Typography;

const OrderManagementPage = () => {
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(searchText.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    message.success(`Đã cập nhật trạng thái đơn hàng ${orderId}!`);
  };

  const statusTimeline = (status: OrderStatus) => {
    const steps = [
      { status: "new" as OrderStatus, label: "Đơn mới", icon: <ClockCircleOutlined /> },
      { status: "confirmed" as OrderStatus, label: "Xác nhận", icon: <CheckCircleOutlined /> },
      { status: "shipping" as OrderStatus, label: "Đang giao", icon: <CarOutlined /> },
      { status: "completed" as OrderStatus, label: "Hoàn thành", icon: <CheckCircleOutlined /> },
    ];

    if (status === "cancelled") {
      return (
        <Timeline
          items={[
            {
              color: "red",
              dot: <CloseCircleOutlined />,
              children: "Đơn hàng đã bị hủy",
            },
          ]}
        />
      );
    }

    const currentIndex = steps.findIndex((s) => s.status === status);
    return (
      <Timeline
        items={steps.map((step, index) => ({
          color: index <= currentIndex ? "green" : "gray",
          dot: step.icon,
          children: (
            <span style={{ color: index <= currentIndex ? "#1a1a2e" : "#ccc" }}>
              {step.label}
            </span>
          ),
        }))}
      />
    );
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <Text strong style={{ color: "#4f46e5", fontSize: 13 }}>
          {id}
        </Text>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (name: string, record: Order) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
          <div style={{ fontSize: 12, color: "#999" }}>{record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      key: "items",
      render: (_: unknown, record: Order) => (
        <div>
          <div style={{ fontSize: 13 }}>
            {record.items.length} sản phẩm
          </div>
          <div style={{ fontSize: 12, color: "#999" }}>
            {record.items.map((i) => i.product.name).join(", ").substring(0, 40)}
            {record.items.map((i) => i.product.name).join(", ").length > 40 ? "..." : ""}
          </div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
      render: (amount: number) => (
        <Text strong style={{ color: "#c9a96e", fontSize: 14 }}>
          {formatPrice(amount)}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus) => {
        const config = orderStatusConfig[status];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a: Order, b: Order) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {new Date(date).toLocaleDateString("vi-VN")} <br />
          <span style={{ fontSize: 11 }}>
            {new Date(date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </Text>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 100,
      render: (_: unknown, record: Order) => (
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

  const statusOptions = [
    { value: "all", label: "Tất cả trạng thái" },
    ...Object.entries(orderStatusConfig).map(([key, val]) => ({
      value: key,
      label: val.label,
    })),
  ];

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const flow: OrderStatus[] = ["new", "confirmed", "shipping", "completed"];
    const idx = flow.indexOf(current);
    if (idx >= 0 && idx < flow.length - 1) return flow[idx + 1];
    return null;
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý đơn hàng</h1>
        <p className="admin-page-subtitle">{orders.length} đơn hàng</p>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar-left">
            <Input
              placeholder="Tìm mã đơn, tên khách hàng..."
              prefix={<SearchOutlined style={{ color: "#999" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280 }}
              allowClear
            />
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 180 }}
              options={statusOptions}
            />
          </div>
          <Space>
            {Object.entries(orderStatusConfig).map(([key, val]) => {
              const count = orders.filter((o: Order) => o.status === key).length;
              return (
                <Tag
                  key={key}
                  color={filterStatus === key ? val.color : undefined}
                  style={{ cursor: "pointer" }}
                  onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
                >
                  {val.label} ({count})
                </Tag>
              );
            })}
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
            showSizeChanger: false,
          }}
        />
      </div>

      {/* Order Detail Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>
              Chi tiết đơn hàng {selectedOrder?.id}
            </span>
            <Space size="small">
              <Tooltip title="In đơn hàng">
                <Button type="text" icon={<PrinterOutlined />} size="small" />
              </Tooltip>
              <Tooltip title="Tải xuống">
                <Button type="text" icon={<DownloadOutlined />} size="small" />
              </Tooltip>
            </Space>
          </div>
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={520}
      >
        {selectedOrder && (
          <div>
            {/* Status & Actions */}
            <Card style={{ marginBottom: 16, background: "#f9fafb", border: "1px solid #f0f0f0" }}>
              <div style={{ marginBottom: 12 }}>
                <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
                  Trạng thái đơn hàng
                </Text>
                <Tag
                  color={orderStatusConfig[selectedOrder.status].color}
                  style={{ fontSize: 14, padding: "4px 16px" }}
                >
                  {orderStatusConfig[selectedOrder.status].label}
                </Tag>
              </div>
              {selectedOrder.status !== "completed" && selectedOrder.status !== "cancelled" && (
                <Space style={{ width: "100%", gap: 8 }} direction="vertical">
                  {getNextStatus(selectedOrder.status) && (
                    <Button
                      type="primary"
                      block
                      size="small"
                      onClick={() =>
                        handleUpdateStatus(
                          selectedOrder.id,
                          getNextStatus(selectedOrder.status)!
                        )
                      }
                    >
                      ✓ Đổi sang {orderStatusConfig[getNextStatus(selectedOrder.status)!].label}
                    </Button>
                  )}
                  <Button
                    danger
                    block
                    size="small"
                    onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                  >
                    ✕ Hủy đơn hàng
                  </Button>
                </Space>
              )}
            </Card>

            {/* Timeline */}
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
                Lịch sử trạng thái
              </Text>
              {statusTimeline(selectedOrder.status)}
            </div>

            <Divider style={{ margin: "16px 0" }} />

            {/* Customer Info */}
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
                👤 Thông tin khách hàng
              </Text>
              <Card size="small" style={{ background: "#f9fafb" }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontWeight: 600, minWidth: 80, color: "#666" }}>Họ tên:</span>
                        <span>{selectedOrder.customerName}</span>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontWeight: 600, minWidth: 80, color: "#666" }}>
                          <MailOutlined /> Email:
                        </span>
                        <span style={{ color: "#4f46e5", cursor: "pointer" }}>
                          {selectedOrder.customerEmail}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontWeight: 600, minWidth: 80, color: "#666" }}>
                          <PhoneOutlined /> SĐT:
                        </span>
                        <span style={{ cursor: "pointer" }}>{selectedOrder.customerPhone}</span>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <span style={{ fontWeight: 600, minWidth: 80, color: "#666" }}>
                          <EnvironmentOutlined /> Địa chỉ:
                        </span>
                        <span style={{ flex: 1 }}>{selectedOrder.address}</span>
                      </div>
                      {selectedOrder.note && (
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <span style={{ fontWeight: 600, minWidth: 80, color: "#666" }}>Ghi chú:</span>
                          <span style={{ color: "#f59e0b", flex: 1 }}>📌 {selectedOrder.note}</span>
                        </div>
                      )}
                    </Space>
                  </Col>
                </Row>
              </Card>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            {/* Items */}
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
                📦 Sản phẩm ({selectedOrder.items.length})
              </Text>
              {selectedOrder.items.map((item, idx) => (
                <Card key={idx} size="small" style={{ marginBottom: 8, background: "#f9fafb" }}>
                  <Row align="middle" gutter={12}>
                    <Col>
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 8,
                          background: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                          border: "1px solid #f0f0f0",
                        }}
                      >
                        ⌚
                      </div>
                    </Col>
                    <Col flex="auto">
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{item.product.name}</div>
                      <div style={{ fontSize: 12, color: "#999" }}>
                        {item.product.brand} · × {item.quantity}
                      </div>
                    </Col>
                    <Col>
                      <Text strong style={{ color: "#c9a96e", fontSize: 13 }}>
                        {formatPrice(item.price)}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>

            <Divider style={{ margin: "16px 0" }} />

            {/* Total */}
            <Card style={{ background: "#f9fafb", border: "2px solid #c9a96e" }}>
              <Row justify="space-between" style={{ marginBottom: 12 }}>
                <Text>Tạm tính:</Text>
                <Text>{formatPrice(selectedOrder.items.reduce((sum, i) => sum + i.price * i.quantity, 0))}</Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 12 }}>
                <Text>Phí vận chuyển:</Text>
                <Text type="success">{selectedOrder.totalAmount > 5000000 ? "Miễn phí" : formatPrice(50000)}</Text>
              </Row>
              <Divider style={{ margin: "8px 0" }} />
              <Row justify="space-between">
                <Text strong style={{ fontSize: 14 }}>Tổng cộng:</Text>
                <Text strong style={{ fontSize: 14, color: "#c9a96e" }}>
                  {formatPrice(selectedOrder.totalAmount)}
                </Text>
              </Row>
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default OrderManagementPage;
