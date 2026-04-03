import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import { OrderStatusNotification } from "../customer/OrderStatusNotification";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen w-full">
      <OrderStatusNotification />
      <AppHeader />
      <Content className="flex-1 w-full">
        <Outlet />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;
