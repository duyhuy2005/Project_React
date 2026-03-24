import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Drawer,
  Descriptions,
  Typography,
  Timeline,
  message,
  Divider,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CloseCircleOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { orders as initialOrders, orderStatusConfig } from "../../data/adminData";
import type { Order, OrderStatus } from "../../data/adminData";
import { formatPrice } from "../../data/products";
import "./AdminStyles.css";

const { Text } = Typography;

const OrderManagementPage = () => {
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orderList.filter((o) => {
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
    setOrderList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
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
        <p className="admin-page-subtitle">{orderList.length} đơn hàng</p>
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
              const count = orderList.filter((o) => o.status === key).length;
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
          <span style={{ fontSize: 16, fontWeight: 700 }}>
            Chi tiết đơn hàng {selectedOrder?.id}
          </span>
        }
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        styles={{ wrapper: { width: 520 } }}
      >
        {selectedOrder && (
          <div>
            {/* Status */}
            <div style={{ marginBottom: 24 }}>
              <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
                Trạng thái đơn hàng
              </Text>
              <Tag
                color={orderStatusConfig[selectedOrder.status].color}
                style={{ fontSize: 14, padding: "4px 16px" }}
              >
                {orderStatusConfig[selectedOrder.status].label}
              </Tag>
              {selectedOrder.status !== "completed" && selectedOrder.status !== "cancelled" && (
                <Space style={{ marginLeft: 12 }}>
                  {getNextStatus(selectedOrder.status) && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() =>
                        handleUpdateStatus(
                          selectedOrder.id,
                          getNextStatus(selectedOrder.status)!
                        )
                      }
                    >
                      → {orderStatusConfig[getNextStatus(selectedOrder.status)!].label}
                    </Button>
                  )}
                  <Button
                    danger
                    size="small"
                    onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                  >
                    Hủy đơn
                  </Button>
                </Space>
              )}
            </div>

            {/* Timeline */}
            <div style={{ marginBottom: 24 }}>{statusTimeline(selectedOrder.status)}</div>

            <Divider />

            {/* Customer Info */}
            <Descriptions
              title="Thông tin khách hàng"
              column={1}
              size="small"
              labelStyle={{ fontWeight: 600, color: "#666" }}
            >
              <Descriptions.Item label="Họ tên">{selectedOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrder.customerEmail}</Descriptions.Item>
              <Descriptions.Item label="SĐT">{selectedOrder.customerPhone}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{selectedOrder.address}</Descriptions.Item>
              {selectedOrder.note && (
                <Descriptions.Item label="Ghi chú">
                  <Text type="warning">{selectedOrder.note}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            {/* Items */}
            <div>
              <Text strong style={{ fontSize: 14, display: "block", marginBottom: 12 }}>
                <ShoppingOutlined style={{ marginRight: 8 }} />
                Sản phẩm ({selectedOrder.items.length})
              </Text>
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom:
                      idx < selectedOrder.items.length - 1
                        ? "1px solid #f0f0f0"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      background: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    ⌚
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{item.product.name}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>
                      {item.product.brand} × {item.quantity}
                    </div>
                  </div>
                  <Text strong style={{ color: "#c9a96e" }}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </div>
              ))}
            </div>

            <Divider />

            {/* Total */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "#f8f9fa",
                borderRadius: 12,
              }}
            >
              <Text strong style={{ fontSize: 15 }}>
                Tổng cộng
              </Text>
              <Text strong style={{ fontSize: 20, color: "#c9a96e" }}>
                {formatPrice(selectedOrder.totalAmount)}
              </Text>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default OrderManagementPage;
