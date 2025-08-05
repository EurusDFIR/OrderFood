const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required:true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1,'Số lượng phải lớn hơn 0'],
        default: 1
    },
    image: {
        type: String
    }

});

// cartSchema dung cho gio hang 1 cartSchema co the chua nhieu cartItemSchema
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    itmes: [cartItemSchema],
    totalItems: {
        type: Number,
        default:0
    },
    totalAmount: {
        type: Number,
        default:0
    }
},{
    timestamps:true

});
// Su dung vitual de tao subtotal tranh luu vao db khi cac cot price va quantity thay doi
cartItemSchema.virtual('subtotal').get(function(){
    return this.price * this.quantity
})

cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  next();
});

//su dung index tang toc truy van 
cartSchema.index({user: 1});
cartSchema.index({'items.product' : 1});

module.exports = mongoose.model('Cart', cartSchema);
