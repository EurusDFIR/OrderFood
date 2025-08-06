const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  method: {
    type: String,
    enum: ['cash', 'momo', 'banking'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Thông tin gateway response
  gatewayData: {
    transactionId: String,    // ID từ MoMo/VNPay/Banking
    gatewayStatus: String,    // Trạng thái từ gateway
    gatewayMessage: String,   // Message từ gateway
    paymentUrl: String,       // URL thanh toán (cho redirect)
    qrCode: String           // QR code cho thanh toán
  },
  
  // Thông tin refund
  refund: {
    isRefunded: {
      type: Boolean,
      default: false
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    refundReason: String,
    refundDate: Date,
    refundTransactionId: String
  },
  
  // Timestamps
  paidAt: Date,
  failedAt: Date,
  
  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    notes: String
  }
}, {
  timestamps: true
});

// Middleware để generate paymentId
paymentSchema.pre('save', function(next) {
  if (this.isNew && !this.paymentId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, '');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.paymentId = `PAY${dateStr}${timeStr}${randomNum}`;
  }
  next();
});

// Index để tăng tốc truy vấn
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ method: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
