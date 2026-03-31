# Hệ thống thông báo đơn hàng cho Khách hàng

## Tổng quan
Khách hàng sẽ nhận thông báo tự động khi admin cập nhật trạng thái đơn hàng của họ.

## Luồng hoạt động

```
Admin cập nhật trạng thái đơn
         ↓
  orderStore.updateOrderStatus()
         ↓
  Lưu vào localStorage
         ↓
  OrderStatusNotification detect thay đổi
         ↓
  Hiển thị notification popup cho khách hàng
         ↓
  Badge xuất hiện trên icon chuông
```

## Các thay đổi chính

### 1. Order Status Notification Component
**File:** `src/components/customer/OrderStatusNotification.tsx`

Component tự động theo dõi thay đổi trạng thái đơn hàng và hiển thị notification.

**Cơ chế hoạt động:**
```typescript
// Theo dõi orders array
useEffect(() => {
  // Lọc đơn hàng của user hiện tại
  const userOrders = orders.filter(o => o.customerEmail === user.email);
  
  // So sánh với trạng thái trước đó
  userOrders.forEach(order => {
    const prevOrder = prevUserOrders.find(o => o.id === order.id);
    
    // Nếu có thay đổi → hiển thị notification
    if (prevOrder && prevOrder.status !== order.status) {
      showStatusNotification(order.id, order.status, order.totalAmount);
    }
  });
}, [orders, user]);
```

**Các loại notification:**

#### 1. Đơn hàng được xác nhận (confirmed)
```
✅ Đơn hàng đã được xác nhận!
Mã đơn: ORD-1234567890
Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.
Tổng tiền: 15,000,000₫
```
- Icon: CheckCircle màu xanh lá
- Background: Gradient xanh nhạt
- Border: Xanh lá

#### 2. Đang giao hàng (shipping)
```
🚚 Đơn hàng đang được giao!
Mã đơn: ORD-1234567890
Đơn hàng đang trên đường giao đến bạn. Vui lòng chú ý điện thoại!
```
- Icon: Car màu xanh dương
- Background: Gradient xanh dương nhạt
- Border: Xanh dương

#### 3. Hoàn thành (completed)
```
🎉 Đơn hàng đã hoàn thành!
Mã đơn: ORD-1234567890
Cảm ơn bạn đã mua hàng! Hãy đánh giá sản phẩm để nhận ưu đãi.
```
- Icon: Gift màu vàng
- Background: Gradient vàng nhạt
- Border: Vàng

#### 4. Đã hủy (cancelled)
```
❌ Đơn hàng đã bị hủy
Mã đơn: ORD-1234567890
Đơn hàng của bạn đã bị hủy. Vui lòng liên hệ CSKH nếu cần hỗ trợ.
```
- Background: Gradient đỏ nhạt
- Border: Đỏ

### 2. Main Layout Update
**File:** `src/components/layout/MainLayout.tsx`

Thêm `OrderStatusNotification` component:
```typescript
<Layout className="min-h-screen w-full">
  <OrderStatusNotification />  {/* Thêm component này */}
  <AppHeader />
  <Content className="flex-1 w-full">
    <Outlet />
  </Content>
  <AppFooter />
</Layout>
```

### 3. App Header Enhancement
**File:** `src/components/layout/AppHeader.tsx`

**Thêm:**
- Icon chuông (BellOutlined) với badge thông báo
- Logic theo dõi thay đổi trạng thái đơn hàng
- Badge dot hiển thị khi có cập nhật mới

**Code:**
```typescript
// Theo dõi thay đổi trạng thái
const [hasNewUpdate, setHasNewUpdate] = useState(false);

useEffect(() => {
  const userOrders = orders.filter(o => o.customerEmail === user.email);
  const prevUserOrders = prevOrdersRef.current.filter(o => o.customerEmail === user.email);

  const hasUpdate = userOrders.some(order => {
    const prevOrder = prevUserOrders.find(o => o.id === order.id);
    return prevOrder && prevOrder.status !== order.status;
  });

  if (hasUpdate) {
    setHasNewUpdate(true);
  }
}, [orders, user]);

// Hiển thị badge
<Badge dot={hasNewUpdate} offset={[-4, 4]}>
  <Button
    icon={<BellOutlined />}
    onClick={() => {
      setHasNewUpdate(false);
      navigate("/order-tracking");
    }}
  />
</Badge>
```

### 4. App Routes Update
**File:** `src/App.tsx`

Thêm route cho OrderTrackingPage:
```typescript
<Route path="/order-tracking" element={<OrderTrackingPage />} />
```

## Tính năng

### 1. Notification Popup
- ✅ Tự động hiển thị khi có thay đổi trạng thái
- ✅ Chỉ hiển thị cho đơn hàng của user đang đăng nhập
- ✅ Hiển thị thông tin chi tiết: mã đơn, trạng thái, tổng tiền
- ✅ Click vào notification → chuyển đến trang tracking
- ✅ Tự động đóng sau 10 giây
- ✅ Styling đẹp với gradient và icon phù hợp

