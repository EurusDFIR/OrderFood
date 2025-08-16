const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Tạo đơn hàng từ giỏ hàng
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  console.log("📦 createOrder called with body:", JSON.stringify(req.body, null, 2));
  
  const {
    deliveryInfo,
    paymentMethod = 'cash',
    couponCode,
    notes
  } = req.body;

  console.log("📦 Extracted data:", {
    deliveryInfo,
    paymentMethod,
    couponCode,
    notes,
    userId: req.user._id
  });

  // Validate required fields
  if (!deliveryInfo || !deliveryInfo.address) {
    console.log("❌ Missing delivery info:", { deliveryInfo });
    return next(new AppError('Thông tin giao hàng không hợp lệ', 400));
  }

  // Lấy giỏ hàng
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Giỏ hàng trống', 400));
  }

  // Kiểm tra tất cả sản phẩm còn available
  const unavailableItems = cart.items.filter(item => !item.product.isAvailable);
  if (unavailableItems.length > 0) {
    return next(new AppError('Một số sản phẩm trong giỏ hàng không còn khả dụng', 400));
  }

  // Tính toán giá
  const itemsPrice = cart.totalAmount;
  const deliveryFee = itemsPrice >= 200000 ? 0 : 15000; // Free ship cho đơn >= 200k
  
  let discountAmount = 0;
  if (couponCode) {
    // Logic cho mã giảm giá có thể thêm sau
    console.log("💳 Coupon code provided:", couponCode);
  }

  const totalAmount = itemsPrice + deliveryFee - discountAmount;

  // Prepare order items
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    image: item.product.image
  }));

  console.log("📦 Order items prepared:", orderItems);

  // Tạo đơn hàng
  const orderData = {
    user: req.user._id,
    items: orderItems,
    deliveryInfo: {
      recipientName: deliveryInfo.recipientName || req.user.name,
      phone: deliveryInfo.phone || req.user.phone,
      address: deliveryInfo.address,
      notes: deliveryInfo.notes || notes
    },
    payment: {
      method: paymentMethod,
      status: 'pending'
    },
    itemsPrice,
    deliveryFee,
    discount: {
      amount: discountAmount,
      couponCode: couponCode || null
    },
    totalAmount,
    status: 'pending'
  };

  console.log("📦 Creating order with data:", JSON.stringify(orderData, null, 2));

  const order = await Order.create(orderData);
  console.log("✅ Order created successfully:", order.orderNumber);

  // Xóa giỏ hàng sau khi tạo đơn hàng thành công
  cart.items = [];
  cart.totalItems = 0;
  cart.totalAmount = 0;
  await cart.save();
  console.log("🛒 Cart cleared successfully");

  res.status(201).json({
    status: 'success',
    message: 'Đơn hàng được tạo thành công',
    data: {
      order
    }
  });
});

// @desc    Lấy danh sách đơn hàng của user
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  console.log("📋 getMyOrders called for user:", req.user._id);
  
  const { status, page = 1, limit = 10 } = req.query;
  
  let query = { user: req.user._id };
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('items.product', 'name price image')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(query);

  console.log(`📋 Found ${orders.length} orders for user`);

  res.status(200).json({
    status: 'success',
    results: orders.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: {
      orders
    }
  });
});

