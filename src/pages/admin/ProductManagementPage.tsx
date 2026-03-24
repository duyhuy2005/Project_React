import { useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Form,
  InputNumber,
  message,
  Popconfirm,
  Image,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  StarFilled,
} from "@ant-design/icons";
import { products as initialProducts, formatPrice, categories, brands } from "../../data/products";
import type { Product } from "../../data/products";
import "./AdminStyles.css";

const ProductManagementPage = () => {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const filteredProducts = productList.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = filterCategory === "all" || p.category === filterCategory;
    const matchBrand = filterBrand === "all" || p.brand === filterBrand;
    return matchSearch && matchCategory && matchBrand;
  });

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      description: product.description,
      image: product.image,
      movement: product.specs.movement,
      caseMaterial: product.specs.caseMaterial,
      caseSize: product.specs.caseSize,
      waterResistance: product.specs.waterResistance,
      crystal: product.specs.crystal,
      strap: product.specs.strap,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    message.success("Đã xóa sản phẩm thành công!");
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const productData: Product = {
        id: editingProduct?.id || Date.now(),
        name: values.name,
        brand: values.brand,
        price: values.price,
        originalPrice: values.originalPrice,
        image: values.image || "/images/watch1.png",
        category: values.category,
        description: values.description || "",
        rating: editingProduct?.rating || 4.5,
        reviews: editingProduct?.reviews || 0,
        specs: {
          movement: values.movement || "",
          caseMaterial: values.caseMaterial || "",
          caseSize: values.caseSize || "",
          waterResistance: values.waterResistance || "",
          crystal: values.crystal || "",
          strap: values.strap || "",
        },
      };

      if (editingProduct) {
        setProductList((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? productData : p))
        );
        message.success("Cập nhật sản phẩm thành công!");
      } else {
        setProductList((prev) => [...prev, productData]);
        message.success("Thêm sản phẩm mới thành công!");
      }
      setIsModalOpen(false);
    });
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: 72,
      render: (image: string) => (
        <Image
          src={image}
          alt="product"
          className="product-image-cell"
          width={48}
          height={48}
          fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjI0IiB5PSIyOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2NjYyIgZm9udC1zaXplPSIxMiI+8J+VsDwvdGV4dD48L3N2Zz4="
          preview={false}
          style={{ borderRadius: 10, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
      render: (name: string, record: Product) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>{name}</div>
          <div style={{ fontSize: 12, color: "#999" }}>{record.brand}</div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a: Product, b: Product) => a.price - b.price,
      render: (price: number, record: Product) => (
        <div>
          <div style={{ fontWeight: 700, color: "#c9a96e", fontSize: 14 }}>
            {formatPrice(price)}
          </div>
          {record.originalPrice && (
            <div
              style={{
                fontSize: 12,
                color: "#999",
                textDecoration: "line-through",
              }}
            >
              {formatPrice(record.originalPrice)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      filters: categories.filter((c) => c.key !== "all").map((c) => ({ text: c.label, value: c.key })),
      onFilter: (value: unknown, record: Product) => record.category === (value as string),
      render: (cat: string) => {
        const found = categories.find((c) => c.key === cat);
        return (
          <Tag color={cat === "luxury" ? "gold" : cat === "sport" ? "blue" : cat === "classic" ? "purple" : "green"}>
            {found?.icon} {found?.label}
          </Tag>
        );
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      sorter: (a: Product, b: Product) => a.rating - b.rating,
      render: (rating: number, record: Product) => (
        <Space size={4}>
          <StarFilled style={{ color: "#fadb14", fontSize: 14 }} />
          <span style={{ fontWeight: 600, fontSize: 13 }}>{rating}</span>
          <span style={{ color: "#999", fontSize: 12 }}>({record.reviews})</span>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: unknown, record: Product) => (
        <Space size={4}>
          {record.isNew && <Tag color="cyan">Mới</Tag>}
          {record.isBestSeller && <Tag color="orange">Bán chạy</Tag>}
          {!record.isNew && !record.isBestSeller && <Tag>Bình thường</Tag>}
        </Space>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: "#4f46e5" }}
          />
          <Popconfirm
            title="Xóa sản phẩm?"
            description="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Quản lý sản phẩm</h1>
        <p className="admin-page-subtitle">
          {productList.length} sản phẩm trong kho
        </p>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar-left">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined style={{ color: "#999" }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
            <Select
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: 140 }}
              options={categories.map((c) => ({
                value: c.key,
                label: `${c.icon} ${c.label}`,
              }))}
            />
            <Select
              value={filterBrand}
              onChange={setFilterBrand}
              style={{ width: 140 }}
              options={brands.map((b) => ({ value: b.key, label: b.label }))}
            />
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm sản phẩm
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{
            pageSize: 6,
            showTotal: (total) => `Tổng ${total} sản phẩm`,
            showSizeChanger: false,
          }}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText={editingProduct ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input placeholder="VD: Royal Oak Classic Gold" />
            </Form.Item>
            <Form.Item
              name="brand"
              label="Thương hiệu"
              rules={[{ required: true, message: "Vui lòng chọn thương hiệu!" }]}
            >
              <Select
                placeholder="Chọn thương hiệu"
                options={brands
                  .filter((b) => b.key !== "all")
                  .map((b) => ({ value: b.key, label: b.label }))}
              />
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá bán (VNĐ)"
              rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => Number(value?.replace(/,/g, "")) as unknown as 0}
                min={0}
                placeholder="VD: 12500000"
              />
            </Form.Item>
            <Form.Item name="originalPrice" label="Giá gốc (VNĐ)">
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => Number(value?.replace(/,/g, "")) as unknown as 0}
                min={0}
                placeholder="Để trống nếu không giảm giá"
              />
            </Form.Item>
            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            >
              <Select
                placeholder="Chọn danh mục"
                options={categories
                  .filter((c) => c.key !== "all")
                  .map((c) => ({ value: c.key, label: `${c.icon} ${c.label}` }))}
              />
            </Form.Item>
            <Form.Item name="image" label="URL ảnh">
              <Input placeholder="/images/watch1.png" />
            </Form.Item>
          </div>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả sản phẩm..." />
          </Form.Item>

          <div
            style={{
              background: "#f8f9fa",
              borderRadius: 12,
              padding: "16px",
              marginTop: 8,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>
              Thông số kỹ thuật
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Form.Item name="movement" label="Bộ máy">
                <Input placeholder="VD: Automatic" />
              </Form.Item>
              <Form.Item name="caseMaterial" label="Chất liệu vỏ">
                <Input placeholder="VD: Thép không gỉ" />
              </Form.Item>
              <Form.Item name="caseSize" label="Kích thước">
                <Input placeholder="VD: 42mm" />
              </Form.Item>
              <Form.Item name="waterResistance" label="Chống nước">
                <Input placeholder="VD: 100m" />
              </Form.Item>
              <Form.Item name="crystal" label="Mặt kính">
                <Input placeholder="VD: Sapphire" />
              </Form.Item>
              <Form.Item name="strap" label="Dây đeo">
                <Input placeholder="VD: Da bê Ý" />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagementPage;
