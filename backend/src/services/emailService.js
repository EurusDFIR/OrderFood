const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    // Cấu hình SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // hoặc smtp khác
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      }
    });
  }

  // Send invoice email
  async sendInvoiceEmail(invoiceData, pdfPath = null) {
    try {
      const {
        customerEmail,
        customerName,
        invoiceNumber,
        orderNumber,
        total,
        paymentMethod
      } = invoiceData;

      // Email template
      const htmlContent = this.generateInvoiceEmailTemplate({
        customerName,
        invoiceNumber,
        orderNumber,
        total,
        paymentMethod
      });

      const mailOptions = {
        from: {
          name: 'OrderFood Restaurant',
          address: process.env.EMAIL_USER || 'noreply@orderfood.com'
        },
        to: customerEmail,
        subject: `Hóa đơn thanh toán #${invoiceNumber} - OrderFood`,
        html: htmlContent,
        attachments: []
      };

      // Attach PDF if available
      if (pdfPath && fs.existsSync(pdfPath)) {
        mailOptions.attachments.push({
          filename: `invoice-${invoiceNumber}.pdf`,
          path: pdfPath,
          contentType: 'application/pdf'
        });
      }

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        sentAt: new Date()
      };
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send payment confirmation email
  async sendPaymentConfirmationEmail(paymentData) {
    try {
      const {
        customerEmail,
        customerName,
        orderNumber,
        amount,
        paymentMethod,
        transactionId
      } = paymentData;

      const htmlContent = this.generatePaymentConfirmationTemplate({
        customerName,
        orderNumber,
        amount,
        paymentMethod,
        transactionId
      });

      const mailOptions = {
        from: {
          name: 'OrderFood Restaurant',
          address: process.env.EMAIL_USER || 'noreply@orderfood.com'
        },
        to: customerEmail,
        subject: `Xác nhận thanh toán đơn hàng #${orderNumber} - OrderFood`,
        html: htmlContent
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('Payment confirmation email error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate invoice email template
  generateInvoiceEmailTemplate(data) {
    const { customerName, invoiceNumber, orderNumber, total, paymentMethod } = data;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
            .logo { font-size: 24px; font-weight: bold; color: #007bff; }
            .content { padding: 20px 0; }
            .invoice-info { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🍜 OrderFood</div>
                <h2>Hóa đơn thanh toán</h2>
            </div>
            
            <div class="content">
                <p>Xin chào <strong>${customerName}</strong>,</p>
                
                <p>Cảm ơn bạn đã thanh toán đơn hàng. Dưới đây là thông tin hóa đơn của bạn:</p>
                
                <div class="invoice-info">
                    <p><strong>Số hóa đơn:</strong> ${invoiceNumber}</p>
                    <p><strong>Số đơn hàng:</strong> ${orderNumber}</p>
                    <p><strong>Tổng tiền:</strong> ${total.toLocaleString('vi-VN')}đ</p>
                    <p><strong>Phương thức thanh toán:</strong> ${this.getPaymentMethodText(paymentMethod)}</p>
                    <p><strong>Ngày tạo:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
                </div>
                
                <p>Hóa đơn chi tiết được đính kèm trong email này (nếu có).</p>
                
                <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua:</p>
                <ul>
                    <li>Email: support@orderfood.com</li>
                    <li>Hotline: 1900-xxxx</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>© 2025 OrderFood Restaurant. All rights reserved.</p>
                <p>Email này được gửi tự động, vui lòng không reply.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Generate payment confirmation template
  generatePaymentConfirmationTemplate(data) {
    const { customerName, orderNumber, amount, paymentMethod, transactionId } = data;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px; }
            .logo { font-size: 24px; font-weight: bold; }
            .content { padding: 20px 0; }
            .payment-info { background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🍜 OrderFood</div>
                <h2>✅ Thanh toán thành công!</h2>
            </div>
            
            <div class="content">
                <p>Xin chào <strong>${customerName}</strong>,</p>
                
                <p>Chúng tôi đã nhận được thanh toán của bạn thành công!</p>
                
                <div class="payment-info">
                    <p><strong>Đơn hàng:</strong> ${orderNumber}</p>
                    <p><strong>Số tiền:</strong> ${amount.toLocaleString('vi-VN')}đ</p>
                    <p><strong>Phương thức:</strong> ${this.getPaymentMethodText(paymentMethod)}</p>
                    ${transactionId ? `<p><strong>Mã giao dịch:</strong> ${transactionId}</p>` : ''}
                    <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                </div>
                
                <p>Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến bạn.</p>
                
                <p>Hóa đơn chi tiết sẽ được gửi trong email riêng biệt.</p>
            </div>
            
            <div class="footer">
                <p>© 2025 OrderFood Restaurant. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Helper method to get payment method text
  getPaymentMethodText(method) {
    const methods = {
      'cash': 'Tiền mặt',
      'momo': 'MoMo',
      'banking': 'Chuyển khoản ngân hàng'
    };
    return methods[method] || method;
  }

  // Test email connection
  async testConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service is ready' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