// @desc    Lấy chi tiết đơn hàng
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderDetails = asyncHandler(async (req, res, next) => {
  console.log("🔍 getOrderDetails called for order:", req.params.id);
  
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.product', 'name price image category')
    .populate('shipper', 'name phone');

  if (!order) {
    return next(new AppError('Không tìm thấy đơn hàng', 404));
  }

  // Kiểm tra quyền: user chỉ xem được đơn hàng của mình, admin xem được tất cả
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Bạn không có quyền xem đơn hàng này', 403));
  }

  console.log("✅ Order details retrieved successfully");

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Hủy đơn hàng
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  console.log('=== CANCEL ORDER FUNCTION CALLED ===');
  console.log('Request params:', req.params);
  console.log('Request body:', req.body);
  console.log('User from token:', req.user);
  
  const { reason } = req.body;
  const orderId = req.params.id;

  const order = await Order.findById(orderId);
  
  if (!order) {
    console.log('❌ Order not found with ID:', orderId);
    return next(new AppError('Không tìm thấy đơn hàng', 404));
  }

  console.log('📦 Found order:', {
    id: order._id,
    orderNumber: order.orderNumber,
    status: order.status,
    userId: order.user
  });

  // Check permissions
  const orderUserId = order.user.toString();
  const currentUserId = req.user._id.toString();
  
  // Debug log
  console.log('Cancel Order Debug:');
  console.log('Order User ID:', orderUserId);
  console.log('Current User ID:', currentUserId);
  console.log('User Role:', req.user.role);
  console.log('Order Status:', order.status);
  
  if (orderUserId !== currentUserId && req.user.role !== 'admin') {
    return next(new AppError('Bạn không có quyền hủy đơn hàng này', 403));
  }

  // Chỉ cho phép hủy đơn hàng ở trạng thái pending hoặc confirmed
  if (!['pending', 'confirmed'].includes(order.status)) {
    return next(new AppError('Không thể hủy đơn hàng ở trạng thái hiện tại', 400));
  }

  // Update order status
  order.status = 'cancelled';
  order.cancellationReason = reason || 'Hủy bởi khách hàng';
  order.cancelledAt = new Date();
  
  // Add to status history
  order.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    note: `Trạng thái đổi thành cancelled`,
    updatedBy: req.user._id
  });

  await order.save();

  console.log('✅ Order cancelled successfully');

  res.status(200).json({
    status: 'success',
    message: 'Đơn hàng đã được hủy thành công',
    data: order
  });
});

// @desc    Lấy tất cả đơn hàng (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res) => {
  console.log('🔧 getAllOrders called by user:', req.user);
  
  const { 
    status, 
    page = 1, 
    limit = 10, 
    search,
    startDate,
    endDate,
    paymentMethod 
  } = req.query;

  // Build query
  let query = {};
  
  if (status) query.status = status;
  if (paymentMethod) query['payment.method'] = paymentMethod;
  
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'deliveryInfo.recipientName': { $regex: search, $options: 'i' } },
      { 'deliveryInfo.phone': { $regex: search, $options: 'i' } }
    ];
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const orders = await Order.find(query)
    .populate('user', 'name email phone')
    .populate('items.product', 'name category')
    .populate('shipper', 'name phone')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Order.countDocuments(query);

  console.log(`🔧 getAllOrders found ${orders.length} orders`);
  if (orders.length > 0) {
    console.log('🔧 Sample order:', orders[0]);
  }

  res.status(200).json({
    status: 'success',
    results: orders.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    data: {
      orders
    }
  });
});

// @desc    Cập nhật trạng thái đơn hàng (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, note } = req.body;
  const orderId = req.params.id;

  const order = await Order.findById(orderId);
  
  if (!order) {
    return next(new AppError('Không tìm thấy đơn hàng', 404));
  }

  // Validate status transition - More flexible for admin
  const validTransitions = {
    'pending': ['confirmed', 'preparing', 'ready', 'cancelled'],
    'confirmed': ['preparing', 'ready', 'cancelled'],
    'preparing': ['ready', 'assigned_to_shipper', 'cancelled'],
    'ready': ['assigned_to_shipper', 'out_for_delivery', 'cancelled'],
    'assigned_to_shipper': ['out_for_delivery', 'delivered', 'cancelled'],
    'out_for_delivery': ['delivered', 'cancelled'],
    'delivered': [],
    'cancelled': []
  };

  // Admin có thể thay đổi trạng thái tự do hơn
  const isAdmin = req.user.role === 'admin';
  
  console.log(`🔍 Status update attempt: ${order.status} → ${status}, User: ${req.user.role}, Admin: ${isAdmin}`);
  
  if (!isAdmin && !validTransitions[order.status]?.includes(status)) {
    return next(new AppError(`Không thể chuyển từ trạng thái ${order.status} sang ${status}`, 400));
  }
  
  // Admin warning nhưng vẫn cho phép
  if (isAdmin && !validTransitions[order.status]?.includes(status)) {
    console.log(`⚠️ Admin override: ${order.status} → ${status} for order ${order.orderNumber}`);
  }

  // Update order
  const oldStatus = order.status;
  order.status = status;
  
  // Add to status history
  order.statusHistory.push({
    status,
    timestamp: new Date(),
    note: note || `Trạng thái đổi từ ${oldStatus} thành ${status}`,
    updatedBy: req.user._id
  });

  // Set specific timestamps
  if (status === 'delivered') {
    order.deleveredAt = new Date();
    order.payment.status = 'paid'; // Tự động đánh dấu đã thanh toán
  }

  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Cập nhật trạng thái đơn hàng thành công',
    data: {
      order
    }
  });
});

