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
  orderNumber: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  payment: {
    method: 'cash' | 'bank_transfer';
    status: 'pending' | 'paid' | 'failed';
    paidAt?: string;
  };
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  deliveryInfo: {
    recipientName: string;
    phone: string;
    address: string;
    notes?: string;
  };
  notes?: string;
  estimatedDelivery?: string;
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
  paymentMethod: 'cash' | 'bank_transfer';
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
