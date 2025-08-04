const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên món ăn là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên món ăn không được vượt quá 100 ký tự']
  },
  description: {
    type: String,
    required: [true, 'Mô tả món ăn là bắt buộc'],
    trim: true,
    maxlength: [500, 'Mô tả không được vượt quá 500 ký tự']
  },
  price: {
    type: Number,
    required: [true, 'Giá món ăn là bắt buộc'],
    min: [0, 'Giá không được âm']
  },
  category: {
    type: String,
    required: [true, 'Danh mục là bắt buộc'],
    enum: {
      values: ['com', 'pho', 'bun', 'banh-mi', 'do-uong', 'trang-mieng', 'mon-chay', 'lau', 'nuong', 'khac'],
      message: 'Danh mục không hợp lệ'
    }
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Food+Image'
  },
  images: [{
    type: String
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // minutes
    default: 15,
    min: [1, 'Thời gian chuẩn bị ít nhất 1 phút'],
    max: [120, 'Thời gian chuẩn bị không được quá 120 phút']
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  nutritionInfo: {
    calories: {
      type: Number,
      min: [0, 'Calories không được âm']
    },
    protein: {
      type: Number,
      min: [0, 'Protein không được âm']
    },
    carbs: {
      type: Number, 
      min: [0, 'Carbs không được âm']
    },
    fat: {
      type: Number,
      min: [0, 'Fat không được âm']
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating không được âm'],
      max: [5, 'Rating không được vượt quá 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Số lượng rating không được âm']
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPopular: {
    type: Boolean,
    default: false
  },
  discount: {
    percentage: {
      type: Number,
      default: 0,
      min: [0, 'Giảm giá không được âm'],
      max: [100, 'Giảm giá không được vượt quá 100%']
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field cho giá sau khi giảm
productSchema.virtual('finalPrice').get(function() {
  if (this.discount.percentage > 0 && 
      this.discount.startDate && 
      this.discount.endDate &&
      new Date() >= this.discount.startDate && 
      new Date() <= this.discount.endDate) {
    return this.price * (1 - this.discount.percentage / 100);
  }
  return this.price;
});

// Index cho tìm kiếm
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ createdAt: -1 });

// Middleware để populate createdBy
productSchema.pre(/^find/, function(next) {
  if (this.getOptions().skipPopulate) {
    return next();
  }
  
  this.populate({
    path: 'createdBy',
    select: 'name email'
  });
  next();
});

module.exports = mongoose.model('Product', productSchema);
