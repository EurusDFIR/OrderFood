const cron = require('node-cron');
const Order = require('../models/Order');
const { autoAssignShipper } = require('../controllers/shipperController');

class AutomationScheduler {
  constructor() {
    this.initializeScheduledTasks();
  }

  initializeScheduledTasks() {
    console.log('🤖 Initializing automation scheduler...');

    // Chạy mỗi 5 phút để chuyển đơn hàng từ preparing sang ready
    cron.schedule('*/5 * * * *', () => {
      this.autoMovePreparingToReady();
    });

    // Chạy mỗi 2 phút để phân công shipper cho đơn hàng ready
    cron.schedule('*/2 * * * *', () => {
      this.autoAssignShippersToReady();
    });

    // Chạy mỗi 10 phút để kiểm tra đơn hàng quá hạn
    cron.schedule('*/10 * * * *', () => {
      this.checkOverdueOrders();
    });

    console.log('✅ Automation scheduler initialized successfully');
  }

  async autoMovePreparingToReady() {
    try {
      console.log('🔄 Running auto move preparing to ready...');
      
      // Tìm các đơn hàng đang preparing quá 30 phút
      const preparingOrders = await Order.find({
        status: 'preparing',
        createdAt: { $lte: new Date(Date.now() - 30 * 60 * 1000) }
      });

      let movedCount = 0;
      for (const order of preparingOrders) {
        try {
          order.status = 'ready';
          await order.save();
          movedCount++;
          
          console.log(`✅ Moved order ${order.orderNumber} to ready status`);
          
          // Tự động phân công shipper
          try {
            await autoAssignShipper(order._id);
            console.log(`🚚 Auto assigned shipper to order ${order.orderNumber}`);
          } catch (error) {
            console.log(`⚠️ Failed to assign shipper to order ${order.orderNumber}:`, error.message);
          }
          
        } catch (error) {
          console.error(`❌ Failed to move order ${order.orderNumber} to ready:`, error.message);
        }
      }

      if (movedCount > 0) {
        console.log(`📦 Successfully moved ${movedCount} orders to ready status`);
      }
      
    } catch (error) {
      console.error('❌ Error in autoMovePreparingToReady:', error);
    }
  }

  async autoAssignShippersToReady() {
    try {
      console.log('🔄 Running auto assign shippers...');
      
      // Tìm các đơn hàng ready chưa có shipper
      const readyOrders = await Order.find({
        status: 'ready',
        shipper: { $exists: false }
      });

      let assignedCount = 0;
      for (const order of readyOrders) {
        try {
          await autoAssignShipper(order._id);
          assignedCount++;
          console.log(`🚚 Assigned shipper to order ${order.orderNumber}`);
        } catch (error) {
          console.log(`⚠️ Failed to assign shipper to order ${order.orderNumber}:`, error.message);
        }
      }

      if (assignedCount > 0) {
        console.log(`🚚 Successfully assigned shippers to ${assignedCount} orders`);
      }
      
    } catch (error) {
      console.error('❌ Error in autoAssignShippersToReady:', error);
    }
  }

  async checkOverdueOrders() {
    try {
      console.log('🔄 Checking overdue orders...');
      
      // Kiểm tra các đơn hàng đang giao quá 2 giờ
      const overdueOrders = await Order.find({
        status: 'out_for_delivery',
        pickedUpAt: { $lte: new Date(Date.now() - 2 * 60 * 60 * 1000) }
      }).populate('shipper user');

      for (const order of overdueOrders) {
        console.log(`⚠️ Order ${order.orderNumber} is overdue (picked up: ${order.pickedUpAt})`);
        console.log(`   Customer: ${order.user?.name}, Shipper: ${order.shipper?.name}`);
        
        // Có thể thêm logic gửi notification ở đây
        // await this.sendOverdueNotification(order);
      }
      
    } catch (error) {
      console.error('❌ Error in checkOverdueOrders:', error);
    }
  }

  // Method để dừng tất cả scheduled tasks
  stopAllTasks() {
    cron.getTasks().forEach((task, name) => {
      task.stop();
      console.log(`🛑 Stopped task: ${name}`);
    });
  }

  // Method để manual trigger automation
  async runAllAutomation() {
    console.log('🚀 Running all automation tasks manually...');
    
    await this.autoMovePreparingToReady();
    await this.autoAssignShippersToReady();
    await this.checkOverdueOrders();
    
    console.log('✅ Manual automation run completed');
  }
}

module.exports = AutomationScheduler;