### 2. Badge Notification
- ✅ Dot badge trên icon chuông khi có cập nhật
- ✅ Badge tự động ẩn khi user click vào
- ✅ Chỉ hiển thị khi user đã đăng nhập

### 3. Navigation
- ✅ Click icon chuông → chuyển đến trang Order Tracking
- ✅ Click notification popup → chuyển đến trang Order Tracking
- ✅ Menu dropdown có link "Đơn hàng của tôi"

## Cách sử dụng

### Khách hàng
1. Đăng nhập vào tài khoản
2. Đặt hàng như bình thường
3. Đợi admin xác nhận đơn
4. Nhận notification popup khi admin cập nhật trạng thái
5. Thấy badge dot trên icon chuông
6. Click vào icon chuông hoặc notification để xem chi tiết

### Admin
1. Vào trang "Đơn hàng"
2. Chọn đơn hàng cần xử lý
3. Cập nhật trạng thái:
   - new → confirmed (Khách hàng nhận thông báo xác nhận)
   - confirmed → shipping (Khách hàng nhận thông báo đang giao)
   - shipping → completed (Khách hàng nhận thông báo hoàn thành)
4. Khách hàng tự động nhận notification

## Test Flow

### Scenario 1: Admin xác nhận đơn
1. **Khách hàng:** Đặt hàng → Đơn có status "new"
2. **Admin:** Vào trang Đơn hàng → Cập nhật status → "confirmed"
3. **Khách hàng:** 
   - Nhận popup "✅ Đơn hàng đã được xác nhận!"
   - Thấy badge dot trên icon chuông
   - Click vào xem chi tiết

### Scenario 2: Đơn hàng đang giao
1. **Admin:** Cập nhật status → "shipping"
2. **Khách hàng:**
   - Nhận popup "🚚 Đơn hàng đang được giao!"
   - Badge dot xuất hiện lại

### Scenario 3: Hoàn thành đơn
1. **Admin:** Cập nhật status → "completed"
2. **Khách hàng:**
   - Nhận popup "🎉 Đơn hàng đã hoàn thành!"
   - Có thể đánh giá sản phẩm

### Scenario 4: Hủy đơn
1. **Admin:** Cập nhật status → "cancelled"
2. **Khách hàng:**
   - Nhận popup "❌ Đơn hàng đã bị hủy"
   - Có thể liên hệ CSKH

## Notification Settings

### Duration
- Popup tự động đóng sau: **10 giây**
- Badge dot: **Không tự động ẩn** (chỉ ẩn khi user click)

### Position
- Popup: **Top Right**
- Badge: **Top Right của icon chuông**

### Click Behavior
- Click popup → Navigate to `/order-tracking`
- Click icon chuông → Navigate to `/order-tracking` + Clear badge

## Styling

### Notification Styles
```typescript
// Confirmed
background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)'
border: '2px solid #b7eb8f'

// Shipping
background: 'linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%)'
border: '2px solid #91d5ff'

// Completed
background: 'linear-gradient(135deg, #fffbe6 0%, #ffffff 100%)'
border: '2px solid #ffe58f'

// Cancelled
background: 'linear-gradient(135deg, #fff1f0 0%, #ffffff 100%)'
border: '2px solid #ffccc7'
```

### Badge Style
```typescript
<Badge dot={hasNewUpdate} offset={[-4, 4]}>
  <BellOutlined />
</Badge>
```

## Data Flow

```
┌─────────────────┐
│  Admin Panel    │
│  Update Status  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  orderStore     │
│  updateStatus() │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  localStorage   │
│  Persist Data   │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────┐
│  OrderStatusNotification    │
│  Detect Change              │
│  Filter by user email       │
└────────┬────────────────────┘
         │
         ├─────────────────────┐
         ↓                     ↓
┌─────────────────┐   ┌──────────────┐
│  Show Popup     │   │  Set Badge   │
│  Notification   │   │  in Header   │
└─────────────────┘   └──────────────┘
```

## Security & Privacy

### Email Filtering
- Chỉ hiển thị đơn hàng của user đang đăng nhập
- Filter theo `customerEmail === user.email`
- Không hiển thị đơn của người khác

### State Management
- Sử dụng `useRef` để lưu trạng thái trước đó
- Không lưu sensitive data vào state
- Chỉ so sánh status, không expose toàn bộ order

## Future Improvements

- [ ] Thêm sound notification
- [ ] Thêm browser desktop notification
- [ ] Thêm email notification
- [ ] Thêm SMS notification
- [ ] Lịch sử thông báo
- [ ] Đánh dấu đã đọc/chưa đọc
- [ ] Filter notification theo loại
- [ ] Settings để bật/tắt notification

## Files Changed

### New Files
- `src/components/customer/OrderStatusNotification.tsx`

### Modified Files
- `src/components/layout/MainLayout.tsx`
- `src/components/layout/AppHeader.tsx`
- `src/App.tsx`

## Build Status
✅ Build successful
✅ No TypeScript errors
✅ All features working
✅ Customer notifications working
✅ Badge system working
