const express = require('express');
const router = express.Router();
const EmailService = require('../services/emailService');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');

// Test email connection
router.get('/email', protect, restrictTo('admin'), async (req, res) => {
  try {
    const result = await EmailService.testConnection();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Email service connection successful',
        data: result
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Email service connection failed',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email test failed',
      error: error.message
    });
  }
});

// Send test invoice email
router.post('/send-invoice', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    // Get payment with populated data
    const payment = await Payment.findOne({ paymentId })
      .populate({
        path: 'orderId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Prepare invoice data
    const invoiceData = {
      customerEmail: payment.orderId.userId.email,
      customerName: payment.orderId.userId.name,
      invoiceNumber: `INV-${payment.paymentId}`,
      orderNumber: payment.orderId.orderNumber,
      total: payment.amount,
      paymentMethod: payment.paymentMethod
    };

    // Send invoice email
    const emailResult = await EmailService.sendInvoiceEmail(invoiceData);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'Test invoice email sent successfully',
        data: {
          emailResult,
          invoiceData: {
            ...invoiceData,
            customerEmail: invoiceData.customerEmail.replace(/(.{2}).*(@.*)/, '$1***$2') // Hide email for security
          }
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test invoice email',
        error: emailResult.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test invoice email failed',
      error: error.message
    });
  }
});

// Send test payment confirmation email
router.post('/send-confirmation', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    // Get payment with populated data
    const payment = await Payment.findOne({ paymentId })
      .populate({
        path: 'orderId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Prepare payment confirmation data
    const confirmationData = {
      customerEmail: payment.orderId.userId.email,
      customerName: payment.orderId.userId.name,
      orderNumber: payment.orderId.orderNumber,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.gatewayData?.transactionId || payment.paymentId
    };

    // Send confirmation email
    const emailResult = await EmailService.sendPaymentConfirmationEmail(confirmationData);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'Test payment confirmation email sent successfully',
        data: {
          emailResult,
          confirmationData: {
            ...confirmationData,
            customerEmail: confirmationData.customerEmail.replace(/(.{2}).*(@.*)/, '$1***$2') // Hide email for security
          }
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test confirmation email',
        error: emailResult.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test confirmation email failed',
      error: error.message
    });
  }
});

// Test all payment methods
router.post('/payment-methods', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await Order.findById(orderId).populate('userId');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const testResults = {
      cash: null,
      momo: null,
      banking: null
    };

    // Test each payment method
    for (const method of ['cash', 'momo', 'banking']) {
      try {
        const PaymentController = require('../controllers/paymentController');
        
        // Mock request and response
        const mockReq = {
          body: { orderId, paymentMethod: method },
          user: { userId: order.userId._id }
        };
        
        let mockRes = {
          statusCode: null,
          jsonData: null,
          status: function(code) {
            this.statusCode = code;
            return this;
          },
          json: function(data) {
            this.jsonData = data;
            return this;
          }
        };

        // Call payment creation
        await PaymentController.createPayment(mockReq, mockRes);
        
        testResults[method] = {
          success: mockRes.statusCode === 201,
          statusCode: mockRes.statusCode,
          data: mockRes.jsonData
        };
      } catch (error) {
        testResults[method] = {
          success: false,
          error: error.message
        };
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment methods test completed',
      data: testResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment methods test failed',
      error: error.message
    });
  }
});

module.exports = router;
