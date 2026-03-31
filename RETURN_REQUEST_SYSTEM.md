# Hệ thống yêu cầu hoàn trả

## Tổng quan
Hệ thống cho phép khách hàng gửi yêu cầu hoàn trả sản phẩm và admin xử lý các yêu cầu này.

## Luồng hoạt động

```
Khách hàng gửi yêu cầu hoàn trả
         ↓
  submitReturnRequest()
         ↓
  Lưu vào orderStore (localStorage)
         ↓
  Admin nhận notification
         ↓
  Admin xem chi tiết và xử lý
         ↓
  Cập nhật trạng thái: pending → approved → completed
                              ↘ rejected
```

## Các thành phần chính

### 1. Return Request Notification (Admin)
**File:** `src/components/admin/ReturnRequestNotification.tsx`

Component tự động hiển thị notification khi có yêu cầu hoàn trả mới.

**Notification hiển thị:**
```
⚠️ Yêu cầu hoàn trả mới!
Mã yêu cầu: RTN-1234567890
Đơn hàng: ORD-1234567890
Lý do: Sản phẩm bị lỗi / hỏng
Số tiền hoàn: 15,000,000₫
```

**Styling:**
- Icon: RollbackOutlined màu cam
- Background: Gradient cam nhạt
- Border: Cam
- Duration: 10 giây

### 2. Return Management Page (Admin)
**File:** `src/pages/admin/ReturnManagementPage.tsx`

Trang quản lý tất cả yêu cầu hoàn trả.

**Tính năng:**
- ✅ Danh sách tất cả yêu cầu hoàn trả
- ✅ Tìm kiếm theo mã yêu cầu, mã đơn hàng
- ✅ Lọc theo trạng thái
- ✅ Xem chi tiết yêu cầu
- ✅ Chấp nhận/Từ chối yêu cầu
- ✅ Đánh dấu hoàn thành

**Bảng hiển thị:**
| Mã yêu cầu | Mã đơn hàng | Lý do | Số tiền hoàn | Trạng thái | Ngày tạo | Thao tác |
|------------|-------------|-------|--------------|------------|----------|----------|

**Drawer chi tiết:**
- Thông tin yêu cầu (mã, trạng thái, ngày tạo)
- Lý do hoàn trả và mô tả chi tiết
- Danh sách sản phẩm hoàn trả
- Số tiền hoàn
- Nút hành động (Chấp nhận/Từ chối/Hoàn thành)

### 3. Return Request Page (Customer)
**File:** `src/pages/ReturnRequestPage.tsx`

Trang cho khách hàng gửi yêu cầu hoàn trả.

**Tính năng:**
- ✅ Chọn đơn hàng đã hoàn thành
- ✅ Chọn lý do hoàn trả
- ✅ Nhập mô tả chi tiết
- ✅ Xem lịch sử yêu cầu hoàn trả
- ✅ Theo dõi trạng thái yêu cầu

**Lý do hoàn trả:**
- Sản phẩm bị lỗi / hỏng
- Nhận sai sản phẩm
- Không đúng mô tả
- Đổi ý / Không cần nữa
- Kích thước không phù hợp
- Lý do khác

### 4. Order Store Enhancement
**File:** `src/stores/orderStore.ts`

**Thêm actions:**
```typescript
submitReturnRequest: (req: Omit<ReturnRequest, "id" | "status" | "createdAt">) => void
updateReturnStatus: (returnId: string, status: ReturnStatus) => void
getReturnsByEmail: (email: string) => ReturnRequest[]
```

**Return Status Flow:**
```
pending (Chờ xử lý)
   ↓
approved (Đã chấp nhận) → completed (Hoàn thành)
   ↓
rejected (Từ chối)
```

### 5. Admin Layout Update
**File:** `src/components/layout/AdminLayout.tsx`

**Thêm:**
- Menu item "Hoàn trả" với badge
- ReturnRequestNotification component
- Badge tổng hợp trên icon chuông (đơn mới + yêu cầu hoàn trả)

**Badge calculation:**
```typescript
const newOrdersCount = orders.filter(o => o.status === 'new').length;
const pendingReturnsCount = returnRequests.filter(r => r.status === 'pending').length;

<Badge count={newOrdersCount + pendingReturnsCount}>
  <BellOutlined />
</Badge>
```

## Trạng thái yêu cầu hoàn trả

### 1. Pending (Chờ xử lý)
- Màu: Orange
- Mô tả: Yêu cầu mới, chưa được xử lý
- Actions: Admin có thể Chấp nhận hoặc Từ chối

### 2. Approved (Đã chấp nhận)
- Màu: Blue
- Mô tả: Admin đã chấp nhận yêu cầu
- Actions: Admin có thể Đánh dấu hoàn thành

### 3. Rejected (Từ chối)
- Màu: Red
- Mô tả: Admin từ chối yêu cầu
- Actions: Không có (trạng thái cuối)

### 4. Completed (Hoàn thành)
- Màu: Green
- Mô tả: Đã hoàn tiền cho khách hàng
- Actions: Không có (trạng thái cuối)

## Cách sử dụng

### Khách hàng gửi yêu cầu

1. **Đăng nhập** vào tài khoản
2. **Vào trang "Yêu cầu hoàn trả"** (`/return-request`)
3. **Chọn đơn hàng** đã hoàn thành
4. **Chọn lý do** hoàn trả
5. **Nhập mô tả** chi tiết (tùy chọn)
6. **Gửi yêu cầu**
7. **Theo dõi trạng thái** trong lịch sử

