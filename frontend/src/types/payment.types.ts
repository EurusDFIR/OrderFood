// Payment Types
export interface PaymentRequest {
  orderId: string;
  paymentMethod: 'cash' | 'momo' | 'banking';
  amount: number;
  momoInfo?: {
    phoneNumber: string;
  };
  bankingInfo?: {
    bankCode: string;
    accountNumber: string;
  };
}

export interface PaymentResponse {
  _id: string;
  orderId: string;
  paymentMethod: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  paymentUrl?: string;
  qrCode?: string;
  invoice?: {
    invoiceNumber: string;
    downloadUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  message?: string;
}
