const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const validation = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/popular', productController.getPopularProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/search/:query', productController.searchProducts);
router.get('/:id', productController.getProduct);

// Protected routes (require authentication)
router.use(authMiddleware.protect);

// Admin only routes
router.use(authMiddleware.restrictTo('admin'));

router.post('/', validation.validateCreateProduct, productController.createProduct);
router.put('/:id', validation.validateUpdateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
