import { useEffect, useState } from "react";
import { Button, Table, Tag, Space, Modal, Form, Input, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useCategoryStore } from "../../stores/categoryStore";
import type { Category, CreateCategoryRequest } from "../../services/categoryService";
import "./AdminStyles.css";

const CategoriesPage = () => {
  const categories = useCategoryStore((state) => state.categories);
  const loading = useCategoryStore((state) => state.loading);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const createCategory = useCategoryStore((state) => state.createCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (categories.length === 0) {
      void fetchCategories();
    }
  }, [categories.length, fetchCategories]);

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

  const handleDelete = async (id: number) => {
    await deleteCategory(id);
    message.success("Đã xóa danh mục");
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const payload: CreateCategoryRequest = {
      ten: values.ten,
      slug: values.slug,
      bieuTuong: values.bieuTuong,
      moTa: values.moTa,
      hoatDong: values.hoatDong ?? true,
    };

    if (editingCategory) {
      await updateCategory(editingCategory.id, { ...editingCategory, ...payload } as Category);
      message.success("Cập nhật danh mục thành công");
    } else {
      await createCategory(payload);
      message.success("Tạo danh mục thành công");
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Icon",
      dataIndex: "bieuTuong",
      key: "bieuTuong",
      width: 80,
      render: (icon: string) => <span style={{ fontSize: 32 }}>{icon || "⌚"}</span>,
    },
    {
      title: "Tên danh mục",
      dataIndex: "ten",
      key: "ten",
      render: (name: string, record: Category) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
          <div style={{ fontSize: 12, color: "#999" }}>{record.slug}</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "hoatDong",
      key: "hoatDong",
      render: (active: boolean) => <Tag color={active ? "green" : "red"}>{active ? "Hoạt động" : "Ẩn"}</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_: unknown, record: Category) => (
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
        <h1 className="admin-page-title">Quản lý danh mục</h1>
        <p className="admin-page-subtitle">{categories.length} danh mục</p>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar-left" />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm danh mục
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          locale={{ emptyText: loading ? 'Đang tải danh mục...' : 'Chưa có danh mục nào' }}
        />
      </div>

      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        open={isModalOpen}
        onOk={() => void handleSave()}
        onCancel={() => setIsModalOpen(false)}
        okText={editingCategory ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="bieuTuong" label="Icon" rules={[{ required: true }]}>
            <Input placeholder="⌚" />
          </Form.Item>
          <Form.Item name="ten" label="Tên danh mục" rules={[{ required: true }]}>
            <Input placeholder="Đồng hồ nam" />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input placeholder="dong-ho-nam" />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
