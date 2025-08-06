const Payment = require('../models/Payment');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const PaymentService = require('../services/paymentService');
const EmailService = require('../services/emailService');

// @desc    Tạo payment cho đơn hàng
// @route   POST /api/payments/create
// @access  Private
exports.createPayment = asyncHandler(async (req, res, next) => {
  const { orderId, paymentMethod } = req.body;

  // Lấy thông tin đơn hàng
  const order = await Order.findById(orderId).populate('user', 'name email phone');
  if (!order) {
    return next(new AppError('Đơn hàng không tồn tại', 404));
  }

  // Kiểm tra quyền
  if (order.user._id.toString() !== req.user._id.toString()) {
    return next(new AppError('Bạn không có quyền thanh toán đơn hàng này', 403));
  }

  // Kiểm tra trạng thái đơn hàng
  if (order.status !== 'pending' && order.status !== 'confirmed') {
    return next(new AppError('Đơn hàng không thể thanh toán ở trạng thái hiện tại', 400));
  }

  const finalAmount = order.totalAmount;

  // Tạo payment record
  const payment = await Payment.create({
    order: orderId,
    user: req.user._id,
    amount: finalAmount,
    method: paymentMethod,
    status: paymentMethod === 'cash' ? 'completed' : 'pending',
    metadata: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    }
  });

  let paymentData = {
    paymentId: payment.paymentId,
    amount: finalAmount,
    method: paymentMethod,
    status: payment.status
  };

  // Xử lý thanh toán theo method
  if (paymentMethod === 'cash') {
    // Thanh toán tiền mặt - mark as completed
    payment.status = 'completed';
    payment.paidAt = new Date();
    await payment.save();

    // Update order
    order.payment.status = 'paid';
    order.status = 'confirmed';
    await order.save();

  } else if (paymentMethod === 'momo') {
    // Tạo MoMo payment
    const momoData = await PaymentService.createMoMoPayment({
      orderId: payment.paymentId,
      amount: finalAmount,
      orderInfo: `Thanh toan don hang ${order.orderNumber}`,
      redirectUrl: `${process.env.FRONTEND_URL}/payment/success`,
      ipnUrl: `${process.env.BACKEND_URL}/api/payments/momo/ipn`,
      requestId: payment.paymentId
    });

    if (momoData.success) {
      payment.gatewayData = {
        paymentUrl: momoData.paymentUrl,
        qrCode: momoData.qrCodeUrl,
        transactionId: momoData.transactionId
      };
      await payment.save();

      paymentData.paymentUrl = momoData.paymentUrl;
      paymentData.qrCodeUrl = momoData.qrCodeUrl;
    } else {
      return next(new AppError('Lỗi tạo thanh toán MoMo: ' + momoData.error, 500));
    }

  } else if (paymentMethod === 'banking') {
    // Tạo QR banking
    const bankingData = PaymentService.generateBankingQR({
      orderId: payment.paymentId,
      amount: finalAmount
    });

    if (bankingData.success) {
      payment.gatewayData = {
        qrCode: bankingData.qrContent
      };
      await payment.save();

      paymentData.bankingInfo = bankingData.accountInfo;
      paymentData.qrContent = bankingData.qrContent;
    } else {
      return next(new AppError('Lỗi tạo QR chuyển khoản: ' + bankingData.error, 500));
    }
  }

  res.status(201).json({
    status: 'success',
    message: 'Tạo thanh toán thành công',
    data: {
      payment: paymentData
    }
  });
});

// @desc    Xác nhận thanh toán (cho banking/manual)
// @route   PUT /api/payments/:paymentId/confirm
// @access  Private/Admin
exports.confirmPayment = asyncHandler(async (req, res, next) => {
  const { paymentId } = req.params;
  const { transactionId, notes } = req.body;

  const payment = await Payment.findOne({ paymentId }).populate([
    { path: 'order', populate: { path: 'user', select: 'name email phone' } },
    { path: 'user', select: 'name email phone' }
  ]);

  if (!payment) {
    return next(new AppError('Payment không tồn tại', 404));
  }

  if (payment.status === 'completed') {
    return next(new AppError('Payment đã được xác nhận', 400));
  }

  // Update payment
  payment.status = 'completed';
  payment.paidAt = new Date();
  if (transactionId) {
    payment.gatewayData.transactionId = transactionId;
  }
  if (notes) {
    payment.metadata.notes = notes;
  }
  await payment.save();

  // Update order
  const order = payment.order;
  order.payment.status = 'paid';
  order.status = 'confirmed';
  await order.save();

  // Tạo và gửi invoice
  await this.generateAndSendInvoice(payment);

  res.status(200).json({
    status: 'success',
    message: 'Xác nhận thanh toán thành công',
    data: { payment }
  });
});

