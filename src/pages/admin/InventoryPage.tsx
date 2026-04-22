import { Table, Tag, Progress, Space, Button, Input } from "antd";
import { SearchOutlined, WarningOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./AdminStyles.css";

interface InventoryItem {
  id: number;
  productName: string;
  sku: string;
  stock: number;
  reserved: number;
  available: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

const InventoryPage = () => {
  const [searchText, setSearchText] = useState("");
  const inventory: InventoryItem[] = [
    { id: 1, productName: "Royal Oak Classic Gold", sku: "ROC-001", stock: 15, reserved: 3, available: 12, status: "in-stock" },
    { id: 2, productName: "Submariner Professional", sku: "SUB-002", stock: 8, reserved: 2, available: 6, status: "low-stock" },
    { id: 3, productName: "Speedmaster Moonwatch", sku: "SPD-003", stock: 0, reserved: 0, available: 0, status: "out-of-stock" },
    { id: 4, productName: "Nautilus Steel Blue", sku: "NAU-004", stock: 20, reserved: 5, available: 15, status: "in-stock" },
  ];

  const filteredInventory = inventory.filter(item =>
    item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (name: string, record: InventoryItem) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
          <div style={{ fontSize: 12, color: "#999" }}>SKU: {record.sku}</div>
        </div>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>{stock}</span>
      ),
    },
    {
      title: "Đã đặt",
      dataIndex: "reserved",
      key: "reserved",
      render: (reserved: number) => (
        <span style={{ fontWeight: 600, color: "#ff9800" }}>{reserved}</span>
      ),
    },
    {
      title: "Khả dụng",
      dataIndex: "available",
      key: "available",
      render: (available: number) => (
        <span style={{ fontWeight: 600, color: "#4caf50" }}>{available}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: InventoryItem) => {
        const percentage = (record.available / record.stock) * 100 || 0;
        return (
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            {status === "in-stock" && <Tag color="green">Còn hàng</Tag>}
            {status === "low-stock" && <Tag color="orange" icon={<WarningOutlined />}>Sắp hết</Tag>}
            {status === "out-of-stock" && <Tag color="red">Hết hàng</Tag>}
            <Progress percent={Math.round(percentage)} size="small" status={status === "out-of-stock" ? "exception" : "normal"} />
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý kho hàng</h1>
        <p className="admin-page-subtitle">Theo dõi tồn kho và nhập xuất</p>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <Input
            placeholder="Tìm kiếm sản phẩm hoặc SKU..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button type="primary">Nhập hàng</Button>
        </div>

        <Table columns={columns} dataSource={filteredInventory} rowKey="id" />
      </div>
    </div>
  );
};

export default InventoryPage;
