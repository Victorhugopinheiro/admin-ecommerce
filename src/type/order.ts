export interface OrderItem {
  _id: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  status: "pending" | "confirmed" | "shipped" | "delivered" | "refunded";
  date: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}