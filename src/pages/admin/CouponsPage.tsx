import { Table, Tag, Button, Space, Modal, Form, Input, InputNumber, Select, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./AdminStyles.css";

interface Coupon {
  id: number;
  code: string;
  discount: number;
  type: "percent" | "fixed";
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  used: number;
  status: "active" | "inactive" | "expired";
  expiryDate: string;
}

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: 1, code: "WELCOME10", discount: 10, type: "percent", minOrder: 0, usageLimit: 100, used: 45, status: "active", expiryDate: "2026-12-31" },
    { id: 2, code: "SUMMER500K", discount: 500000, type: "fixed", minOrder: 5000000, usageLimit: 50, used: 12, status: "active", expiryDate: "2026-08-31" },
    { id: 3, code: "VIP20", discount: 20, type: "percent", minOrder: 10000000, maxDiscount: 2000000, usageLimit: 20, used: 8, status: "active", expiryDate: "2026-12-31" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingCoupon(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    form.setFieldsValue(coupon);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setCoupons(coupons.filter(c => c.id !== id));
    message.success("Đã xóa mã giảm giá!");
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingCoupon) {
        setCoupons(coupons.map(c => c.id === editingCoupon.id ? { ...c, ...values } : c));
        message.success("Cập nhật mã giảm giá thành công!");
      } else {
        setCoupons([...coupons, { id: Date.now(), ...values, used: 0, status: "active" }]);
        message.success("Thêm mã giảm giá mới thành công!");
      }
      setIsModalOpen(false);
    });
  };

  const columns = [
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
      render: (code: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GiftOutlined style={{ color: "#c9a96e", fontSize: 18 }} />
          <span style={{ fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>{code}</span>
        </div>
      ),
    },
    {
      title: "Giảm giá",
      key: "discount",
      render: (_: unknown, record: Coupon) => (
        <span style={{ fontWeight: 600, color: "#4caf50" }}>
          {record.type === "percent" ? `${record.discount}%` : `${new Intl.NumberFormat('vi-VN').format(record.discount)}₫`}
        </span>
      ),
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "minOrder",
      key: "minOrder",
      render: (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount),
    },
    {
      title: "Sử dụng",
      key: "usage",
      render: (_: unknown, record: Coupon) => (
        <span style={{ fontSize: 13 }}>
          <span style={{ fontWeight: 700, color: "#2196f3" }}>{record.used}</span>
          <span style={{ color: "#999" }}> / {record.usageLimit}</span>
        </span>
      ),
    },
    {
      title: "Hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = { active: "green", inactive: "orange", expired: "red" };
        const labels = { active: "Hoạt động", inactive: "Tạm dừng", expired: "Hết hạn" };
        return <Tag color={colors[status as keyof typeof colors]}>{labels[status as keyof typeof labels]}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_: unknown, record: Coupon) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý mã giảm giá</h1>
        <p className="admin-page-subtitle">{coupons.length} mã giảm giá</p>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar-left" />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Tạo mã giảm giá
          </Button>
        </div>

        <Table columns={columns} dataSource={coupons} rowKey="id" />
      </div>

      <Modal
        title={editingCoupon ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText={editingCoupon ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="code" label="Mã giảm giá" rules={[{ required: true }]}>
            <Input placeholder="VD: WELCOME10" style={{ textTransform: "uppercase" }} />
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="type" label="Loại giảm giá" rules={[{ required: true }]}>
              <Select options={[
                { value: "percent", label: "Phần trăm (%)" },
                { value: "fixed", label: "Số tiền cố định (₫)" },
              ]} />
            </Form.Item>
            <Form.Item name="discount" label="Giá trị giảm" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} placeholder="VD: 10 hoặc 500000" />
            </Form.Item>
            <Form.Item name="minOrder" label="Đơn tối thiểu" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
            <Form.Item name="usageLimit" label="Giới hạn sử dụng" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
          </div>
          <Form.Item name="expiryDate" label="Ngày hết hạn" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponsPage;
