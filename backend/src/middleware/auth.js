const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware để protect routes
exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted from header:', token);
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
      console.log('Token extracted from cookie:', token);
    }

    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({
        status: 'error',
        message: 'Bạn chưa đăng nhập! Vui lòng đăng nhập để truy cập.'
      });
    }

    console.log('Verifying token with JWT_SECRET...');
    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'Người dùng với token này không còn tồn tại.'
      });
    }

    // 4) Check if user is active
    if (!currentUser.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Tài khoản đã bị vô hiệu hóa.'
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Token không hợp lệ'
    });
  }
};

// Middleware để restrict to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log('=== RESTRICT TO MIDDLEWARE ===');
    console.log('Required roles:', roles);
    console.log('User role:', req.user?.role);
    console.log('Route path:', req.path);
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền thực hiện hành động này'
      });
    }
    next();
  };
};
