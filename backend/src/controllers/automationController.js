const Order = require('../models/Order');
const { autoAssignShipper } = require('./shipperController');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

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
exports.updateDeliveryTracking = asyncHandler(async (req, res, next) => {
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
exports.updateOrderStatusByShipper = asyncHandler(async (req, res, next) => {
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

// @desc    Chạy tất cả automation tasks
// @route   POST /api/orders/automation/run-all
// @access  Private/Admin
exports.runAllAutomation = asyncHandler(async (req, res) => {
  try {
    const results = {
      prepareToReady: 0,
      assignShippers: 0,
      errors: []
    };

    // 1. Chuyển preparing -> ready
    const preparingOrders = await Order.find({
      status: 'preparing',
      createdAt: { $lte: new Date(Date.now() - 30 * 60 * 1000) }
    });

    for (const order of preparingOrders) {
      try {
        order.status = 'ready';
        await order.save();
        results.prepareToReady++;
      } catch (error) {
        results.errors.push(`Failed to move order ${order.orderNumber} to ready: ${error.message}`);
      }
    }

    // 2. Phân công shipper cho các đơn ready
    const readyOrders = await Order.find({
      status: 'ready',
      shipper: { $exists: false }
    });

    for (const order of readyOrders) {
      try {
        await autoAssignShipper(order._id);
        results.assignShippers++;
      } catch (error) {
        results.errors.push(`Failed to assign shipper for order ${order.orderNumber}: ${error.message}`);
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Automation completed',
      data: results
    });
  } catch (error) {
    console.error('Error in runAllAutomation:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi chạy automation'
    });
  }
});
