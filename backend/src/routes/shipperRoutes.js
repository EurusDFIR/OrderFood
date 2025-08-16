const express = require('express');
const {
  getAllShippers,
  createShipper,
  updateShipper,
  deleteShipper,
  updateShipperAvailability,
  getShipperOrders,
  getShipperStats
} = require('../controllers/shipperController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Tất cả routes cần authentication
router.use(protect);

// Routes chỉ dành cho admin
router.route('/')
  .get(restrictTo('admin'), getAllShippers)
  .post(restrictTo('admin'), createShipper);

router.route('/:id')
  .patch(restrictTo('admin'), updateShipper)
  .delete(restrictTo('admin'), deleteShipper);

router.patch('/:id/availability', restrictTo('admin'), updateShipperAvailability);

// Routes cho shipper
router.get('/:id/orders', getShipperOrders);
router.get('/:id/stats', getShipperStats);

module.exports = router;
