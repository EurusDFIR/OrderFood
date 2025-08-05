const { validationResult } = require('express-validator');

/**
 * Middleware để validate request theo rules đã định nghĩa
 */
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages
    });
  }
  
  next();
};
