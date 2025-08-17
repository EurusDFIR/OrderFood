const { body } = require('express-validator');

// Validation cho đăng ký
exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tên là bắt buộc')
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên phải có từ 2-50 ký tự'),
  
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  
  body('phone')
    .optional()
    .matches(/^[\+]?[0-9\s\-\(\)]{8,15}$/)
    .withMessage('Số điện thoại không hợp lệ (8-15 số, có thể có +, -, (), space)'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Địa chỉ không được vượt quá 200 ký tự')
];

// Validation cho đăng nhập
exports.validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu là bắt buộc')
];

// Validation cho cập nhật thông tin
exports.validateUpdateMe = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tên phải có từ 2-50 ký tự'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Địa chỉ không được vượt quá 200 ký tự')
];

// Validation cho đổi mật khẩu
exports.validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Mật khẩu hiện tại là bắt buộc'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu mới phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Xác nhận mật khẩu không khớp');
      }
      return true;
    })
];

// Validation cho tạo sản phẩm
exports.validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tên món ăn là bắt buộc')
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên món ăn phải có từ 2-100 ký tự'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Mô tả món ăn là bắt buộc')
    .isLength({ min: 10, max: 500 })
    .withMessage('Mô tả phải có từ 10-500 ký tự'),
  
  body('price')
    .isNumeric()
    .withMessage('Giá phải là số')
    .isFloat({ min: 0 })
    .withMessage('Giá không được âm'),
  
  body('category')
    .notEmpty()
    .withMessage('Danh mục là bắt buộc')
    .isIn(['main-dish', 'appetizer', 'snack', 'beverage', 'dessert'])
    .withMessage('Danh mục không hợp lệ'),
  
  body('image')
    .optional()
    .isURL()
    .withMessage('Link hình ảnh không hợp lệ'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images phải là mảng'),
  
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Link hình ảnh trong mảng không hợp lệ'),
  
  body('preparationTime')
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage('Thời gian chuẩn bị phải từ 1-120 phút'),
  
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Nguyên liệu phải là mảng'),
  
  body('nutritionInfo.calories')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Calories không được âm'),
  
  body('nutritionInfo.protein')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Protein không được âm'),
  
  body('nutritionInfo.carbs')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Carbs không được âm'),
  
  body('nutritionInfo.fat')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fat không được âm'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags phải là mảng'),
  
  body('discount.percentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Phần trăm giảm giá phải từ 0-100'),
  
  body('discount.startDate')
    .optional()
    .isISO8601()
    .withMessage('Ngày bắt đầu giảm giá không hợp lệ'),
  
  body('discount.endDate')
    .optional()
    .isISO8601()
    .withMessage('Ngày kết thúc giảm giá không hợp lệ')
    .custom((value, { req }) => {
      if (req.body.discount?.startDate && value <= req.body.discount.startDate) {
        throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
      }
      return true;
    })
];

// Validation cho cập nhật sản phẩm
exports.validateUpdateProduct = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên món ăn phải có từ 2-100 ký tự'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Mô tả phải có từ 10-500 ký tự'),
  
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Giá phải là số')
    .isFloat({ min: 0 })
    .withMessage('Giá không được âm'),
  
  body('category')
    .optional()
    .isIn(['main-dish', 'appetizer', 'snack', 'beverage', 'dessert'])
    .withMessage('Danh mục không hợp lệ'),
  
  body('image')
    .optional()
    .isURL()
    .withMessage('Link hình ảnh không hợp lệ'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images phải là mảng'),
  
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Link hình ảnh trong mảng không hợp lệ'),
  
  body('preparationTime')
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage('Thời gian chuẩn bị phải từ 1-120 phút'),
  
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Nguyên liệu phải là mảng'),
  
  body('nutritionInfo.calories')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Calories không được âm'),
  
  body('nutritionInfo.protein')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Protein không được âm'),
  
  body('nutritionInfo.carbs')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Carbs không được âm'),
  
  body('nutritionInfo.fat')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fat không được âm'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags phải là mảng'),
  
  body('discount.percentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Phần trăm giảm giá phải từ 0-100'),
  
  body('discount.startDate')
    .optional()
    .isISO8601()
    .withMessage('Ngày bắt đầu giảm giá không hợp lệ'),
  
  body('discount.endDate')
    .optional()
    .isISO8601()
    .withMessage('Ngày kết thúc giảm giá không hợp lệ')
    .custom((value, { req }) => {
      if (req.body.discount?.startDate && value <= req.body.discount.startDate) {
        throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
      }
      return true;
    })
];
