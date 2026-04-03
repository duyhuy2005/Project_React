import React, { useState, useEffect, useRef } from "react";
import { Layout, Badge, Dropdown, Button, Drawer, Menu, Avatar } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
  LoginOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  SettingOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../stores/cartStore";
import { useAuthStore } from "../../stores/authStore";
import { useOrderStore } from "../../stores/orderStore";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const totalItems = useCartStore((state) => state.totalItems);
  const { user, isLoggedIn, logout } = useAuthStore();
  const orders = useOrderStore((state) => state.orders);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasNewUpdate, setHasNewUpdate] = useState(false);
  const prevOrdersRef = useRef<typeof orders>([]);

  // Theo dõi thay đổi trạng thái đơn hàng
  useEffect(() => {
    if (!user) {
      setHasNewUpdate(false);
      return;
    }

    const userOrders = orders.filter(o => o.customerEmail === user.email);
    const prevUserOrders = prevOrdersRef.current.filter(o => o.customerEmail === user.email);

    // Kiểm tra có đơn hàng nào thay đổi trạng thái không
    const hasUpdate = userOrders.some(order => {
      const prevOrder = prevUserOrders.find(o => o.id === order.id);
      return prevOrder && prevOrder.status !== order.status;
    });

    if (hasUpdate) {
      setHasNewUpdate(true);
    }

    prevOrdersRef.current = orders;
  }, [orders, user]);

  const handleMenuClick = (key: string) => {
    if (key === "logout") {
      logout();
      navigate("/");
    } else if (key === "login") {
      navigate("/login");
    } else if (key === "admin") {
      navigate("/admin");
    } else if (key === "orders") {
      setHasNewUpdate(false); // Clear badge khi xem đơn hàng
      navigate("/order-tracking");
    }
  };

  const loggedInMenuItems = [
    {
      key: "user-info",
      label: (
        <div style={{ padding: "4px 0", borderBottom: "1px solid #f0f0f0", marginBottom: 4 }}>
          <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 14 }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: "#999" }}>{user?.email}</div>
        </div>
      ),
      disabled: true,
    },
    { key: "orders", icon: <ShoppingOutlined />, label: "Đơn hàng của tôi" },
    { key: "settings", icon: <SettingOutlined />, label: "Cài đặt" },
    ...(user?.role === "admin"
      ? [{ key: "admin", icon: <SettingOutlined />, label: "Quản trị Admin" }]
      : []),
    { type: "divider" as const },
    { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true },
  ];

  return (
    <>
      <Header style={{ 
        background: '#fff',
        padding: 0,
        height: 'auto',
        lineHeight: 'normal',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div className="container mx-auto px-6 sm:px-12 lg:px-20 xl:px-28 max-w-[1600px]">
          <div className="flex items-center justify-between py-4">
            {/* Mobile menu button */}
            <Button
              type="text"
              icon={<MenuOutlined className="text-xl" />}
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            />

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 no-underline">
              <div style={{
                fontSize: 28,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #c9a96e 0%, #e0c891 50%, #c9a96e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '2px',
              }}>
                ⌚ LUXURY WATCH
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-gray-700 font-semibold hover:text-[#c9a96e] transition-colors">
                Trang chủ
              </Link>
              <Link to="/products" className="text-gray-700 font-semibold hover:text-[#c9a96e] transition-colors">
                Sản phẩm
              </Link>
              <Link to="/products?cat=luxury" className="text-gray-700 font-semibold hover:text-[#c9a96e] transition-colors">
                Cao cấp
              </Link>
              <Link to="/products?cat=sport" className="text-gray-700 font-semibold hover:text-[#c9a96e] transition-colors">
                Thể thao
              </Link>
              <Link to="/about" className="text-gray-700 font-semibold hover:text-[#c9a96e] transition-colors">
                Giới thiệu
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                type="text"
                icon={<SearchOutlined className="text-lg" />}
                className="!w-10 !h-10 hover:!bg-gray-100"
              />

              {isLoggedIn && (
                <Badge dot={hasNewUpdate} offset={[-4, 4]}>
                  <Button
                    type="text"
                    icon={<BellOutlined className="text-lg" />}
                    onClick={() => {
                      setHasNewUpdate(false);
                      navigate("/order-tracking");
                    }}
                    className="!w-10 !h-10 hover:!bg-gray-100"
                  />
                </Badge>
              )}

              {isLoggedIn ? (
                <Dropdown
                  menu={{
                    items: loggedInMenuItems,
                    onClick: ({ key }) => handleMenuClick(key),
                  }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="hidden md:flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-100">
                    <Avatar
                      size={32}
                      style={{
                        background: user?.role === "admin"
                          ? "linear-gradient(135deg, #c9a96e, #d4af37)"
                          : `hsl(${(user?.id || 0) * 60 % 360}, 60%, 60%)`,
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </div>
                </Dropdown>
              ) : (
                <Button
                  type="text"
                  icon={<UserOutlined className="text-lg" />}
                  onClick={() => navigate("/login")}
                  className="hidden md:inline-flex !w-10 !h-10 hover:!bg-gray-100"
                />
              )}

              <Badge count={totalItems} size="small" offset={[-4, 4]}>
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined className="text-xl" />}
                  onClick={() => navigate("/cart")}
                  className="!w-10 !h-10 hover:!bg-gray-100"
                />
              </Badge>
            </div>
          </div>
        </div>
      </Header>

      {/* Mobile drawer */}
      <Drawer
        title="⌚ LUXURY WATCH"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        styles={{ wrapper: { width: 280 } }}
      >
        {isLoggedIn ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background: "#f8f9fa",
            borderRadius: 12,
            marginBottom: 16,
          }}>
            <Avatar
              size={40}
              style={{
                background: `hsl(${(user?.id || 0) * 60 % 360}, 60%, 60%)`,
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: "#999" }}>{user?.email}</div>
            </div>
          </div>
        ) : (
          <Button
            type="primary"
            block
            icon={<LoginOutlined />}
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/login");
            }}
            style={{ marginBottom: 16, height: 42, borderRadius: 10 }}
          >
            Đăng nhập / Đăng ký
          </Button>
        )}

        <Menu
          mode="vertical"
          items={[
            { key: "/", label: <Link to="/" onClick={() => setMobileMenuOpen(false)}>TRANG CHỦ</Link> },
            { key: "/products", label: <Link to="/products" onClick={() => setMobileMenuOpen(false)}>SẢN PHẨM</Link> },
            { key: "/products?cat=luxury", label: <Link to="/products?cat=luxury" onClick={() => setMobileMenuOpen(false)}>CAO CẤP</Link> },
            { key: "/products?cat=sport", label: <Link to="/products?cat=sport" onClick={() => setMobileMenuOpen(false)}>THỂ THAO</Link> },
            { key: "/about", label: <Link to="/about" onClick={() => setMobileMenuOpen(false)}>GIỚI THIỆU</Link> },
          ]}
          className="border-none"
        />

        {isLoggedIn && (
          <>
            <div style={{ borderTop: "1px solid #f0f0f0", margin: "12px 0" }} />
            <Button
              type="text"
              danger
              block
              icon={<LogoutOutlined />}
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
                navigate("/");
              }}
              style={{ textAlign: "left", height: 42 }}
            >
              Đăng xuất
            </Button>
          </>
        )}
      </Drawer>
    </>
  );
};

export default AppHeader;