// @desc    MoMo IPN callback
// @route   POST /api/payments/momo/ipn
// @access  Public
exports.momoIPN = asyncHandler(async (req, res) => {
  const params = req.body;
  
  // Verify signature
  const isValidSignature = PaymentService.verifyMoMoSignature(params);
  if (!isValidSignature) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const { orderId, resultCode, transId } = params;
  
  const payment = await Payment.findOne({ paymentId: orderId }).populate([
    { path: 'order', populate: { path: 'user', select: 'name email phone' } }
  ]);

  if (!payment) {
    return res.status(404).json({ message: 'Payment not found' });
  }

  if (resultCode === 0) {
    // Success
    payment.status = 'completed';
    payment.paidAt = new Date();
    payment.gatewayData.transactionId = transId;
    payment.gatewayData.gatewayStatus = 'success';
    
    // Update order
    payment.order.payment.status = 'paid';
    payment.order.status = 'confirmed';
    await payment.order.save();
    
    // Generate invoice
    await this.generateAndSendInvoice(payment);
  } else {
    // Failed
    payment.status = 'failed';
    payment.failedAt = new Date();
    payment.gatewayData.gatewayStatus = 'failed';
    payment.gatewayData.gatewayMessage = params.message;
  }

  await payment.save();
  
  res.status(200).json({ message: 'OK' });
});

// @desc    Lấy thông tin payment
// @route   GET /api/payments/:paymentId
// @access  Private
exports.getPayment = asyncHandler(async (req, res, next) => {
  const { paymentId } = req.params;

  const payment = await Payment.findOne({ paymentId })
    .populate('order', 'orderNumber totalAmount status')
    .populate('user', 'name email phone');

  if (!payment) {
    return next(new AppError('Payment không tồn tại', 404));
  }

  // Kiểm tra quyền
  if (payment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Bạn không có quyền xem payment này', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { payment }
  });
});

// @desc    Generate and send invoice
// @access  Private helper method
exports.generateAndSendInvoice = async (payment) => {
  try {
    // Tạo invoice
    const invoice = await Invoice.create({
      order: payment.order._id,
      payment: payment._id,
      user: payment.user._id || payment.order.user._id,
      customerInfo: {
        name: payment.order.user.name,
        email: payment.order.user.email,
        phone: payment.order.user.phone,
        address: payment.order.deliveryInfo.address
      },
      items: payment.order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      subtotal: payment.order.itemsPrice,
      deliveryFee: payment.order.deliveryFee,
      discount: payment.order.discount,
      total: payment.amount,
      paymentMethod: payment.method,
      paymentStatus: payment.status,
      paidAt: payment.paidAt
    });

    // Gửi email invoice
    const emailResult = await EmailService.sendInvoiceEmail({
      customerEmail: payment.order.user.email,
      customerName: payment.order.user.name,
      invoiceNumber: invoice.invoiceNumber,
      orderNumber: payment.order.orderNumber,
      total: payment.amount,
      paymentMethod: payment.method
    });

    if (emailResult.success) {
      invoice.emailSent = true;
      invoice.emailSentAt = emailResult.sentAt;
      await invoice.save();
    }

    // Gửi email xác nhận thanh toán
    await EmailService.sendPaymentConfirmationEmail({
      customerEmail: payment.order.user.email,
      customerName: payment.order.user.name,
      orderNumber: payment.order.orderNumber,
      amount: payment.amount,
      paymentMethod: payment.method,
      transactionId: payment.gatewayData?.transactionId
    });

    return invoice;
  } catch (error) {
    console.error('Generate invoice error:', error);
    throw error;
  }
};

module.exports = exports;
