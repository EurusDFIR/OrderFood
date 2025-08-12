const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Tạo JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Tạo và gửi token response
const createSendToken = (user, statusCode, res) => {
  const accessToken = signToken(user._id);
  const refreshToken = signToken(user._id); // In real app, this should be different
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', accessToken, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
      tokens: {
        accessToken,
        refreshToken
      }
    }
  });
};

// @desc    Đăng ký user mới
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email đã được sử dụng'
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      address
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Đăng nhập user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Email hoặc mật khẩu không chính xác'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Tài khoản đã bị vô hiệu hóa'
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Cập nhật thông tin user
// @route   PUT /api/users/me
// @access  Private
exports.updateMe = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    // Create filtered object of allowed fields to update
    const filteredBody = {};
    const allowedFields = ['name', 'phone', 'address'];
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) filteredBody[key] = req.body[key];
    });

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Update me error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Đổi mật khẩu
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({
        status: 'error',
        message: 'Mật khẩu hiện tại không chính xác'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};
