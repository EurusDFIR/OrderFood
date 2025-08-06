const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');


// @desc    Lấy giỏ hàng của user
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    cart = await Cart.create({ 
      user: req.user._id, 
      items: [],
      totalItems: 0,
      totalAmount: 0
    });
  }

  // Populate sau khi đã có cart
  if (cart.items && cart.items.length > 0) {
    await cart.populate('items.product', 'name price image isAvailable');
    
    // Kiểm tra sản phẩm còn available không
    const updatedItems = cart.items.filter(item => {
      if (!item.product || !item.product.isAvailable) {
        return false;
      }
      return true;
    });

    if (updatedItems.length !== cart.items.length) {
      cart.items = updatedItems;
      await cart.save();
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

// @desc    Thêm sản phẩm vào giỏ hàng
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  // Kiểm tra sản phẩm có tồn tại và available không
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Sản phẩm không tồn tại', 404));
  }

  if (!product.isAvailable) {
    return next(new AppError('Sản phẩm hiện tại không khả dụng', 400));
  }

  // Tìm hoặc tạo cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Đảm bảo items luôn là array
  if (!cart.items || !Array.isArray(cart.items)) {
    cart.items = [];
  }

  // Kiểm tra sản phẩm đã có trong cart chưa
  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Cập nhật số lượng
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Thêm sản phẩm mới
    cart.items.push({
      product: productId,
      name: product.name,
      price: product.finalPrice, // Sử dụng giá sau discount
      quantity,
      image: product.image
    });
  }

  await cart.save();

  // Populate để trả về thông tin đầy đủ - chỉ populate nếu có items
  if (cart.items && cart.items.length > 0) {
    await cart.populate('items.product', 'name price image isAvailable');
  }

  res.status(200).json({
    status: 'success',
    message: 'Đã thêm sản phẩm vào giỏ hàng',
    data: {
      cart
    }
  });
});

// @desc    Cập nhật số lượng sản phẩm trong giỏ hàng
// @route   PUT /api/cart/update
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) {
    return next(new AppError('Số lượng phải lớn hơn 0', 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Giỏ hàng không tồn tại', 404));
  }

  // Đảm bảo items luôn là array
  if (!cart.items || !Array.isArray(cart.items)) {
    cart.items = [];
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new AppError('Sản phẩm không có trong giỏ hàng', 404));
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  // Populate chỉ khi có items
  if (cart.items && cart.items.length > 0) {
    await cart.populate('items.product', 'name price image isAvailable');
  }

  res.status(200).json({
    status: 'success',
    message: 'Đã cập nhật giỏ hàng',
    data: {
      cart
    }
  });
});

// @desc    Xóa sản phẩm khỏi giỏ hàng
// @route   DELETE /api/cart/remove/:productId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Giỏ hàng không tồn tại', 404));
  }

  // Đảm bảo items luôn là array
  if (!cart.items || !Array.isArray(cart.items)) {
    cart.items = [];
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  await cart.save();
  
  // Populate chỉ khi còn items
  if (cart.items && cart.items.length > 0) {
    await cart.populate('items.product', 'name price image isAvailable');
  }

  res.status(200).json({
    status: 'success',
    message: 'Đã xóa sản phẩm khỏi giỏ hàng',
    data: {
      cart
    }
  });
});

// @desc    Xóa toàn bộ giỏ hàng
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Giỏ hàng không tồn tại', 404));
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Đã xóa toàn bộ giỏ hàng',
    data: {
      cart
    }
  });
});