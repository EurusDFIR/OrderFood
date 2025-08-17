const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên danh mục là bắt buộc'],
    unique: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: [true, 'Tên hiển thị là bắt buộc'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: '🍽️'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual để đếm số sản phẩm trong danh mục
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: 'name',
  foreignField: 'category',
  count: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
