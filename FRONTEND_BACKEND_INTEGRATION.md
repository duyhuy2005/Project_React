# Frontend - Backend Integration Guide

## Tổng quan
Frontend (React + TypeScript + Vite) đã được kết nối với Backend (Node.js + Express + MongoDB) thông qua Axios và service layer.

---

## Cấu trúc Service Layer

### 📁 Services Directory: `src/services/`

```
src/services/
├── api.ts              # Axios instance với interceptors
├── authService.ts      # Authentication APIs
├── productService.ts   # Product APIs
├── orderService.ts     # Order APIs
├── returnService.ts    # Return request APIs
├── categoryService.ts  # Category APIs
├── couponService.ts    # Coupon APIs
└── userService.ts      # User management APIs
```

---

## Cấu hình

### Environment Variables

File: `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

### API Base Configuration

File: `src/services/api.ts`
- Tự động thêm JWT token vào headers
- Xử lý lỗi 401 (unauthorized) tự động logout
- Interceptors cho request/response

---

## Sử dụng Services

### 1. Authentication

```typescript
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

// Login
const handleLogin = async () => {
  try {
    await useAuthStore.getState().login({
      email: 'user@example.com',
      password: '123456'
    });
    // Success - user is logged in
  } catch (error) {
    // Handle error
    console.error(error);
  }
};

// Register
const handleRegister = async () => {
  try {
    await useAuthStore.getState().register({
      name: 'John Doe',
      email: 'user@example.com',
      password: '123456',
      phone: '0123456789'
    });
  } catch (error) {
    console.error(error);
  }
};

// Logout
const handleLogout = () => {
  useAuthStore.getState().logout();
};
```

### 2. Products

```typescript
import { productService } from '../services/productService';

// Get all products
const products = await productService.getProducts({
  category: 'luxury',
  minPrice: 1000000,
  maxPrice: 50000000,
  search: 'rolex'
});

// Get product by ID
const product = await productService.getProductById('123');

// Create product (Admin only)
const newProduct = await productService.createProduct({
  name: 'Royal Oak',
  brand: 'Audemars Piguet',
  price: 12500000,
  category: 'luxury',
  // ... other fields
});

// Update product (Admin only)
await productService.updateProduct('123', {
  price: 13000000
});

// Delete product (Admin only)
await productService.deleteProduct('123');
```

### 3. Orders

```typescript
import { orderService } from '../services/orderService';

// Create order
const order = await orderService.createOrder({
  items: [
    {
      product: 'product_id',
      quantity: 1,
      price: 12500000
    }
  ],
  shippingAddress: {
    fullName: 'Nguyễn Văn A',
    phone: '0123456789',
    address: '123 Đường ABC',
    city: 'Hà Nội',
    district: 'Hoàn Kiếm'
  },
  paymentMethod: 'cod',
  totalAmount: 12500000
});

// Get my orders
const myOrders = await orderService.getMyOrders();

// Get all orders (Admin)
const allOrders = await orderService.getOrders();

// Update order status (Admin)
await orderService.updateOrderStatus('order_id', 'confirmed');
```

### 4. Return Requests

```typescript
import { returnService } from '../services/returnService';

// Create return request
const returnRequest = await returnService.createReturn({
  orderId: 'order_id',
  reason: 'defective',
  description: 'Sản phẩm bị lỗi...'
});

// Get my returns
const myReturns = await returnService.getMyReturns();

// Get all returns (Admin)
const allReturns = await returnService.getReturns();

// Update return status (Admin)
await returnService.updateReturnStatus('return_id', 'approved', 'Đã duyệt');
```

### 5. Coupons

```typescript
import { couponService } from '../services/couponService';

// Validate coupon
const result = await couponService.validateCoupon('WELCOME10', 10000000);
console.log(result.data.discountAmount); // Số tiền được giảm
console.log(result.data.finalAmount);    // Số tiền sau giảm

// Get coupon by code
const coupon = await couponService.getCouponByCode('WELCOME10');

// Create coupon (Admin)
await couponService.createCoupon({
  code: 'SUMMER2026',
  discount: 15,
  type: 'percent',
  minOrder: 5000000,
  usageLimit: 100,
  expiryDate: '2026-08-31'
});
```

### 6. Categories

```typescript
import { categoryService } from '../services/categoryService';

// Get all categories
const categories = await categoryService.getCategories();

// Create category (Admin)
await categoryService.createCategory({
  name: 'Đồng hồ sang trọng',
  slug: 'luxury',
  icon: '💎',
  description: 'Các dòng đồng hồ cao cấp'
});
```

---

## Error Handling

### Global Error Handler

```typescript
try {
  await productService.getProducts();
} catch (error: any) {
  if (error.response) {
    // Server responded with error
    console.error(error.response.data.message);
  } else if (error.request) {
    // Request made but no response
    console.error('Không thể kết nối đến server');
  } else {
    // Other errors
    console.error(error.message);
  }
}
```

### Auth Store Error Handling

```typescript
const { error, isLoading, clearError } = useAuthStore();

// Display error
{error && <Alert message={error} type="error" />}

// Clear error
clearError();
```

---

## Zustand Store Integration

### Auth Store với API

```typescript
// stores/authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(data);
          set({
            user: response.data.user,
            token: response.data.token,
            isLoggedIn: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message,
            isLoading: false,
          });
          throw error;
        }
      },
      // ... other methods
    }),
    { name: 'chronos-auth-storage' }
  )
);
```

---

## Component Examples

### Login Component

```typescript
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { message } from 'antd';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      message.success('Đăng nhập thành công!');
      // Redirect to home
    } catch (error) {
      message.error('Đăng nhập thất bại!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};
```

### Product List Component

```typescript
import { useEffect, useState } from 'react';
import { productService } from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProducts();
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

---

## Testing API Connection

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

### 2. Start Frontend Server
```bash
cd project_clock
npm run dev
```

### 3. Test Health Check
```bash
curl http://localhost:5000/api/health
```

### 4. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

---

## Backward Compatibility

Để đảm bảo code cũ vẫn hoạt động, authStore có 2 bộ methods:

### API-based (Mới)
- `login(data: LoginData)` - Gọi API
- `register(data: RegisterData)` - Gọi API

### Local-based (Cũ)
- `loginLocal(user: User)` - Không gọi API
- `registerLocal(user: User)` - Không gọi API

---

## Next Steps

1. ✅ Services layer đã được tạo
2. ✅ Axios đã được cấu hình
3. ✅ Auth store đã tích hợp API
4. ⏳ Cập nhật các component để sử dụng API
5. ⏳ Thêm loading states và error handling
6. ⏳ Test tất cả các endpoints

---

## Troubleshooting

### CORS Error
Đảm bảo backend đã cấu hình CORS đúng trong `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 401 Unauthorized
- Kiểm tra token có được lưu trong localStorage không
- Kiểm tra token có hết hạn không
- Đảm bảo header Authorization được gửi đúng

### Connection Refused
- Kiểm tra backend server đang chạy
- Kiểm tra URL trong `.env` đúng chưa
- Kiểm tra port 5000 có bị chiếm không
