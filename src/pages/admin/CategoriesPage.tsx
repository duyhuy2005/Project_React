import { Button, Table, Tag, Space, Modal, Form, Input, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./AdminStyles.css";

interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  icon: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Đồng hồ sang trọng", slug: "luxury", productCount: 8, icon: "💎" },
    { id: 2, name: "Đồng hồ thể thao", slug: "sport", productCount: 5, icon: "⚡" },
    { id: 3, name: "Đồng hồ cổ điển", slug: "classic", productCount: 4, icon: "👔" },
    { id: 4, name: "Đồng hồ thông minh", slug: "smart", productCount: 3, icon: "📱" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
    message.success("Đã xóa danh mục!");
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingCategory) {
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...values } : c));
        message.success("Cập nhật danh mục thành công!");
      } else {
        setCategories([...categories, { id: Date.now(), ...values, productCount: 0 }]);
        message.success("Thêm danh mục mới thành công!");
      }
      setIsModalOpen(false);
    });
  };

  const columns = [
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      width: 80,
      render: (icon: string) => <span style={{ fontSize: 32 }}>{icon}</span>,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Category) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
          <div style={{ fontSize: 12, color: "#999" }}>{record.slug}</div>
        </div>
      ),
    },
    {
      title: "Số sản phẩm",
      dataIndex: "productCount",
      key: "productCount",
      render: (count: number) => (
        <Tag color="blue" style={{ fontSize: 13, fontWeight: 600 }}>{count} sản phẩm</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_: unknown, record: Category) => (
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
        <h1 className="admin-page-title">Quản lý danh mục</h1>
        <p className="admin-page-subtitle">{categories.length} danh mục sản phẩm</p>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar-left" />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm danh mục
          </Button>
        </div>

        <Table columns={columns} dataSource={categories} rowKey="id" pagination={false} />
      </div>

      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText={editingCategory ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="icon" label="Icon" rules={[{ required: true }]}>
            <Input placeholder="💎" />
          </Form.Item>
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
            <Input placeholder="VD: Đồng hồ sang trọng" />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input placeholder="VD: luxury" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
