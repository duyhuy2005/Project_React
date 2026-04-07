# Hệ thống đồng bộ sản phẩm Admin - Khách hàng

## Tổng quan
Hệ thống tự động đồng bộ sản phẩm từ trang quản trị admin sang giao diện khách hàng sử dụng Zustand store với localStorage persistence.

## Cách hoạt động

### 1. Admin thêm/sửa/xóa sản phẩm
- Admin truy cập trang **Quản lý sản phẩm** (`/admin/products`)
- Thêm sản phẩm mới bằng nút "Thêm sản phẩm"
- Chỉnh sửa hoặc xóa sản phẩm hiện có
- Tất cả thay đổi được lưu vào `productStore` và tự động persist vào localStorage

### 2. Đồng bộ tự động
- `productStore` sử dụng Zustand persist middleware
- Dữ liệu được lưu vào localStorage với key: `chronos-product-storage`
- Mọi thay đổi từ admin được lưu ngay lập tức

### 3. Khách hàng nhận thông báo
- Component `NewProductNotification` theo dõi thay đổi trong productStore
- Khi phát hiện sản phẩm mới, hiển thị notification popup với:
  - 🎉 Tiêu đề: "Sản phẩm mới đã được thêm!"
  - Tên sản phẩm
  - Hình ảnh sản phẩm
  - Thương hiệu
  - Giá bán
- Notification tự động đóng sau 5 giây

### 4. Hiển thị sản phẩm
- Trang **Sản phẩm** (`/products`) tự động cập nhật danh sách
- Trang **Trang chủ** (`/`) hiển thị sản phẩm mới nhất
- Không cần refresh trang

## Các file liên quan

### Store
- `src/stores/productStore.ts` - Zustand store quản lý sản phẩm với persist

### Components
- `src/components/customer/NewProductNotification.tsx` - Thông báo sản phẩm mới
- `src/components/layout/MainLayout.tsx` - Layout chứa notification component

### Pages
- `src/pages/admin/ProductManagementPage.tsx` - Trang quản lý sản phẩm admin
- `src/pages/ProductsPage.tsx` - Trang danh sách sản phẩm khách hàng
- `src/pages/HomePage.tsx` - Trang chủ hiển thị sản phẩm

## Luồng dữ liệu

```
Admin thêm sản phẩm
    ↓
ProductManagementPage gọi addProduct()
    ↓
productStore cập nhật state
    ↓
Zustand persist lưu vào localStorage
    ↓
NewProductNotification phát hiện thay đổi
    ↓
Hiển thị notification cho khách hàng
    ↓
ProductsPage tự động cập nhật danh sách
```

## Tính năng

✅ Đồng bộ real-time giữa admin và khách hàng
✅ Lưu trữ persistent trong localStorage
✅ Thông báo popup khi có sản phẩm mới
✅ Tự động cập nhật danh sách sản phẩm
✅ Không cần refresh trang
✅ Hiển thị hình ảnh và thông tin sản phẩm trong notification

## LocalStorage Key
- `chronos-product-storage` - Lưu trữ danh sách sản phẩm

## Demo
1. Mở trang admin: `http://localhost:5173/admin/products`
2. Mở trang khách hàng ở tab khác: `http://localhost:5173/products`
3. Thêm sản phẩm mới ở trang admin
4. Xem notification xuất hiện ở trang khách hàng
5. Danh sách sản phẩm tự động cập nhật
