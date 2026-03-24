import React, { useState } from "react";
import { Layout, Input, Badge, Dropdown, Button, Drawer, Menu } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  HeartOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const { Header } = Layout;

const navLinks = [
  { key: "/", label: "Trang chủ" },
  { key: "/products", label: "Sản phẩm" },
  { key: "/products?cat=luxury", label: "Cao cấp" },
  { key: "/products?cat=sport", label: "Thể thao" },
  { key: "/about", label: "Giới thiệu" },
];

const AppHeader: React.FC = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value.trim())}`);
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  const userMenuItems = [
    { key: "profile", label: "Tài khoản" },
    { key: "orders", label: "Đơn hàng" },
    { key: "wishlist", label: "Yêu thích" },
    { key: "logout", label: "Đăng xuất" },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary text-white text-center py-2.5 text-[11px] tracking-[0.15em] hidden md:block relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
        <span className="relative z-10">
          ✨ MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TỪ 5.000.000₫ &nbsp;&bull;&nbsp; 🔄 ĐỔI TRẢ TRONG 30 NGÀY
        </span>
      </div>

      <Header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.06)] border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between">
          {/* Mobile menu button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="md:hidden text-lg"
            onClick={() => setMobileMenuOpen(true)}
          />

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="w-11 h-11 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(201,169,110,0.3)] group-hover:shadow-[0_4px_25px_rgba(201,169,110,0.5)] transition-shadow">
              <span className="text-white font-bold text-lg">⌚</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary m-0 leading-tight tracking-tight font-display">
                CHRONOS
              </h1>
              <p className="text-[9px] text-accent tracking-[0.25em] m-0 uppercase font-semibold">
                Luxury Watches
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.key}
                className="relative text-[13px] font-semibold text-gray-500 hover:text-primary transition-colors no-underline uppercase tracking-[0.12em] group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-accent to-accent-dark group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              type="text"
              icon={searchOpen ? <CloseOutlined /> : <SearchOutlined />}
              onClick={() => setSearchOpen(!searchOpen)}
              className="!w-10 !h-10 !rounded-full text-gray-500 hover:!text-accent hover:!bg-accent/5 transition-all"
            />
            <Button
              type="text"
              icon={<HeartOutlined />}
              className="hidden md:inline-flex !w-10 !h-10 !rounded-full text-gray-500 hover:!text-red-500 hover:!bg-red-50 transition-all"
            />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button
                type="text"
                icon={<UserOutlined />}
                className="hidden md:inline-flex !w-10 !h-10 !rounded-full text-gray-500 hover:!text-accent hover:!bg-accent/5 transition-all"
              />
            </Dropdown>
            <Badge count={totalItems} size="small" offset={[-4, 4]}>
              <Button
                type="text"
                icon={<ShoppingCartOutlined className="text-lg" />}
                onClick={() => navigate("/cart")}
                className="!w-10 !h-10 !rounded-full text-gray-500 hover:!text-accent hover:!bg-accent/5 transition-all"
              />
            </Badge>
          </div>
        </div>

        {/* Search bar */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            searchOpen ? "max-h-20 py-3 border-t border-gray-100/50" : "max-h-0"
          }`}
        >
          <div className="max-w-xl mx-auto px-4">
            <Input.Search
              placeholder="Tìm kiếm đồng hồ..."
              size="large"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              enterButton
              className="[&_.ant-input]:!rounded-l-full [&_.ant-btn]:!rounded-r-full"
            />
          </div>
        </div>
      </Header>

      {/* Mobile drawer */}
      <Drawer
        title={
          <span className="text-lg font-bold text-primary font-display">CHRONOS</span>
        }
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <Menu
          mode="vertical"
          items={navLinks.map((link) => ({
            key: link.key,
            label: (
              <Link
                to={link.key}
                onClick={() => setMobileMenuOpen(false)}
                className="no-underline font-medium"
              >
                {link.label}
              </Link>
            ),
          }))}
          className="border-none"
        />
      </Drawer>
    </>
  );
};

export default AppHeader;
