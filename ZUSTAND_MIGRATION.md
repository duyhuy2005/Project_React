# Migration từ Context API sang Zustand

## Tổng quan
Dự án đã được chuyển đổi từ React Context API sang Zustand để quản lý state toàn cục. Zustand cung cấp:
- Performance tốt hơn (không re-render không cần thiết)
- Code đơn giản hơn, dễ maintain
- TypeScript support tốt hơn
- Tích hợp persist middleware để lưu state vào localStorage

## Các Store đã tạo

### 1. Auth Store (`src/stores/authStore.ts`)
Quản lý authentication và user state.

**State:**
- `user`: User object hoặc null
- `isLoggedIn`: Boolean

**Actions:**
- `login(user)`: Đăng nhập
- `logout()`: Đăng xuất
- `register(user)`: Đăng ký

**Sử dụng:**
```typescript
import { useAuthStore } from '../stores/authStore';

// Lấy toàn bộ store
const { user, isLoggedIn, login, logout } = useAuthStore();

// Hoặc chỉ lấy một phần (tối ưu re-render)
const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);
```

### 2. Cart Store (`src/stores/cartStore.ts`)
Quản lý giỏ hàng.

**State:**
- `items`: Mảng CartItem[]
- `totalItems`: Computed - tổng số lượng sản phẩm
- `totalPrice`: Computed - tổng giá trị

**Actions:**
- `addToCart(product)`: Thêm sản phẩm
- `removeFromCart(productId)`: Xóa sản phẩm
- `updateQuantity(productId, quantity)`: Cập nhật số lượng
- `clearCart()`: Xóa toàn bộ giỏ hàng

**Persist:** Có - lưu vào localStorage với key `chronos-cart-storage`

### 3. Product Store (`src/stores/productStore.ts`)
Quản lý danh sách sản phẩm.

**State:**
- `products`: Mảng Product[]

**Actions:**
- `addProduct(product)`: Thêm sản phẩm mới
- `updateProduct(id, product)`: Cập nhật sản phẩm
- `deleteProduct(id)`: Xóa sản phẩm

### 4. Order Store (`src/stores/orderStore.ts`)
Quản lý đơn hàng và yêu cầu trả hàng.

**State:**
- `orders`: Mảng Order[]
- `returnRequests`: Mảng ReturnRequest[]

**Actions:**
- `placeOrder(orderData)`: Tạo đơn hàng mới
- `cancelOrder(orderId)`: Hủy đơn hàng
- `getOrdersByEmail(email)`: Lấy đơn hàng theo email
- `submitReturnRequest(reqData)`: Gửi yêu cầu trả hàng
- `getReturnsByEmail(email)`: Lấy yêu cầu trả hàng theo email

**Persist:** Có - lưu vào localStorage với key `chronos-order-storage`

## Files đã cập nhật

### Components
- `src/components/layout/AppHeader.tsx`
- `src/components/product/ProductCard.tsx`

### Pages
- `src/pages/HomePage.tsx`
- `src/pages/ProductsPage.tsx`
- `src/pages/ProductDetailPage.tsx`
- `src/pages/CartPage.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/pages/CustomerAuthPage.tsx`
- `src/pages/OrderTrackingPage.tsx`
- `src/pages/ReturnRequestPage.tsx`

### Admin Pages
- `src/pages/admin/AdminLoginPage.tsx`
- `src/pages/admin/ProductManagementPage.tsx`

### App
- `src/App.tsx` - Đã xóa tất cả Context Providers

## So sánh cú pháp

### Context API (Cũ)
```typescript
// Provider
<AuthProvider>
  <CartProvider>
    <App />
  </CartProvider>
</AuthProvider>

// Consumer
const { user, login } = useAuth();
const { items, addToCart } = useCart();
```

### Zustand (Mới)
```typescript
// Không cần Provider
<App />

// Consumer - Lấy toàn bộ
const { user, login } = useAuthStore();
const { items, addToCart } = useCartStore();

// Consumer - Lấy từng phần (tối ưu hơn)
const user = useAuthStore((state) => state.user);
const addToCart = useCartStore((state) => state.addToCart);
```

## Lợi ích của Zustand

1. **Không cần Provider wrapper** - Code sạch hơn trong App.tsx
2. **Selective subscription** - Component chỉ re-render khi state cần thiết thay đổi
3. **Đơn giản hơn** - Ít boilerplate code hơn
4. **TypeScript tốt hơn** - Type inference tự động
5. **DevTools** - Tích hợp với Redux DevTools
6. **Middleware** - Dễ dàng thêm persist, immer, devtools

## Testing

Build thành công:
```bash
npm run build
✓ built in 670ms
```

Tất cả TypeScript errors đã được fix.

## Migration checklist

- [x] Tạo 4 Zustand stores (auth, cart, product, order)
- [x] Xóa Context Providers khỏi App.tsx
- [x] Cập nhật tất cả imports từ context sang stores
- [x] Cập nhật tất cả hook calls
- [x] Fix TypeScript errors
- [x] Fix unused imports
- [x] Build thành công
- [x] Tạo documentation

## Lưu ý

- Các Context files cũ vẫn còn trong `src/context/` nhưng không được sử dụng nữa
- Có thể xóa folder `src/context/` nếu muốn
- LocalStorage keys đã thay đổi:
  - Auth: `chronos-auth-storage`
  - Cart: `chronos-cart-storage`
  - Order: `chronos-order-storage`
