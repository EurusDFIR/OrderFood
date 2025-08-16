// Order Types
export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'momo' | 'banking';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled';
  orderStatus: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryInfo: {
    recipientName: string;
    phone: string;
    address: string;
    notes?: string;
  };
  notes?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  deliveryInfo: {
    recipientName?: string;
    address: string;
    phone?: string;
    notes?: string;
  };
  paymentMethod: 'cash' | 'momo' | 'banking';
  notes?: string;
  couponCode?: string;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
