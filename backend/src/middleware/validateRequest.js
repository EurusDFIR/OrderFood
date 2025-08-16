const { validationResult } = require('express-validator');

/**
 * Middleware để validate request theo rules đã định nghĩa
 */
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  console.log("🔍 Validation check:", {
    url: req.url,
    method: req.method,
    body: req.body,
    hasErrors: !errors.isEmpty(),
    errorCount: errors.array().length
  });
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    console.log("❌ Validation errors:", errorMessages);

    return res.status(400).json({
      status: 'error',
      message: 'Dữ liệu không hợp lệ',
      errors: errorMessages
    });
  }
  
  console.log("✅ Validation passed");
  next();
};
