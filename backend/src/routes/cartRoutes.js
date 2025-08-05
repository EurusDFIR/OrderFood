const express = require('express');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
}=require('../controllers/cartController');

const { protect } = require('../middleware/auth');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// Tat ca cart Routes deu can authentication

router.use(protect);

//Cart validation rules

const addToCartValidation = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID la Bat buoc')
        .isMongoId()
        .withMessage("Product ID khong hop le"),
    body('quantity')
        .optional()
        .isInt({min: 1, max: 50})
        .withMessage('So luong phai tu 1-50'),
    validateRequest
];

const updateCartValidation = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID la bat buoc')
        .isMongoId()
        .withMessage('Product ID khong hop le'), 
    body('quantity')
        .isInt({min: 1,max: 50})
        .withMessage('So luong phai tu 1-50'),
    validateRequest
];

//Routes

router.route('/')
    .get(getCart);
router.post('/add',addToCartValidation, addToCart);
router.put('/update', updateCartValidation, updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;