### Admin xử lý yêu cầu

1. **Nhận notification** khi có yêu cầu mới
2. **Vào trang "Hoàn trả"** (`/admin/returns`)
3. **Xem danh sách** yêu cầu
4. **Click "Chi tiết"** để xem thông tin đầy đủ
5. **Xử lý yêu cầu:**
   - **Chấp nhận:** Nếu yêu cầu hợp lệ
   - **Từ chối:** Nếu yêu cầu không hợp lệ
6. **Đánh dấu hoàn thành** sau khi hoàn tiền

## Test Scenarios

### Scenario 1: Yêu cầu hoàn trả thành công
1. **Khách hàng:** Gửi yêu cầu hoàn trả cho đơn đã hoàn thành
2. **Admin:** Nhận notification "⚠️ Yêu cầu hoàn trả mới!"
3. **Admin:** Vào trang Hoàn trả, xem chi tiết
4. **Admin:** Click "Chấp nhận"
5. **Admin:** Click "Đánh dấu hoàn thành" sau khi hoàn tiền
6. **Khách hàng:** Xem trạng thái "Hoàn thành" trong lịch sử

### Scenario 2: Yêu cầu bị từ chối
1. **Khách hàng:** Gửi yêu cầu hoàn trả
2. **Admin:** Nhận notification
3. **Admin:** Xem chi tiết và click "Từ chối"
4. **Khách hàng:** Xem trạng thái "Từ chối" trong lịch sử

### Scenario 3: Nhiều yêu cầu cùng lúc
1. **Nhiều khách hàng:** Gửi yêu cầu hoàn trả
2. **Admin:** Nhận nhiều notification
3. **Admin:** Badge hiển thị số lượng yêu cầu pending
4. **Admin:** Xử lý từng yêu cầu một
5. **Badge giảm dần** khi xử lý xong

## Data Structure

### ReturnRequest Interface
```typescript
interface ReturnRequest {
  id: string;                    // RTN-timestamp
  orderId: string;               // Mã đơn hàng
  reason: string;                // Lý do hoàn trả
  description: string;           // Mô tả chi tiết
  status: ReturnStatus;          // pending/approved/rejected/completed
  createdAt: string;             // ISO timestamp
  items: OrderItem[];            // Sản phẩm hoàn trả
  refundAmount: number;          // Số tiền hoàn
}
```

### Return Status Config
```typescript
{
  pending: { label: "Chờ xử lý", color: "orange" },
  approved: { label: "Đã chấp nhận", color: "blue" },
  rejected: { label: "Từ chối", color: "red" },
  completed: { label: "Hoàn thành", color: "green" },
}
```

## Routes

### Customer Routes
- `/return-request` - Trang gửi yêu cầu hoàn trả

### Admin Routes
- `/admin/returns` - Trang quản lý hoàn trả

## Notifications

### Admin Notification
- **Trigger:** Khi có yêu cầu hoàn trả mới (status = pending)
- **Position:** Top Right
- **Duration:** 10 giây
- **Style:** Gradient cam nhạt, border cam

### Badge Indicators
- **Menu "Hoàn trả":** Số yêu cầu pending
- **Icon chuông:** Tổng đơn mới + yêu cầu hoàn trả pending

## Business Rules

### Điều kiện gửi yêu cầu
- ✅ Đơn hàng phải có status = "completed"
- ✅ Khách hàng phải đăng nhập
- ✅ Phải chọn lý do hoàn trả

### Quy trình xử lý
1. **Pending:** Yêu cầu mới, chờ admin xem xét
2. **Approved:** Admin chấp nhận, chuẩn bị hoàn tiền
3. **Completed:** Đã hoàn tiền cho khách hàng
4. **Rejected:** Admin từ chối yêu cầu

### Số tiền hoàn
- Bằng tổng tiền của đơn hàng (totalAmount)
- Bao gồm cả phí vận chuyển (nếu có)

## Security & Validation

### Customer Side
- Chỉ hiển thị đơn hàng của user đang đăng nhập
- Chỉ cho phép hoàn trả đơn đã hoàn thành
- Validate form trước khi submit

### Admin Side
- Xác nhận trước khi cập nhật trạng thái
- Modal confirm cho các hành động quan trọng
- Không cho phép cập nhật yêu cầu đã hoàn thành/từ chối

## Future Improvements

- [ ] Upload ảnh sản phẩm lỗi
- [ ] Chat với admin về yêu cầu hoàn trả
- [ ] Email notification cho khách hàng
- [ ] Lịch sử thay đổi trạng thái
- [ ] Lý do từ chối chi tiết
- [ ] Thống kê yêu cầu hoàn trả
- [ ] Export báo cáo hoàn trả
- [ ] Tích hợp với hệ thống kế toán

## Files Created/Modified

### New Files
- `src/components/admin/ReturnRequestNotification.tsx`
- `src/pages/admin/ReturnManagementPage.tsx`

### Modified Files
- `src/stores/orderStore.ts` - Thêm updateReturnStatus action
- `src/components/layout/AdminLayout.tsx` - Thêm menu và notification
- `src/App.tsx` - Thêm routes

## Build Status
✅ Build successful
✅ No TypeScript errors
✅ All features working
✅ Return request system complete
✅ Admin notification working
✅ Badge system working
