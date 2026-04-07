import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AboutPage from "./pages/AboutPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import ReturnRequestPage from "./pages/ReturnRequestPage";
import CustomerAuthPage from "./pages/CustomerAuthPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/DashboardPage";
import AdminProducts from "./pages/admin/ProductManagementPage";
import AdminOrders from "./pages/admin/OrderManagementPage";
import AdminReturns from "./pages/admin/ReturnManagementPage";
import AdminCustomers from "./pages/admin/CustomerManagementPage";
import AdminCategories from "./pages/admin/CategoriesPage";
import AdminInventory from "./pages/admin/InventoryPage";
import AdminFinance from "./pages/admin/FinancePage";
import AdminReports from "./pages/admin/ReportsPage";
import AdminMarketing from "./pages/admin/MarketingPage";
import AdminCoupons from "./pages/admin/CouponsPage";
import AdminStatistics from "./pages/admin/StatisticsPage";
import AdminSettings from "./pages/admin/SettingsPage";
import "./App.css";

console.log("🔴 App.tsx: Imported successfully");

function App() {
  console.log("🔴 App component: Rendering...");
  
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
          <Route path="/login" element={<CustomerAuthPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
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
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;

