import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Select,
  Input,
  Slider,
  Tag,
  Breadcrumb,
  Button,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BarsOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { categories, brands, formatPrice } from "../data/products";
import { useProductStore } from "../stores/productStore";
import ProductCard from "../components/product/ProductCard";

const ProductsPage: React.FC = () => {
  const products = useProductStore((state) => state.products);
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

  const activeCat = categories.find((c) => c.key === category);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #fafafa 0%, #ffffff 50%, #f8f9fa 100%)" }}>
      {/* Page Hero Banner */}
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 25%, #3a3a55 50%, #2d2d44 75%, #1a1a2e 100%)',
        minHeight: '320px',
      }}>
        {/* Animated background */}
        <div className="absolute inset-0">
          {/* Gradient orbs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] animate-float" style={{
            background: 'radial-gradient(circle, rgba(201,169,110,0.2) 0%, transparent 70%)',
          }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px]" style={{ 
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite reverse',
          }} />
          
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(201,169,110,0.5) 1px, transparent 1px),
              linear-gradient(0deg, rgba(201,169,110,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-accent/20 rounded-full animate-float" 
              style={{ 
                top: `${20 + i * 15}%`,
                left: `${10 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + i}s`,
              }} 
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-16 relative z-10">
          <Breadcrumb
            className="mb-8"
            items={[
              {
                title: (
                  <Link to="/" className="!text-gray-300 hover:!text-accent transition-colors flex items-center gap-2 text-sm font-medium">
                    <HomeOutlined className="text-base" /> Trang chủ
                  </Link>
                ),
              },
              { title: <span className="text-accent font-bold text-sm">Sản phẩm</span> },
            ]}
          />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2.5 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-5 shadow-lg" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}>
                <StarFilled className="text-accent text-sm" />
                <span className="text-white text-xs font-black uppercase tracking-widest">Chính hãng 100%</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-6xl font-black text-white mb-4 leading-tight" style={{
                textShadow: '0 4px 30px rgba(0,0,0,0.5), 0 0 60px rgba(201,169,110,0.3)',
              }}>
                {activeCat && activeCat.key !== "all" ? (
                  <span className="flex items-center gap-4">
                    <span className="text-6xl drop-shadow-2xl">{activeCat.icon}</span>
                    <span style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e0c891 50%, #ffffff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundSize: '200% auto',
                    }}>
                      {activeCat.label}
                    </span>
                  </span>
                ) : (
                  <span style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0c891 50%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% auto',
                  }}>
                    Bộ sưu tập
                  </span>
                )}
              </h1>
              
              <p className="text-gray-200 text-lg max-w-2xl leading-relaxed font-medium">
                Khám phá <span className="text-accent font-black text-xl px-2 py-1 bg-accent/20 rounded-lg">{filtered.length}</span> mẫu đồng hồ cao cấp từ các thương hiệu danh tiếng thế giới
              </p>
            </div>
            
            <div className="hidden lg:flex flex-col gap-4">
              <div className="glass rounded-2xl px-7 py-5 backdrop-blur-xl border border-white/20 shadow-2xl" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center shadow-lg">
                    <span className="text-3xl drop-shadow-lg">⌚</span>
                  </div>
                  <div>
                    <div className="text-white font-black text-3xl drop-shadow-lg">{products.length}</div>
                    <div className="text-gray-300 text-xs uppercase tracking-widest font-bold">Sản phẩm</div>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-2xl px-7 py-5 backdrop-blur-xl border border-white/20 shadow-2xl" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/30 to-green-500/10 flex items-center justify-center shadow-lg">
                    <span className="text-3xl drop-shadow-lg">✓</span>
                  </div>
                  <div>
                    <div className="text-white font-black text-xl drop-shadow-lg">Miễn phí</div>
                    <div className="text-gray-300 text-xs uppercase tracking-widest font-bold">Vận chuyển</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 py-8">
        <Row gutter={[24, 24]}>
          {/* ===== SIDEBAR FILTERS ===== */}
          <Col xs={24} md={6}>
            <div className="premium-card border-2 border-gray-100" style={{
              position: 'sticky',
              top: '100px',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: 0,
              background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.1)',
            }}>
              {/* Header with subtle gradient */}
              <div style={{
                background: 'linear-gradient(135deg, #2d2d44 0%, #3a3a55 100%)',
                padding: '20px 24px',
                borderRadius: '16px 16px 0 0',
              }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white m-0 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/30 backdrop-blur-sm flex items-center justify-center shadow-lg border border-accent/20">
                      <FilterOutlined className="text-accent text-base" />
                    </div>
                    <span>Bộ lọc</span>
                  </h3>
                  <Button 
                    type="text" 
                    size="small" 
                    onClick={clearFilters} 
                    className="!text-white/80 !text-sm !font-bold hover:!bg-white/10 hover:!text-white"
                    style={{
                      borderRadius: 8,
                      padding: '4px 12px',
                    }}
                  >
                    Xóa tất cả
                  </Button>
                </div>
              </div>

              {/* Content with padding */}
              <div style={{ padding: '24px' }}>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <SearchOutlined className="text-accent" />
                  Tìm kiếm
                </label>
                <Input
                  placeholder="Tìm theo tên, thương hiệu..."
                  prefix={<SearchOutlined className="text-accent" />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="!rounded-xl !bg-white !border-2 !border-gray-200 hover:!border-accent focus:!border-accent !h-12 !text-base !shadow-sm"
                  allowClear
                  style={{
                    transition: 'all 0.3s ease',
                  }}
                />
              </div>

              {/* Stats badge */}
              <div className="mb-6 p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                      <span className="text-accent font-bold text-sm">{filtered.length}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Kết quả tìm thấy</span>
                  </div>
                  <span className="text-xs text-accent font-bold">✓</span>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2 pb-2 border-b-2 border-gray-100">
                  <span className="text-xl">📂</span>
                  Danh mục
                </h4>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => {
                    const isSelected = category === cat.key;
                    const count = cat.key === "all" ? products.length : products.filter(p => p.category === cat.key).length;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => {
                          console.log('Category clicked:', cat.key);
                          setCategory(cat.key);
                        }}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all text-sm font-semibold border-2 text-left w-full ${
                          isSelected
                            ? "bg-gradient-to-r from-accent/15 to-accent/5 text-accent border-accent/40 shadow-md"
                            : "text-gray-600 hover:bg-gray-50 border-gray-100 hover:border-accent/30 bg-white hover:shadow-sm"
                        }`}
                        style={{
                          transform: isSelected ? 'translateX(4px)' : 'translateX(0)',
                        }}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="flex-1">{cat.label}</span>
                        <span className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
                          isSelected 
                            ? 'bg-accent text-white shadow-sm' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {count}
                        </span>
                        {isSelected && (
                          <span className="text-accent font-bold text-xl">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2 pb-2 border-b-2 border-gray-100">
                  <span className="text-xl">🏷️</span>
                  Thương hiệu
                </h4>
                <div className="flex flex-col gap-2">
                  {brands.map((b) => {
                    const isSelected = brand === b.key;
                    return (
                      <button
                        key={b.key}
                        type="button"
                        onClick={() => {
                          console.log('Brand clicked:', b.key);
                          setBrand(b.key);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm border text-left w-full ${
                          isSelected
                            ? "bg-gradient-to-r from-accent/15 to-accent/5 text-accent border-accent/40 font-bold shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 border-gray-100 hover:border-accent/30 bg-white font-medium"
                        }`}
                        style={{
                          transform: isSelected ? 'translateX(4px)' : 'translateX(0)',
                        }}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-accent border-accent shadow-sm' 
                            : 'bg-white border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1 5L4 8L9 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className="flex-1">{b.label}</span>
                        {isSelected && <span className="text-accent font-bold text-sm">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2 pb-2 border-b-2 border-gray-100">
                  <span className="text-xl">💰</span>
                  Khoảng giá
                </h4>
                <div className="pt-3 px-2">
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
                    className="mb-6"
                    styles={{
                      track: {
                        background: 'linear-gradient(90deg, #c9a96e, #d4af37)',
                      },
                      tracks: {
                        background: 'linear-gradient(90deg, #c9a96e, #d4af37)',
                      },
                    }}
                  />
                  <div className="flex justify-between gap-3">
                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white px-4 py-3 rounded-xl border-2 border-gray-100 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1 font-semibold">Từ</div>
                      <div className="text-sm font-bold text-accent">{formatPrice(priceRange[0])}</div>
                    </div>
                    <div className="flex items-center text-accent font-bold">→</div>
                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white px-4 py-3 rounded-xl border-2 border-gray-100 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1 font-semibold">Đến</div>
                      <div className="text-sm font-bold text-accent">{formatPrice(priceRange[1])}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </Col>

          {/* ===== PRODUCT GRID ===== */}
          <Col xs={24} md={18}>
            {/* Toolbar */}
            <div className="premium-card p-5 flex flex-wrap items-center justify-between gap-4 mb-6 border-2 border-gray-100">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <span className="text-accent font-bold text-sm">{filtered.length}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    <strong className="text-primary font-bold">{filtered.length}</strong> sản phẩm
                  </span>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {category !== "all" && (
                    <Tag
                      closable
                      onClose={() => setCategory("all")}
                      className="!rounded-full !bg-gradient-to-r !from-accent/10 !to-accent/5 !text-accent !border-accent/30 !text-sm !font-bold !px-4 !py-1"
                    >
                      {categories.find((c) => c.key === category)?.icon} {categories.find((c) => c.key === category)?.label}
                    </Tag>
                  )}
                  {brand !== "all" && (
                    <Tag
                      closable
                      onClose={() => setBrand("all")}
                      className="!rounded-full !bg-gradient-to-r !from-blue-50 !to-blue-100 !text-blue-700 !border-blue-300 !text-sm !font-bold !px-4 !py-1"
                    >
                      🏷️ {brand}
                    </Tag>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 200 }}
                  size="large"
                  className="[&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-2 [&_.ant-select-selector]:!border-gray-100"
                  options={[
                    { value: "default", label: "📌 Mặc định" },
                    { value: "price-asc", label: "💵 Giá: Thấp → Cao" },
                    { value: "price-desc", label: "💰 Giá: Cao → Thấp" },
                    { value: "rating", label: "⭐ Đánh giá cao" },
                    { value: "newest", label: "🆕 Mới nhất" },
                  ]}
                />
                <div className="hidden md:flex border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 ${viewMode === "grid" ? "bg-gradient-to-br from-accent to-accent-dark text-white" : "bg-white text-gray-400 hover:text-accent hover:bg-gray-50"} border-none cursor-pointer transition-all`}
                  >
                    <AppstoreOutlined className="text-base" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 ${viewMode === "list" ? "bg-gradient-to-br from-accent to-accent-dark text-white" : "bg-white text-gray-400 hover:text-accent hover:bg-gray-50"} border-none cursor-pointer transition-all`}
                  >
                    <BarsOutlined className="text-base" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filtered.length === 0 ? (
              <div className="text-center py-32 premium-card border-2 border-dashed border-gray-200">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <span className="text-6xl">🔍</span>
                </div>
                <h3 className="text-2xl font-black text-primary mb-3">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-500 mb-8 text-base max-w-md mx-auto">
                  Rất tiếc, chúng tôi không tìm thấy sản phẩm phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh lại!
                </p>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={clearFilters} 
                  className="!rounded-full !h-14 !px-10 !text-base !font-bold !bg-gradient-to-r !from-accent !to-accent-dark !border-none !shadow-lg hover:!shadow-xl"
                >
                  🔄 Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <Row gutter={[24, 24]}>
                {filtered.map((product, i) => (
                  <Col
                    key={product.id}
                    xs={12}
                    sm={12}
                    md={viewMode === "grid" ? 8 : 24}
                    lg={viewMode === "grid" ? 8 : 24}
                  >
                    <div className="animate-fadeInUp" style={{ animationDelay: `${Math.min(i, 9) * 0.04}s` }}>
                      <ProductCard product={product} />
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductsPage;
