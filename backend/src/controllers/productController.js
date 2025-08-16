const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Lấy tất cả sản phẩm với filter và pagination
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    // Build base query with filters
    let baseQuery = { isAvailable: true };
    
    // Handle filters
    if (req.query.category && req.query.category !== 'all' && req.query.category !== '') {
      baseQuery.category = req.query.category;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      baseQuery.price = {};
      if (req.query.minPrice) baseQuery.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) baseQuery.price.$lte = parseFloat(req.query.maxPrice);
    }
    
    if (req.query.minRating) {
      baseQuery['ratings.average'] = { $gte: parseFloat(req.query.minRating) };
    }

    let query = Product.find(baseQuery);

    // Advanced sorting
    if (req.query.sort) {
      const sortOption = req.query.sort;
      switch (sortOption) {
        case 'price-asc':
          query = query.sort({ price: 1 });
          break;
        case 'price-desc':
          query = query.sort({ price: -1 });
          break;
        case 'name-asc':
          query = query.sort({ name: 1 });
          break;
        case 'name-desc':
          query = query.sort({ name: -1 });
          break;
        case 'rating-desc':
          query = query.sort({ 'ratings.average': -1, 'ratings.count': -1 });
          break;
        case 'popular':
          query = query.sort({ isPopular: -1, 'ratings.average': -1 });
          break;
        case 'newest':
          query = query.sort({ createdAt: -1 });
          break;
        default:
          query = query.sort({ createdAt: -1 });
      }
    } else {
      query = query.sort({ createdAt: -1 });
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 12;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const products = await query;
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(baseQuery);
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
      appliedFilters: {
        category: req.query.category || null,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
        minRating: req.query.minRating ? parseFloat(req.query.minRating) : null,
        sort: req.query.sort || 'newest'
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

// @desc    Lấy danh sách categories
// @route   GET /api/products/categories  
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    // Get distinct categories from products
    const categories = await Product.distinct('category', { isAvailable: true });
    
    // Get category stats
    const categoryStats = await Product.aggregate([
      { $match: { isAvailable: true } },
      { 
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: {
        categories,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
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
// @route   GET /api/products/search?q=query
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Query parameter "q" is required'
      });
    }
    
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 12;
    const skip = (page - 1) * limit;
    
    // Add filters support
    const category = req.query.category;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const minRating = req.query.minRating ? parseFloat(req.query.minRating) : null;
    
    // Vietnamese text normalization function
    const normalizeVietnamese = (str) => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd');
    };
    
    const normalizedQuery = normalizeVietnamese(query);
    const searchWords = normalizedQuery.split(' ').filter(word => word.length > 0);
    
    // Build comprehensive search with both original and normalized text
    const searchConditions = [];
    
    // Original search (with diacritics)
    searchConditions.push({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    });
    
    // Normalized search (without diacritics) - more flexible
    searchWords.forEach(word => {
      if (word.length >= 2) { // Only search words with 2+ characters
        searchConditions.push({
          $or: [
            { name: { $regex: word, $options: 'i' } },
            { description: { $regex: word, $options: 'i' } },
            { category: { $regex: word, $options: 'i' } },
            { tags: { $in: [new RegExp(word, 'i')] } },
            // Additional partial matching for Vietnamese
            { name: { $regex: word.replace(/[aeiou]/g, '[aăâáàảãạăắằẳẵặâấầẩẫậ]')
                                 .replace(/e/g, '[eêéèẻẽẹêếềểễệ]')
                                 .replace(/i/g, '[iíìỉĩị]')
                                 .replace(/o/g, '[oôơóòỏõọôốồổỗộơớờởỡợ]')
                                 .replace(/u/g, '[uưúùủũụưứừửữự]')
                                 .replace(/y/g, '[yýỳỷỹỵ]')
                                 .replace(/d/g, '[dđ]'), $options: 'i' } }
          ]
        });
      }
    });

    // Build main query
    const mainQuery = {
      $and: [
        { $or: searchConditions },
        { isAvailable: true }
      ]
    };
    
    // Add filters
    if (category && category !== 'all' && category !== '') {
      mainQuery.$and.push({ category: category });
    }

    if (minPrice !== null || maxPrice !== null) {
      const priceFilter = {};
      if (minPrice !== null) priceFilter.$gte = minPrice;
      if (maxPrice !== null) priceFilter.$lte = maxPrice;
      mainQuery.$and.push({ price: priceFilter });
    }

    if (minRating !== null) {
      mainQuery.$and.push({ 'ratings.average': { $gte: minRating } });
    }

    const products = await Product.find(mainQuery)
    .sort({ 'ratings.average': -1, name: 1 })
    .skip(skip)
    .limit(limit);

    const totalProducts = await Product.countDocuments(mainQuery);

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
