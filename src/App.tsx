import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ConfigProvider, Spin } from "antd";
import viVN from "antd/locale/vi_VN";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import { AdminOnlyRoute, GuestOnlyRoute } from "./components/auth/RouteGuards";
import "./App.css";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const OrderTrackingPage = lazy(() => import("./pages/OrderTrackingPage"));
const ReturnRequestPage = lazy(() => import("./pages/ReturnRequestPage"));
const CustomerAuthPage = lazy(() => import("./pages/CustomerAuthPage"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/DashboardPage"));
const AdminProducts = lazy(() => import("./pages/admin/ProductManagementPage"));
const AdminOrders = lazy(() => import("./pages/admin/OrderManagementPage"));
const AdminReturns = lazy(() => import("./pages/admin/ReturnManagementPage"));
const AdminCustomers = lazy(() => import("./pages/admin/CustomerManagementPage"));
const AdminCategories = lazy(() => import("./pages/admin/CategoriesPage"));
const AdminInventory = lazy(() => import("./pages/admin/InventoryPage"));
const AdminFinance = lazy(() => import("./pages/admin/FinancePage"));
const AdminReports = lazy(() => import("./pages/admin/ReportsPage"));
const AdminMarketing = lazy(() => import("./pages/admin/MarketingPage"));
const AdminCoupons = lazy(() => import("./pages/admin/CouponsPage"));
const AdminStatistics = lazy(() => import("./pages/admin/StatisticsPage"));
const AdminSettings = lazy(() => import("./pages/admin/SettingsPage"));

function App() {
  
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: "#c9a96e",
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
              <Spin size="large" />
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/order-tracking" element={<OrderTrackingPage />} />
              <Route path="/return-request" element={<ReturnRequestPage />} />
            </Route>

            {/* Auth Pages */}
            <Route
              path="/login"
              element={
                <GuestOnlyRoute>
                  <CustomerAuthPage />
                </GuestOnlyRoute>
              }
            />
            <Route
              path="/admin/login"
              element={
                <GuestOnlyRoute>
                  <AdminLoginPage />
                </GuestOnlyRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              element={
                <AdminOnlyRoute>
                  <AdminLayout />
                </AdminOnlyRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/returns" element={<AdminReturns />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/inventory" element={<AdminInventory />} />
              <Route path="/admin/finance" element={<AdminFinance />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/marketing" element={<AdminMarketing />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/statistics" element={<AdminStatistics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
