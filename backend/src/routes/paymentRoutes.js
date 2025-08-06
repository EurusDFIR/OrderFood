const express = require('express');
const {
  createPayment,
  confirmPayment,
  momoIPN,
  getPayment
} = require('../controllers/paymentController');
const { protect, restrictTo } = require('../middleware/auth');
const { body, param } = require('express-validator');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// Validation rules
const createPaymentValidation = [
  body('orderId')
    .notEmpty()
    .withMessage('Order ID là bắt buộc')
    .isMongoId()
    .withMessage('Order ID không hợp lệ'),
  body('paymentMethod')
    .isIn(['cash', 'momo', 'banking'])
    .withMessage('Phương thức thanh toán không hợp lệ'),
  validateRequest
];

const confirmPaymentValidation = [
  param('paymentId')
    .notEmpty()
    .withMessage('Payment ID là bắt buộc'),
  body('transactionId')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Transaction ID không hợp lệ'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Ghi chú không được vượt quá 500 ký tự'),
  validateRequest
];

// Public routes (for payment gateway callbacks)
router.post('/momo/ipn', momoIPN);

// Protected routes
router.use(protect);

// User routes
router.post('/create', createPaymentValidation, createPayment);
router.get('/:paymentId', getPayment);

// Admin routes
router.put('/:paymentId/confirm', restrictTo('admin'), confirmPaymentValidation, confirmPayment);

module.exports = router;
