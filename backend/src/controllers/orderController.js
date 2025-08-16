const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { autoAssignShipper } = require('./shipperController');

// @desc    Tạo đơn hàng từ giỏ hàng
// @route   POST    }
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

// @desc    Tự động chuyển đơn hàng từ preparing sang ready
// @route   POST /api/orders/automation/prepare-to-ready
// @access  Private/Admin
exports.autoMoveToReady = asyncHandler(async (req, res) => {
  try {
    // Lấy các đơn hàng đang ở trạng thái preparing và đã quá thời gian chuẩn bị
    const preparingOrders = await Order.find({
      status: 'preparing',
      createdAt: { $lte: new Date(Date.now() - 30 * 60 * 1000) } // 30 phút
    });

    const updatedOrders = [];
    for (const order of preparingOrders) {
      order.status = 'ready';
      await order.save();
      updatedOrders.push(order);
      
      // Tự động phân công shipper khi đơn hàng ready
      try {
        await autoAssignShipper(order._id);
      } catch (error) {
        console.error(`Failed to assign shipper for order ${order.orderNumber}:`, error.message);
      }
    }

    res.status(200).json({
      status: 'success',
      message: `Đã chuyển ${updatedOrders.length} đơn hàng sang trạng thái ready`,
      data: updatedOrders
    });
  } catch (error) {
    console.error('Error in autoMoveToReady:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi tự động chuyển trạng thái đơn hàng'
    });
  }
});

// @desc    Tự động phân công shipper cho đơn hàng ready
// @route   POST /api/orders/automation/assign-shippers
// @access  Private/Admin
exports.autoAssignShippers = asyncHandler(async (req, res) => {
  try {
    // Lấy các đơn hàng ready chưa có shipper
    const readyOrders = await Order.find({
      status: 'ready',
      shipper: { $exists: false }
    });

    const results = [];
    for (const order of readyOrders) {
      try {
        const updatedOrder = await autoAssignShipper(order._id);
        results.push({
          orderId: order._id,
          orderNumber: order.orderNumber,
          status: 'assigned',
          shipper: updatedOrder.shipper
        });
      } catch (error) {
        results.push({
          orderId: order._id,
          orderNumber: order.orderNumber,
          status: 'failed',
          error: error.message
        });
      }
    }

    res.status(200).json({
      status: 'success',
      message: `Đã xử lý ${results.length} đơn hàng`,
      data: results
    });
  } catch (error) {
    console.error('Error in autoAssignShippers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi tự động phân công shipper'
    });
  }
});

// @desc    Cập nhật vị trí shipper và ước tính thời gian giao hàng
// @route   PATCH /api/orders/:id/delivery-tracking
// @access  Private/Shipper
exports.updateDeliveryTracking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude, estimatedTime, deliveryNotes } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    return next(new AppError('Không tìm thấy đơn hàng', 404));
  }

  // Kiểm tra quyền: chỉ shipper được phân công mới có thể cập nhật
  if (req.user.role !== 'admin' && order.shipper.toString() !== req.user._id.toString()) {
    return next(new AppError('Bạn không có quyền cập nhật đơn hàng này', 403));
  }

  // Cập nhật tracking info
  order.deliveryTracking = {
    ...order.deliveryTracking,
    currentLocation: { latitude, longitude },
    estimatedTime,
    deliveryNotes
  };

  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Cập nhật thông tin giao hàng thành công',
    data: order
  });
});

