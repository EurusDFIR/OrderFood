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
    .isMobilePhone('vi-VN')
    .withMessage('Số điện thoại không hợp lệ'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'bank_transfer'])
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
router.get('/my-orders', getMyOrders);
router.get('/:id', orderIdValidation, getOrderDetails);
router.put('/:id/cancel', orderIdValidation, cancelOrder);

// Admin routes
router.use(restrictTo('admin'));
router.get('/admin/all', getAllOrders);
router.get('/admin/stats', getOrderStats);
router.put('/:id/status', [...orderIdValidation, ...updateStatusValidation], updateOrderStatus);

module.exports = router;