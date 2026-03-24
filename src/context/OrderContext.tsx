import React, { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "../data/products";

// ===== Types =====
export type OrderStatus = "new" | "confirmed" | "shipping" | "completed" | "cancelled";
export type ReturnStatus = "pending" | "approved" | "rejected" | "completed";
export type PaymentMethod = "cod" | "bank_transfer" | "credit_card" | "momo";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  note?: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  reason: string;
  description: string;
  status: ReturnStatus;
  createdAt: string;
  items: OrderItem[];
  refundAmount: number;
}

export const orderStatusConfig: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  new: { label: "Chờ xác nhận", color: "blue", icon: "🆕" },
  confirmed: { label: "Đã xác nhận", color: "cyan", icon: "✅" },
  shipping: { label: "Đang giao hàng", color: "orange", icon: "🚚" },
  completed: { label: "Hoàn thành", color: "green", icon: "🎉" },
  cancelled: { label: "Đã hủy", color: "red", icon: "❌" },
};

export const returnStatusConfig: Record<ReturnStatus, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "orange" },
  approved: { label: "Đã chấp nhận", color: "blue" },
  rejected: { label: "Từ chối", color: "red" },
  completed: { label: "Hoàn thành", color: "green" },
};

export const paymentMethodConfig: Record<PaymentMethod, { label: string; icon: string }> = {
  cod: { label: "Thanh toán khi nhận hàng (COD)", icon: "💵" },
  bank_transfer: { label: "Chuyển khoản ngân hàng", icon: "🏦" },
  credit_card: { label: "Thẻ tín dụng / Ghi nợ", icon: "💳" },
  momo: { label: "Ví MoMo", icon: "📱" },
};

// ===== Context =====
interface OrderContextType {
  orders: Order[];
  returnRequests: ReturnRequest[];
  placeOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => Order;
  cancelOrder: (orderId: string) => void;
  getOrdersByEmail: (email: string) => Order[];
  submitReturnRequest: (req: Omit<ReturnRequest, "id" | "status" | "createdAt">) => void;
  getReturnsByEmail: (email: string) => ReturnRequest[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);

  const placeOrder = useCallback((orderData: Omit<Order, "id" | "status" | "createdAt">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId && (o.status === "new" || o.status === "confirmed") ? { ...o, status: "cancelled" as OrderStatus } : o))
    );
  }, []);

  const getOrdersByEmail = useCallback(
    (email: string) => orders.filter((o) => o.customerEmail === email),
    [orders]
  );

  const submitReturnRequest = useCallback(
    (reqData: Omit<ReturnRequest, "id" | "status" | "createdAt">) => {
      const newReq: ReturnRequest = {
        ...reqData,
        id: `RTN-${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setReturnRequests((prev) => [newReq, ...prev]);
    },
    []
  );

  const getReturnsByEmail = useCallback(
    (email: string) => {
      const userOrders = orders.filter((o) => o.customerEmail === email);
      const orderIds = new Set(userOrders.map((o) => o.id));
      return returnRequests.filter((r) => orderIds.has(r.orderId));
    },
    [orders, returnRequests]
  );

  return (
    <OrderContext.Provider
      value={{ orders, returnRequests, placeOrder, cancelOrder, getOrdersByEmail, submitReturnRequest, getReturnsByEmail }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
