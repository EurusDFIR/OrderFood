const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderDetails,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');
const {
  autoMoveToReady,
  autoAssignShippers,
  updateDeliveryTracking,
  updateOrderStatusByShipper,
  runAllAutomation
} = require('../controllers/automationController');
const { protect, restrictTo } = require('../middleware/auth');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('deliveryInfo.address')
    .notEmpty()
    .withMessage('Địa chỉ giao hàng là bắt buộc')
    .isLength({ min: 10 })
    .withMessage('Địa chỉ phải có ít nhất 10 ký tự'),
  body('deliveryInfo.phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại phải có 10-11 chữ số'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'bank_transfer'])
    .withMessage('Phương thức thanh toán không hợp lệ'),
  validateRequest
];

const updateStatusValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'])
    .withMessage('Trạng thái không hợp lệ'),
  body('note')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Ghi chú không được vượt quá 500 ký tự'),
  validateRequest
];

const orderIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID đơn hàng không hợp lệ'),
  validateRequest
];

// Protected routes (cần đăng nhập)
router.use(protect);

// User routes
router.post('/', createOrderValidation, createOrder);
router.get('/', getMyOrders); // Add this route for GET /orders
router.get('/my-orders', getMyOrders);

// Cancel order route - Must be before /:id route to avoid conflicts
router.put('/:id/cancel', orderIdValidation, cancelOrder);

// Automation routes (admin only)
router.post('/automation/prepare-to-ready', restrictTo('admin'), autoMoveToReady);
router.post('/automation/assign-shippers', restrictTo('admin'), autoAssignShippers);
router.post('/automation/run-all', restrictTo('admin'), runAllAutomation);

// Shipper routes
router.patch('/:id/delivery-tracking', updateDeliveryTracking);
router.patch('/:id/shipper-status', updateOrderStatusByShipper);

// Admin routes - Must be before /:id route to avoid conflicts
router.get('/admin/all', (req, res, next) => {
  console.log('🔧 Admin route hit: /admin/all');
  console.log('🔧 User:', req.user);
  next();
}, restrictTo('admin'), getAllOrders);
router.get('/admin/stats', restrictTo('admin'), getOrderStats);
router.put('/:id/status', restrictTo('admin'), ...orderIdValidation, ...updateStatusValidation, updateOrderStatus);

// Get order detail route - Must be last to avoid conflicts
router.get('/:id', orderIdValidation, getOrderDetails);

module.exports = router;