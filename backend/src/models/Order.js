const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: String
});


const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],


    //Thong tin giao hang
    deliveryInfo: {
        recipientName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        notes: String

    },

    //Thong tin thanh toan
    payment: {
        method: {
            type: String,
            enum: ['cash', 'card', 'bank_transfer'],
            default: 'cash'
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        },
        paidAt: Date

    },

    //Trang thai don hang

    status: {
        type: String,
        enum: [
            'pending',
            'confirmed',
            'preparing',
            'ready',
            'delivering',
            'completed',
            'cancelled'
        ],
        default: 'pending'
    },
    //thong tin gia

    itemsPrice: {
        type: Number,
        required: true,

    },
    deliveryFee:{
        type: Number,
        default: 15000
    },
    
    discount: {
        amount: {
            type: Number,
            default: 0
        },
        couponCode: String
    },
    totalAmount: {
        type: Number,
        required: true
    },

    //Thoi gian
    orderDate: {
        type: Date,
        default: Date.now
    },
    estimatedDelivery: Date,
    deleveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,

    //Tracking

    statusHistory: [{
        status: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String
    }]
},{
    timestamps: true


})


// Virtual để tính subtotal cho từng item
orderItemSchema.virtual('subtotal').get(function() {
  return this.price * this.quantity;
});

// Middleware để generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `OF${dateStr}${randomNum}`;
    
    // Thêm vào status history
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Đơn hàng được tạo'
    });

    // Tính estimated delivery (2 giờ từ bây giờ)
    this.estimatedDelivery = new Date(Date.now() + 2 * 60 * 60 * 1000);
  }
  next();
});

// Middleware để track status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Trạng thái đổi thành ${this.status}`
    });

    // Cập nhật timestamps dựa trên status
    if (this.status === 'completed') {
      this.deliveredAt = new Date();
    } else if (this.status === 'cancelled') {
      this.cancelledAt = new Date();
    }
  }
  next();
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);