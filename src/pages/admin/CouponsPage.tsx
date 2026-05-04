import { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Modal, Form, Input, InputNumber, Select, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, GiftOutlined } from "@ant-design/icons";
import { useCouponStore } from "../../stores/couponStore";
import type { Coupon, CreateCouponRequest } from "../../services/couponService";
import "./AdminStyles.css";

const CouponsPage = () => {
  const coupons = useCouponStore((state) => state.coupons);
  const fetchCoupons = useCouponStore((state) => state.fetchCoupons);
  const createCoupon = useCouponStore((state) => state.createCoupon);
  const updateCoupon = useCouponStore((state) => state.updateCoupon);
  const deleteCoupon = useCouponStore((state) => state.deleteCoupon);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (coupons.length === 0) {
      void fetchCoupons();
    }
  }, [coupons.length, fetchCoupons]);

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

  const handleDelete = async (id: number) => {
    await deleteCoupon(id);
    message.success("Đã xóa mã giảm giá");
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const payload: CreateCouponRequest = {
      maCode: String(values.maCode || values.code).toUpperCase(),
      giamGia: Number(values.giamGia ?? values.discount ?? 0),
      loaiGiamGia: values.loaiGiamGia ?? values.type ?? "fixed",
      donHangToiThieu: Number(values.donHangToiThieu ?? values.minOrder ?? 0),
      giamGiaToiDa: values.giamGiaToiDa ?? values.maxDiscount,
      gioiHanSuDung: Number(values.gioiHanSuDung ?? values.usageLimit ?? 0),
      ngayHetHan: values.ngayHetHan ?? values.expiryDate,
      hoatDong: values.hoatDong ?? values.isActive ?? true,
    };

    if (editingCoupon) {
      await updateCoupon(editingCoupon.id, { ...editingCoupon, ...payload });
      message.success("Cập nhật mã giảm giá thành công");
    } else {
      await createCoupon(payload);
      message.success("Tạo mã giảm giá thành công");
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Mã giảm giá",
      dataIndex: "maCode",
      key: "maCode",
      render: (code: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GiftOutlined style={{ color: "#c9a96e", fontSize: 18 }} />
          <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{code}</span>
        </div>
      ),
    },
    {
      title: "Giảm",
      dataIndex: "giamGia",
      key: "giamGia",
      render: (value: number, record: Coupon) => (
        <span>{record.loaiGiamGia === "percent" ? `${value}%` : `${new Intl.NumberFormat("vi-VN").format(value)}₫`}</span>
      ),
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "donHangToiThieu",
      key: "donHangToiThieu",
      render: (amount: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount),
    },
    {
      title: "Sử dụng",
      key: "usage",
      render: (_: unknown, record: Coupon) => `${record.soLanDaSuDung} / ${record.gioiHanSuDung ?? 0}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "hoatDong",
      key: "hoatDong",
      render: (active: boolean) => <Tag color={active ? "green" : "red"}>{active ? "Hoạt động" : "Tạm dừng"}</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, record: Coupon) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => void handleDelete(record.id)} />
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
        onOk={() => void handleSave()}
        onCancel={() => setIsModalOpen(false)}
        okText={editingCoupon ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="maCode" label="Mã giảm giá" rules={[{ required: true }]}>
            <Input placeholder="WELCOME10" style={{ textTransform: "uppercase" }} />
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item name="loaiGiamGia" label="Loại giảm giá" rules={[{ required: true }]}>
              <Select options={[{ value: "percent", label: "Phần trăm" }, { value: "fixed", label: "Số tiền cố định" }]} />
            </Form.Item>
            <Form.Item name="giamGia" label="Giá trị giảm" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="donHangToiThieu" label="Đơn tối thiểu" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="gioiHanSuDung" label="Giới hạn sử dụng" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>
          </div>
          <Form.Item name="ngayHetHan" label="Ngày hết hạn">
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponsPage;
