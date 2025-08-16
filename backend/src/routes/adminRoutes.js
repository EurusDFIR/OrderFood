const express = require('express');
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  getRecentActivities,
  getRevenueReport
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Tất cả routes cần authentication và admin role
router.use(protect);
router.use(restrictTo('admin'));

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activities', getRecentActivities);
router.get('/dashboard/revenue', getRevenueReport);

// User management routes
router.route('/users')
  .get(getAllUsers)
  .post(createUser);

router.route('/users/:id')
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
