const Order = require('../models/Order');
const { autoAssignShipper } = require('../controllers/shipperController');

// Hook middleware tự động chạy khi order status thay đổi
const orderStatusHooks = {
  // Khi order chuyển sang preparing -> bắt đầu đếm thời gian
  onPreparing: async (order) => {
    console.log(`⏰ Order ${order.orderNumber} started preparing at ${new Date()}`);
    
    // Tự động chuyển sang ready sau 30 phút
    setTimeout(async () => {
      try {
        const currentOrder = await Order.findById(order._id);
        if (currentOrder && currentOrder.status === 'preparing') {
          currentOrder.status = 'ready';
          await currentOrder.save();
          console.log(`🍳 Auto moved ${order.orderNumber} to ready`);
          
          // Tự động assign shipper
          await orderStatusHooks.onReady(currentOrder);
        }
      } catch (error) {
        console.error(`Error auto-moving order ${order.orderNumber}:`, error);
      }
    }, 30 * 60 * 1000); // 30 phút
  },

  // Khi order ready -> tự động assign shipper
  onReady: async (order) => {
    console.log(`🚗 Order ${order.orderNumber} is ready, finding shipper...`);
    
    try {
      await autoAssignShipper(order._id);
      console.log(`✅ Auto assigned shipper for ${order.orderNumber}`);
    } catch (error) {
      console.error(`Failed to assign shipper for ${order.orderNumber}:`, error);
    }
  },

  // Khi assign shipper -> bắt đầu tracking
  onAssignedToShipper: async (order) => {
    console.log(`📦 Order ${order.orderNumber} assigned to shipper`);
    
    // Auto reminder sau 1 giờ nếu chưa giao
    setTimeout(async () => {
      try {
        const currentOrder = await Order.findById(order._id);
        if (currentOrder && currentOrder.status === 'assigned_to_shipper') {
          console.log(`⚠️ Order ${order.orderNumber} taking too long to deliver`);
          // Có thể gửi notification hoặc reassign shipper
        }
      } catch (error) {
        console.error(`Error checking order ${order.orderNumber}:`, error);
      }
    }, 60 * 60 * 1000); // 1 giờ
  }
};

// Middleware hook cho Order model
const attachOrderHooks = () => {
  Order.schema.post('save', async function(doc, next) {
    if (this.isModified('status')) {
      const status = doc.status;
      
      switch (status) {
        case 'preparing':
          await orderStatusHooks.onPreparing(doc);
          break;
        case 'ready':
          await orderStatusHooks.onReady(doc);
          break;
        case 'assigned_to_shipper':
          await orderStatusHooks.onAssignedToShipper(doc);
          break;
      }
    }
    next();
  });
};

module.exports = { orderStatusHooks, attachOrderHooks };
