import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Select,
  Input,
  Slider,
  Checkbox,
  Tag,
  Breadcrumb,
  Collapse,
  Button,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { products, categories, brands, formatPrice } from "../data/products";
import ProductCard from "../components/product/ProductCard";

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCat);
  const [brand, setBrand] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 40000000]);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }
    if (brand !== "all") {
      result = result.filter((p) => p.brand === brand);
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [search, category, brand, priceRange, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setBrand("all");
    setPriceRange([0, 40000000]);
    setSortBy("default");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      {/* Breadcrumb */}
      <Breadcrumb
        className="mb-6"
        items={[
          {
            title: (
              <Link to="/">
                <HomeOutlined /> Trang chủ
              </Link>
            ),
          },
          { title: "Sản phẩm" },
        ]}
      />

      <Row gutter={[24, 24]}>
        {/* ===== SIDEBAR FILTERS ===== */}
        <Col xs={24} md={6}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary m-0 flex items-center gap-2">
                <FilterOutlined className="text-accent" /> Bộ lọc
              </h3>
              <Button type="link" size="small" onClick={clearFilters} className="!text-accent">
                Xóa lọc
              </Button>
            </div>

            {/* Search */}
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 !rounded-lg"
              allowClear
            />

            <Collapse
              defaultActiveKey={["category", "brand", "price"]}
              ghost
              expandIconPosition="end"
              className="!bg-transparent"
              items={[
                {
                  key: "category",
                  label: <span className="font-semibold text-primary">Danh mục</span>,
                  children: (
                    <div className="flex flex-col gap-2">
                      {categories.map((cat) => (
                        <Checkbox
                          key={cat.key}
                          checked={category === cat.key}
                          onChange={() => setCategory(cat.key)}
                          className="!ml-0"
                        >
                          <span className="text-sm">
                            {cat.icon} {cat.label}
                          </span>
                        </Checkbox>
                      ))}
                    </div>
                  ),
                },
                {
                  key: "brand",
                  label: <span className="font-semibold text-primary">Thương hiệu</span>,
                  children: (
                    <div className="flex flex-col gap-2">
                      {brands.map((b) => (
                        <Checkbox
                          key={b.key}
                          checked={brand === b.key}
                          onChange={() => setBrand(b.key)}
                          className="!ml-0"
                        >
                          <span className="text-sm">{b.label}</span>
                        </Checkbox>
                      ))}
                    </div>
                  ),
                },
                {
                  key: "price",
                  label: <span className="font-semibold text-primary">Khoảng giá</span>,
                  children: (
                    <div>
                      <Slider
                        range
                        min={0}
                        max={40000000}
                        step={500000}
                        value={priceRange}
                        onChange={(v) => setPriceRange(v as [number, number])}
                        tooltip={{
                          formatter: (v) => formatPrice(v || 0),
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </Col>

        {/* ===== PRODUCT GRID ===== */}
        <Col xs={24} md={18}>
          {/* Toolbar */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Hiển thị <strong className="text-primary">{filtered.length}</strong> sản phẩm
              </span>
              {category !== "all" && (
                <Tag
                  closable
                  onClose={() => setCategory("all")}
                  className="!rounded-full !bg-accent/10 !text-accent !border-accent/30"
                >
                  {categories.find((c) => c.key === category)?.label}
                </Tag>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 180 }}
                options={[
                  { value: "default", label: "Mặc định" },
                  { value: "price-asc", label: "Giá: Thấp → Cao" },
                  { value: "price-desc", label: "Giá: Cao → Thấp" },
                  { value: "rating", label: "Đánh giá cao nhất" },
                  { value: "newest", label: "Mới nhất" },
                ]}
              />
              <div className="hidden md:flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-accent text-white" : "bg-white text-gray-400"} border-none cursor-pointer transition-colors`}
                >
                  <AppstoreOutlined />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-accent text-white" : "bg-white text-gray-400"} border-none cursor-pointer transition-colors`}
                >
                  <BarsOutlined />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-xl font-semibold text-primary">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-400">Hãy thử thay đổi bộ lọc</p>
              <Button type="primary" onClick={clearFilters} className="mt-4 !rounded-full">
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <Row gutter={[20, 20]}>
              {filtered.map((product) => (
                <Col
                  key={product.id}
                  xs={12}
                  sm={12}
                  md={viewMode === "grid" ? 8 : 24}
                  lg={viewMode === "grid" ? 8 : 24}
                >
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductsPage;
