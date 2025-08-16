// Cấu hình đơn giản có thể thay đổi dễ dàng
const automationConfig = {
  // Thời gian tự động (phút)
  timings: {
    preparingToReady: 30,    // 30 phút nấu xong
    deliveryTimeout: 120,    // 2 giờ giao hàng
    retryInterval: 5         // 5 phút retry
  },

  // Bật/tắt từng tính năng
  features: {
    autoMoveToReady: true,
    autoAssignShipper: true,
    deliveryReminder: true,
    retryFailedAssignment: true
  },

  // Điều kiện kích hoạt
  conditions: {
    minPreparingTime: 30,    // Tối thiểu 30 phút mới auto ready
    maxDeliveryTime: 120,    // Tối đa 2 giờ giao hàng
    businessHours: {
      start: 6,  // 6h sáng
      end: 22    // 10h tối
    }
  }
};

// Hàm đơn giản để cập nhật config
const updateConfig = (newConfig) => {
  Object.assign(automationConfig, newConfig);
  console.log('✅ Automation config updated:', automationConfig);
};

// API endpoint để admin thay đổi config
exports.updateAutomationConfig = async (req, res) => {
  try {
    updateConfig(req.body);
    res.json({
      status: 'success',
      message: 'Configuration updated',
      config: automationConfig
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Lấy config hiện tại
exports.getAutomationConfig = async (req, res) => {
  res.json({
    status: 'success',
    data: automationConfig
  });
};

module.exports = { automationConfig, updateConfig };
