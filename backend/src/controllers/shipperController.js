const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Lấy danh sách tất cả shipper
exports.getAllShippers = async (req, res) => {
  try {
    const shippers = await User.find({ role: 'shipper' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shippers.length,
      data: shippers
    });
  } catch (error) {
    console.error('Error fetching shippers:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách shipper'
    });
  }
};

// Tạo shipper mới
exports.createShipper = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      vehicleType,
      vehicleNumber,
      deliveryRadius
    } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    const shipper = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: 'shipper',
      shipperInfo: {
        vehicleType,
        vehicleNumber,
        deliveryRadius: deliveryRadius || 10,
        isAvailable: true
      }
    });

    // Không trả về password
    shipper.password = undefined;

    res.status(201).json({
      success: true,
      message: 'Tạo shipper thành công',
      data: shipper
    });
  } catch (error) {
    console.error('Error creating shipper:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo shipper'
    });
  }
};

// Cập nhật thông tin shipper
exports.updateShipper = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Không cho phép thay đổi password qua API này
    delete updates.password;
    delete updates.role;

    const shipper = await User.findOneAndUpdate(
      { _id: id, role: 'shipper' },
      updates,
      { new: true, select: '-password' }
    );

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy shipper'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật shipper thành công',
      data: shipper
    });
  } catch (error) {
    console.error('Error updating shipper:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật shipper'
    });
  }
};

// Xóa shipper
exports.deleteShipper = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra shipper có đơn hàng đang giao không
    const activeOrders = await Order.find({
      shipper: id,
      status: { $in: ['assigned_to_shipper', 'out_for_delivery'] }
    });

    if (activeOrders.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa shipper đang có đơn hàng đang giao'
      });
    }

    const shipper = await User.findOneAndDelete({ _id: id, role: 'shipper' });

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy shipper'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa shipper thành công'
    });
  } catch (error) {
    console.error('Error deleting shipper:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa shipper'
    });
  }
};

// Cập nhật trạng thái available của shipper
exports.updateShipperAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const shipper = await User.findOneAndUpdate(
      { _id: id, role: 'shipper' },
      { 'shipperInfo.isAvailable': isAvailable },
      { new: true, select: '-password' }
    );

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy shipper'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái shipper thành công',
      data: shipper
    });
  } catch (error) {
    console.error('Error updating shipper availability:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật trạng thái shipper'
    });
  }
};

// Tự động phân công shipper cho đơn hàng
exports.autoAssignShipper = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate('user');
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    // Tìm shipper có sẵn gần nhất (logic đơn giản)
    const availableShippers = await User.find({
      role: 'shipper',
      'shipperInfo.isAvailable': true
    });

    if (availableShippers.length === 0) {
      throw new Error('Không có shipper nào có sẵn');
    }

    // Chọn shipper đầu tiên (có thể cải tiến với thuật toán tìm shipper gần nhất)
    const selectedShipper = availableShippers[0];

    // Cập nhật đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        shipper: selectedShipper._id,
        status: 'assigned_to_shipper',
        assignedAt: new Date()
      },
      { new: true }
    ).populate('shipper user');

    return updatedOrder;
  } catch (error) {
    console.error('Error auto assigning shipper:', error);
    throw error;
  }
};

// Lấy đơn hàng của shipper
exports.getShipperOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    let query = { shipper: id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name phone')
      .populate('items.product', 'name')
      .sort({ assignedAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching shipper orders:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy đơn hàng của shipper'
    });
  }
};

// Thống kê hiệu suất shipper
exports.getShipperStats = async (req, res) => {
  try {
    const { id } = req.params;

    const stats = await Order.aggregate([
      { $match: { shipper: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, '$totalAmount', 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalOrders: 0,
      completedOrders: 0,
      totalRevenue: 0
    };

    result.completionRate = result.totalOrders > 0 
      ? ((result.completedOrders / result.totalOrders) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching shipper stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê shipper'
    });
  }
};
