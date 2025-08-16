const cron = require('node-cron');
const Order = require('../models/Order');
const { autoAssignShipper } = require('../controllers/shipperController');

class AutomationScheduler {
  constructor() {
    this.initializeScheduledTasks();
  }

  initializeScheduledTasks() {
    console.log('🤖 Initializing simple automation scheduler...');

    // CHỈ MỘT CRON JOB duy nhất - chạy mỗi 3 phút
    cron.schedule('*/3 * * * *', () => {
      this.processAllOrders();
    });

    console.log('✅ Simple automation scheduler initialized successfully');
  }

  async processAllOrders() {
    try {
      console.log('🔄 Processing all orders...');
      const now = new Date();
      let totalProcessed = 0;

      // 1. Tự động chuyển preparing -> ready (sau 30 phút)
      const oldPreparing = await Order.find({
        status: 'preparing',
        updatedAt: { $lte: new Date(now - 30 * 60 * 1000) } // 30 phút trước
      });

      for (const order of oldPreparing) {
        try {
          order.status = 'ready';
          await order.save();
          console.log(`✅ Moved ${order.orderNumber} to ready`);
          totalProcessed++;

          // Ngay lập tức assign shipper
          try {
            await autoAssignShipper(order._id);
            console.log(`🚗 Auto assigned shipper for ${order.orderNumber}`);
          } catch (shipperError) {
            console.log(`⚠️ Will retry shipper for ${order.orderNumber}`);
          }
        } catch (error) {
          console.error(`Error processing ${order.orderNumber}:`, error);
        }
      }

      // 2. Assign shipper cho các ready orders chưa có shipper
      const readyOrders = await Order.find({
        status: 'ready',
        shipper: { $exists: false }
      });

      for (const order of readyOrders) {
        try {
          await autoAssignShipper(order._id);
          console.log(`🚗 Assigned shipper for ${order.orderNumber}`);
          totalProcessed++;
        } catch (error) {
          // Không log error, sẽ retry lần sau
        }
      }

      if (totalProcessed > 0) {
        console.log(`✅ Processed ${totalProcessed} orders`);
      }

    } catch (error) {
      console.error('Error in processAllOrders:', error);
    }
  }

  // Manual run cho admin dashboard
  async runAllAutomation() {
    console.log('🚀 Running automation manually...');
    await this.processAllOrders();
    
    return {
      prepareToReady: 0, // Simplified response
      assignShippers: 0,
      errors: []
    };
  }
}

module.exports = AutomationScheduler;
