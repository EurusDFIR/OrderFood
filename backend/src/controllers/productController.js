const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Lấy tất cả sản phẩm với filter và pagination
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Text search
    if (req.query.search) {
      query = query.find({
        $text: { $search: req.query.search }
      });
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const products = await query;
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(JSON.parse(queryStr));
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        page,
        limit,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy sản phẩm theo danh mục
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ 
      category: category,
      isAvailable: true 
    })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

    const totalProducts = await Product.countDocuments({ 
      category: category,
      isAvailable: true 
    });

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
      },
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy sản phẩm phổ biến
// @route   GET /api/products/popular
// @access  Public
exports.getPopularProducts = async (req, res) => {
  try {
    const limit = req.query.limit * 1 || 8;

    const products = await Product.find({ 
      isAvailable: true,
      $or: [
        { isPopular: true },
        { 'ratings.average': { $gte: 4 } }
      ]
    })
    .sort({ 'ratings.average': -1, 'ratings.count': -1 })
    .limit(limit);

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get popular products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy chi tiết một sản phẩm
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'ID sản phẩm không hợp lệ'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Tạo sản phẩm mới
// @route   POST /api/products
// @access  Private (Admin only)
exports.createProduct = async (req, res) => {
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

    // Add user id to product
    req.body.createdBy = req.user.id;

    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        status: 'error',
        message: 'Dữ liệu không hợp lệ',
        errors
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private (Admin only)
exports.updateProduct = async (req, res) => {
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

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'ID sản phẩm không hợp lệ'
      });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        status: 'error',
        message: 'Dữ liệu không hợp lệ',
        errors
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'ID sản phẩm không hợp lệ'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Tìm kiếm sản phẩm
// @route   GET /api/products/search/:query
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.params;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ]
        },
        { isAvailable: true }
      ]
    })
    .sort({ 'ratings.average': -1 })
    .skip(skip)
    .limit(limit);

    const totalProducts = await Product.countDocuments({
      $and: [
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ]
        },
        { isAvailable: true }
      ]
    });

    res.status(200).json({
      status: 'success',
      results: products.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
      },
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Lỗi server',
      error: error.message
    });
  }
};
