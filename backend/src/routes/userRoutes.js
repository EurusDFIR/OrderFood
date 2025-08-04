const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const validation = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validation.validateRegister, userController.register);
router.post('/login', validation.validateLogin, userController.login);

// Protected routes (require authentication)
router.use(authMiddleware.protect); // All routes after this middleware are protected

router.get('/me', userController.getMe);
router.put('/me', validation.validateUpdateMe, userController.updateMe);
router.put('/change-password', validation.validateChangePassword, userController.changePassword);

module.exports = router;