// @desc    Lấy thống kê đơn hàng (Admin only)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
exports.getOrderStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [dailyStats, weeklyStats, monthlyStats, statusStats] = await Promise.all([
    // Thống kê theo ngày
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfDay } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]),

    // Thống kê theo tuần
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfWeek } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]),

    // Thống kê theo tháng
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]),

    // Thống kê theo trạng thái
    Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      daily: dailyStats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
      weekly: weeklyStats[0] || { totalOrders: 0, totalRevenue: 0 },
      monthly: monthlyStats[0] || { totalOrders: 0, totalRevenue: 0 },
      byStatus: statusStats
    }
  });
});

// @desc    Đặt lại đơn hàng (reorder)
// @route   POST /api/orders/:id/reorder
// @access  Private
exports.reorderOrder = asyncHandler(async (req, res, next) => {
  console.log('🔄 REORDER FUNCTION CALLED');
  console.log('Order ID:', req.params.id);
  console.log('User:', req.user._id);
  
  const { id } = req.params;

  // Tìm đơn hàng gốc
  const originalOrder = await Order.findById(id).populate('items.product');
  
  if (!originalOrder) {
    console.log('❌ Original order not found');
    return next(new AppError('Không tìm thấy đơn hàng', 404));
  }

  console.log('📦 Found original order:', originalOrder.orderNumber);

  // Kiểm tra quyền truy cập (chỉ user sở hữu hoặc admin)
  if (originalOrder.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    console.log('❌ Access denied for user:', req.user._id);
    return next(new AppError('Không có quyền truy cập đơn hàng này', 403));
  }

  console.log('✅ Access granted, checking products...');

  // Kiểm tra tính khả dụng của sản phẩm
  const unavailableItems = [];
  const availableItems = [];

  for (const item of originalOrder.items) {
    const product = await Product.findById(item.product._id);
    if (!product || !product.isAvailable) {
      unavailableItems.push(item.product.name);
    } else {
      availableItems.push({
        product: {
          _id: item.product._id,
          name: product.name,
          price: product.price,
          image: product.image
        },
        name: product.name, // Thêm field name cho Order model
        quantity: item.quantity,
        price: product.price,
        image: product.image
      });
    }
  }

  if (availableItems.length === 0) {
    return next(new AppError('Tất cả sản phẩm trong đơn hàng không còn khả dụng', 400));
  }

  // Tính toán giá mới
  const itemsPrice = availableItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = itemsPrice >= 200000 ? 0 : 15000;
  const totalAmount = itemsPrice + deliveryFee;

  // Tạo số đơn hàng mới
  const orderCount = await Order.countDocuments();
  const orderNumber = `OF${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${(orderCount + 1).toString().padStart(3, '0')}`;

  // Tạo đơn hàng mới
  const newOrder = await Order.create({
    user: req.user._id,
    orderNumber,
    items: availableItems,
    deliveryInfo: originalOrder.deliveryInfo,
    paymentMethod: originalOrder.paymentMethod,
    itemsPrice,
    deliveryFee,
    totalAmount,
    notes: `Đặt lại từ đơn hàng ${originalOrder.orderNumber}`,
    status: 'pending'
  });

  console.log('💾 Order saved to database:', newOrder._id);

  await newOrder.populate('user', 'name email phone');

  console.log('✅ New order created:', newOrder.orderNumber);
  console.log('Unavailable items:', unavailableItems);

  let message = 'Đặt lại đơn hàng thành công';
  if (unavailableItems.length > 0) {
    message += `. Lưu ý: Một số sản phẩm không còn khả dụng: ${unavailableItems.join(', ')}`;
  }

  console.log('📤 Sending response...');

  res.status(201).json({
    status: 'success',
    message,
    data: newOrder,
    unavailableItems
  });
});