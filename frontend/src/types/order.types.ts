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
  deliveryAddress: {
    street: string;
    city: string;
    district: string;
    ward: string;
    phone: string;
  };
  notes?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  paymentMethod: 'cash' | 'momo' | 'banking';
  deliveryAddress: {
    street: string;
    city: string;
    district: string;
    ward: string;
    phone: string;
  };
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}
