const Order = require('../models/Order');
const { autoAssignShipper } = require('./shipperController');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Chạy tất cả automation (đơn giản)
// @route   POST /api/orders/automation/run-all
// @access  Private/Admin
exports.runAllAutomation = asyncHandler(async (req, res) => {
  try {
    console.log('🚀 Running simple automation...');
    const now = new Date();
    const results = {
      prepareToReady: 0,
      assignShippers: 0,
      errors: []
    };

    // 1. Chuyển preparing -> ready (sau 30 phút)
    const preparingOrders = await Order.find({
      status: 'preparing',
      updatedAt: { $lte: new Date(now - 30 * 60 * 1000) }
    });

    for (const order of preparingOrders) {
      try {
        order.status = 'ready';
        await order.save();
        results.prepareToReady++;
        
        // Ngay lập tức assign shipper
        try {
          await autoAssignShipper(order._id);
          results.assignShippers++;
        } catch (shipperError) {
          results.errors.push(`Failed to assign shipper for ${order.orderNumber}`);
        }
      } catch (error) {
        results.errors.push(`Failed to move ${order.orderNumber} to ready`);
      }
    }

    // 2. Assign shipper cho ready orders
    const readyOrders = await Order.find({
      status: 'ready',
      shipper: { $exists: false }
    });

    for (const order of readyOrders) {
      try {
        await autoAssignShipper(order._id);
        results.assignShippers++;
      } catch (error) {
        results.errors.push(`Failed to assign shipper for ${order.orderNumber}`);
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Simple automation completed',
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
