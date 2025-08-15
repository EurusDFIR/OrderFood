const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên là bắt buộc'],
    trim: true,
    maxlength: [50, 'Tên không được vượt quá 50 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Email không hợp lệ'
    ]
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu là bắt buộc'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false // Không trả về password khi query
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[0-9\s\-\(\)]{8,15}$/, 'Số điện thoại không hợp lệ (8-15 số)']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Địa chỉ không được vượt quá 200 ký tự']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware để hash password trước khi save
userSchema.pre('save', async function(next) {
  // Chỉ hash password nếu nó đã được modify
  if (!this.isModified('password')) return next();
  
  // Hash password với cost 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method để compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method để tạo user object không có sensitive data
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
