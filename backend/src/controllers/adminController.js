const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Lấy tất cả users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách người dùng'
    });
  }
};

// Tạo user mới (admin only)
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    const user = await User.create(userData);
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'Tạo người dùng thành công',
      data: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo người dùng'
    });
  }
};

// Cập nhật user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Không cho phép thay đổi password qua API này
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật người dùng thành công',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật người dùng'
    });
  }
};

// Xóa user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Không cho phép xóa admin
    const user = await User.findById(id);
    if (user && user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa tài khoản admin'
      });
    }

    // Kiểm tra user có đơn hàng không
    const orderCount = await Order.countDocuments({ user: id });
    if (orderCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa người dùng có đơn hàng'
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Xóa người dùng thành công'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa người dùng'
    });
  }
};

// Thống kê tổng quan dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Thống kê users
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalShippers = await User.countDocuments({ role: 'shipper' });
    const newUsersToday = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: startOfDay }
    });

    // Thống kê đơn hàng
    const totalOrders = await Order.countDocuments();
    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: startOfDay }
    });
    const pendingOrders = await Order.countDocuments({
      status: { $in: ['pending', 'confirmed', 'preparing'] }
    });
    const deliveringOrders = await Order.countDocuments({
      status: { $in: ['assigned_to_shipper', 'out_for_delivery'] }
    });

    // Thống kê doanh thu
    const revenueStats = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          'payment.status': 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          monthlyRevenue: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfMonth] },
                '$totalAmount',
                0
              ]
            }
          },
          dailyRevenue: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfDay] },
                '$totalAmount',
                0
              ]
            }
          }
        }
      }
    ]);

    const revenue = revenueStats[0] || {
      totalRevenue: 0,
      monthlyRevenue: 0,
      dailyRevenue: 0
    };

    // Thống kê sản phẩm
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });

    // Đơn hàng theo trạng thái
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top sản phẩm bán chạy
    const topProducts = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          shippers: totalShippers
        },
        orders: {
          total: totalOrders,
          today: ordersToday,
          pending: pendingOrders,
          delivering: deliveringOrders,
          byStatus: ordersByStatus
        },
        revenue,
        products: {
          total: totalProducts,
          active: activeProducts,
          topSelling: topProducts
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê dashboard'
    });
  }
};

// Lấy hoạt động gần đây
exports.getRecentActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Đơn hàng mới
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('orderNumber status totalAmount createdAt user');

    // Users mới đăng ký
    const recentUsers = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('name email createdAt');

    res.status(200).json({
      success: true,
      data: {
        recentOrders,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy hoạt động gần đây'
    });
  }
};

// Báo cáo doanh thu theo thời gian
exports.getRevenueReport = async (req, res) => {
  try {
    const { period = 'daily', startDate, endDate } = req.query;
    
    let groupBy, dateFormat;
    switch (period) {
      case 'daily':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        dateFormat = '%Y-%m-%d';
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        dateFormat = '%Y-W%U';
        break;
      case 'monthly':
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        dateFormat = '%Y-%m';
        break;
      default:
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        dateFormat = '%Y-%m-%d';
    }

    let matchQuery = {
      status: 'delivered',
      'payment.status': 'paid'
    };

    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const revenueData = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          date: { $first: { $dateToString: { format: dateFormat, date: '$createdAt' } } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    console.error('Error fetching revenue report:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy báo cáo doanh thu'
    });
  }
};
