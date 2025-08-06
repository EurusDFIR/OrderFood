const crypto = require('crypto');
const axios = require('axios');

class PaymentService {
  
  // ===== MOMO PAYMENT =====
  static async createMoMoPayment(orderInfo) {
    try {
      const {
        orderId,
        amount,
        orderInfo: description,
        redirectUrl,
        ipnUrl,
        requestId
      } = orderInfo;

      // MoMo config (test environment)
      const partnerCode = process.env.MOMO_PARTNER_CODE || 'MOMOBKUN20180529';
      const accessKey = process.env.MOMO_ACCESS_KEY || 'klm05TvNBzhg7h7j';
      const secretKey = process.env.MOMO_SECRET_KEY || 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
      const requestType = 'captureWallet';
      const extraData = '';

      // Create signature
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${description}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

      const requestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo: description,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature
      };

      const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody);
      
      return {
        success: true,
        paymentUrl: response.data.payUrl,
        deeplink: response.data.deeplink,
        qrCodeUrl: response.data.qrCodeUrl,
        transactionId: response.data.requestId
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== BANKING QR CODE =====
  static generateBankingQR(orderInfo) {
    try {
      const {
        amount,
        orderId,
        bankCode = 'TECHCOMBANK',
        accountNumber = '19036896986012'
      } = orderInfo;

      // Generate QR content for banking
      const qrContent = `2|99|${bankCode}|${accountNumber}|${amount}|${orderId}|0|0|63|04`;
      
      // You can use a QR code generation library here
      // For now, return the content that can be used to generate QR
      return {
        success: true,
        qrContent,
        accountInfo: {
          bankName: 'Techcombank',
          accountNumber,
          accountName: 'ORDERFOOD RESTAURANT',
          amount,
          content: `Thanh toan don hang ${orderId}`
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== UTILITY FUNCTIONS =====
  // Verify MoMo signature
  static verifyMoMoSignature(params) {
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = params;

    const secretKey = process.env.MOMO_SECRET_KEY || 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
    
    const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
    
    return signature === expectedSignature;
  }
}

module.exports = PaymentService;
