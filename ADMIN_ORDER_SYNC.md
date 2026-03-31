# Đồng bộ đơn hàng giữa Khách hàng và Admin

## Tổng quan
Hệ thống đã được cập nhật để đồng bộ đơn hàng từ khách hàng sang trang admin theo thời gian thực sử dụng Zustand store.

## Luồng hoạt động

### 1. Khách hàng đặt hàng
```
Khách hàng → CheckoutPage → useOrderStore.placeOrder()
                                    ↓
                            Lưu vào localStorage
                                    ↓
                            Tự động đồng bộ
```

### 2. Admin nhận đơn
```
Admin Panel → OrderManagementPage → useOrderStore.orders
                                           ↓
                                    Hiển thị đơn mới
                                           ↓
                                    Notification popup
```

## Các thay đổi chính

### 1. Order Store (`src/stores/orderStore.ts`)
Đã thêm action mới:
```typescript
updateOrderStatus: (orderId: string, status: OrderStatus) => void
```

Cho phép admin cập nhật trạng thái đơn hàng:
- `new` → `confirmed` → `shipping` → `completed`
- Hoặc `cancelled` bất cứ lúc nào

### 2. Admin Layout (`src/components/layout/AdminLayout.tsx`)
**Thêm:**
- Component `OrderNotification` để hiển thị thông báo đơn mới
- Badge hiển thị số đơn hàng mới trên icon chuông
- Badge trên menu item "Đơn hàng"

**Tính năng:**
```typescript
const newOrdersCount = orders.filter(o => o.status === 'new').length;
```

### 3. Order Notification (`src/components/admin/OrderNotification.tsx`)
Component mới tự động hiển thị notification khi có đơn hàng mới:

**Hiển thị:**
- Mã đơn hàng
- Tên khách hàng
- Tổng tiền
- Icon và màu sắc nổi bật

**Cơ chế:**
- Theo dõi thay đổi trong `orders` array
- Chỉ hiển thị khi có đơn mới (không phải lần đầu load)
- Chỉ hiển thị cho đơn có status = 'new'
- Tự động đóng sau 8 giây

### 4. Order Management Page (`src/pages/admin/OrderManagementPage.tsx`)
**Cập nhật:**
- Sử dụng `useOrderStore` thay vì local state
- Hiển thị đơn hàng thực từ khách hàng
- Cho phép cập nhật trạng thái đơn hàng

**Actions:**
```typescript
const orders = useOrderStore((state) => state.orders);
const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
```

### 5. Dashboard Page (`src/pages/admin/DashboardPage.tsx`)
**Cập nhật:**
- Hiển thị số liệu thực từ orderStore
- Badge hiển thị số đơn hàng mới
- Tính toán doanh thu từ đơn hoàn thành

**Stats thực:**
```typescript
const totalRevenue = orders
  .filter(o => o.status === 'completed')
  .reduce((sum, o) => sum + o.totalAmount, 0);

const totalOrders = orders.length;
const newOrders = orders.filter(o => o.status === 'new').length;
```

## Cách sử dụng

### Khách hàng đặt hàng
1. Thêm sản phẩm vào giỏ hàng
2. Vào trang Checkout
3. Điền thông tin và chọn phương thức thanh toán
4. Nhấn "Đặt hàng"
5. Đơn hàng được tạo với status = "new"

### Admin xử lý đơn
1. Đăng nhập admin panel
2. Nhận notification về đơn mới (popup)
3. Thấy badge số đơn mới trên menu và icon chuông
4. Vào "Đơn hàng" để xem chi tiết
5. Cập nhật trạng thái đơn hàng:
   - Xác nhận đơn → "confirmed"
   - Đang giao hàng → "shipping"
   - Hoàn thành → "completed"
   - Hoặc hủy → "cancelled"

## Persist Storage

Tất cả đơn hàng được lưu vào localStorage với key:
```
chronos-order-storage
```

Điều này đảm bảo:
- Đơn hàng không bị mất khi refresh trang
- Admin và khách hàng đều thấy cùng dữ liệu
- Đồng bộ tự động giữa các tab

## Notification Features

### Khi nào hiển thị?
- ✅ Có đơn hàng mới được tạo
- ✅ Đơn hàng có status = "new"
- ❌ Không hiển thị khi lần đầu load trang
- ❌ Không hiển thị cho đơn đã xác nhận

### Thông tin hiển thị
```
🎉 Đơn hàng mới!
Mã đơn: ORD-1234567890
Khách hàng: Nguyễn Văn A
Tổng tiền: 15,000,000₫
```

### Styling
- Background: Gradient xanh nhạt
- Border: Xanh lá
- Icon: ShoppingCart màu xanh
- Position: Top right
- Duration: 8 giây

## Badge Indicators

### Header Bell Icon
```typescript
<Badge count={newOrdersCount} size="small">
  <BellOutlined />
</Badge>
```

### Menu Item
```typescript
{
  key: "/admin/orders",
  label: (
    <Badge count={newOrdersCount} offset={[10, 0]} size="small">
      <span>Đơn hàng</span>
    </Badge>
  ),
}
```

### Dashboard Stats
```typescript
{
  title: "Đơn hàng",
  value: totalOrders.toString(),
  badge: newOrders > 0 ? newOrders : undefined,
}
```

## Testing

### Test flow hoàn chỉnh:
1. Mở 2 tab: một cho khách hàng, một cho admin
2. Tab khách hàng: Đặt hàng
3. Tab admin: Xem notification xuất hiện
4. Kiểm tra badge trên menu và icon chuông
5. Vào trang Đơn hàng, xem đơn mới
6. Cập nhật trạng thái đơn
7. Badge giảm đi khi không còn đơn "new"

### Kiểm tra persist:
1. Đặt hàng
2. Refresh trang admin
3. Đơn hàng vẫn hiển thị
4. Không có notification (vì không phải đơn mới)

## Lưu ý

### Performance
- Zustand tự động optimize re-render
- Chỉ component cần thiết re-render khi có đơn mới
- Notification chỉ hiển thị một lần cho mỗi đơn

### Data Sync
- Tất cả dữ liệu đồng bộ qua localStorage
- Không cần API call
- Phù hợp cho demo và prototype
- Production nên dùng WebSocket hoặc polling

### Future Improvements
- [ ] Thêm sound notification
- [ ] Thêm desktop notification (browser API)
- [ ] Thêm filter theo ngày
- [ ] Thêm export đơn hàng
- [ ] Thêm print invoice
- [ ] Tích hợp real-time với backend

## Files Changed

### New Files
- `src/components/admin/OrderNotification.tsx`

### Modified Files
- `src/stores/orderStore.ts`
- `src/components/layout/AdminLayout.tsx`
- `src/pages/admin/OrderManagementPage.tsx`
- `src/pages/admin/DashboardPage.tsx`

## Build Status
✅ Build successful
✅ No TypeScript errors
✅ All features working