// @desc    Shipper cập nhật trạng thái đơn hàng
// @route   PATCH /api/orders/:id/shipper-status
// @access  Private/Shipper
exports.updateOrderStatusByShipper = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    return next(new AppError('Không tìm thấy đơn hàng', 404));
  }

  // Kiểm tra quyền
  if (req.user.role !== 'admin' && order.shipper.toString() !== req.user._id.toString()) {
    return next(new AppError('Bạn không có quyền cập nhật đơn hàng này', 403));
  }

  // Kiểm tra trạng thái hợp lệ cho shipper
  const validShipperStatuses = ['out_for_delivery', 'delivered'];
  if (!validShipperStatuses.includes(status)) {
    return next(new AppError('Trạng thái không hợp lệ', 400));
  }

  order.status = status;
  
  if (status === 'out_for_delivery') {
    order.pickedUpAt = new Date();
  } else if (status === 'delivered') {
    order.deleveredAt = new Date();
    order.payment.status = 'paid'; // Tự động đánh dấu đã thanh toán khi giao xong
  }

  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Cập nhật trạng thái đơn hàng thành công',
    data: order
  });
});
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
  // TODO: Implement coupon logic
  
  const totalAmount = itemsPrice + deliveryFee - discountAmount;

  // Tạo đơn hàng
  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map(item => ({
      product: item.product._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    })),
    deliveryInfo: {
      recipientName: deliveryInfo.recipientName || req.user.name,
      phone: deliveryInfo.phone || req.user.phone,
      address: deliveryInfo.address,
      notes: deliveryInfo.notes || notes
    },
    payment: {
      method: paymentMethod,
      status: paymentMethod === 'cash' ? 'pending' : 'pending'
    },
    itemsPrice,
    deliveryFee,
    discount: {
      amount: discountAmount,
      couponCode
    },
    totalAmount
  });

  // Xóa giỏ hàng sau khi đặt hàng thành công
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [], totalItems: 0, totalAmount: 0 } }
  );

  // Populate order để trả về đầy đủ thông tin
  await order.populate('user', 'name email phone');

  res.status(201).json({
    status: 'success',
    message: 'Đặt hàng thành công',
    data: {
      order
    }
  });
});

// @desc    Lấy lịch sử đơn hàng của user
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { status } = req.query;
  const filter = { user: req.user._id };
  
  if (status) {
    filter.status = status;
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('items.product', 'name image');

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: orders.length,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
      total
    },
    data: {
      orders
    }
  });
});

// @desc    Lấy chi tiết đơn hàng
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.product', 'name image category');

  if (!order) {
    return next(new AppError('Đơn hàng không tồn tại', 404));
  }

  // Kiểm tra quyền: user chỉ xem được đơn hàng của mình, admin xem được tất cả
  const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
  const currentUserId = req.user._id.toString();
  
  if (orderUserId !== currentUserId && req.user.role !== 'admin') {
    return next(new AppError('Bạn không có quyền xem đơn hàng này', 403));
  }

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

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('Đơn hàng không tồn tại', 404));
  }

  // Kiểm tra quyền - Convert về string để so sánh
  const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
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

  order.status = 'cancelled';
  order.cancellationReason = reason || 'Hủy bởi khách hàng';
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Đã hủy đơn hàng',
    data: {
      order
    }
  });
});

// ===== ADMIN FUNCTIONS =====

// @desc    Lấy tất cả đơn hàng (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res) => {
  console.log('🔧 getAllOrders called by user:', req.user);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { status, dateFrom, dateTo } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'name email phone')
    .populate('items.product', 'name image');

  const total = await Order.countDocuments(filter);

  console.log('🔧 getAllOrders found', orders.length, 'orders');
  console.log('🔧 Sample order:', orders[0] ? orders[0] : 'No orders');

  res.status(200).json({
    status: 'success',
    results: orders.length,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
      total
    },
    data: {
      orders
    }
  });
});

// @desc    Cập nhật trạng thái đơn hàng (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('Đơn hàng không tồn tại', 404));
  }

  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Trạng thái không hợp lệ', 400));
  }

  order.status = status;
  if (note) {
    order.statusHistory[order.statusHistory.length - 1].note = note;
  }

  await order.save();

  await order.populate('user', 'name email phone');

  res.status(200).json({
    status: 'success',
    message: 'Đã cập nhật trạng thái đơn hàng',
    data: {
      order
    }
  });
});

// @desc    Thống kê đơn hàng (Admin)
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