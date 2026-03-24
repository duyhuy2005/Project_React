import { useState } from "react";
import { Layout, Menu, Avatar, Badge, Dropdown, Breadcrumb } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  HomeOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import type { MenuProps } from "antd";
import "../../pages/admin/AdminStyles.css";

const { Sider, Header, Content } = Layout;

const menuItems: MenuProps["items"] = [
  {
    key: "/admin",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/admin/products",
    icon: <ShoppingOutlined />,
    label: "Sản phẩm",
  },
  {
    key: "/admin/orders",
    icon: <FileTextOutlined />,
    label: "Đơn hàng",
  },
  {
    key: "/admin/customers",
    icon: <TeamOutlined />,
    label: "Khách hàng",
  },
  { type: "divider" },
  {
    key: "/admin/statistics",
    icon: <BarChartOutlined />,
    label: "Thống kê",
  },
  {
    key: "/admin/settings",
    icon: <SettingOutlined />,
    label: "Cài đặt",
  },
];

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Sản phẩm",
  "/admin/orders": "Đơn hàng",
  "/admin/customers": "Khách hàng",
  "/admin/statistics": "Thống kê",
  "/admin/settings": "Cài đặt",
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleUserMenuClick = (key: string) => {
    if (key === "settings") navigate("/admin/settings");
    else if (key === "logout") {
      localStorage.removeItem("admin_logged_in");
      navigate("/admin/login");
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    { type: "divider" },
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link to="/">Về trang chủ</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
  ];

  return (
    <Layout className="admin-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        collapsedWidth={80}
        theme="dark"
      >
        <div className="admin-logo">
          <div className="admin-logo-icon">C</div>
          {!collapsed && (
            <div className="admin-logo-text">
              CHRONOS
              <span>Admin Panel</span>
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="admin-sidebar-menu"
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 260, transition: "margin-left 0.2s" }}>
        <Header className="admin-header">
          <div className="admin-header-left">
            <span className="admin-trigger" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
            <Breadcrumb
              items={[
                { title: <HomeOutlined /> },
                { title: breadcrumbMap[location.pathname] || "Admin" },
              ]}
            />
          </div>
          <div className="admin-header-right">
            <Badge count={3} size="small">
              <BellOutlined style={{ fontSize: 20, color: "#666", cursor: "pointer" }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems, onClick: ({ key }) => handleUserMenuClick(key) }} placement="bottomRight" trigger={["click"]}>
              <div className="admin-user-info">
                <Avatar
                  size={36}
                  style={{ background: "linear-gradient(135deg, #c9a96e, #a88a4e)" }}
                  icon={<UserOutlined />}
                />
                {!collapsed && (
                  <div>
                    <span className="admin-user-name">Admin</span>
                    <span className="admin-user-role">Quản trị viên</span>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
