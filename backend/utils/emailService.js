const nodemailer = require('nodemailer');

// Get email configuration from environment variables with fallbacks
const EMAIL_USER = process.env.EMAIL_USER || process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || process.env.PASSWORD_APP_EMAIL;

// Create a transporter with debugging enabled
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  },
  debug: true, // Enable debugging
  logger: true // Enable logger
});

// Test the connection immediately on startup
(async function() {
  try {
    console.log('Testing email connection...');
    console.log('Using credentials:', { 
      email: EMAIL_USER, 
      password: EMAIL_PASSWORD ? '****' + EMAIL_PASSWORD.slice(-4) : 'not set' 
    });
    
    const result = await transporter.verify();
    console.log('Email connection successful:', result);
  } catch (error) {
    console.error('Email connection failed:', error);
    console.error('Make sure you have:');
    console.error('1. Set the correct email and app password in .env file');
    console.error('2. Enabled less secure apps if not using app password');
    console.error('3. Check if your email provider requires additional configuration');
  }
})();

/**
 * Send email notification with enhanced debugging
 */
const sendEmail = async (to, subject, html) => {
  console.log(`===== EMAIL SENDING ATTEMPT =====`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Using email credentials:`, {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD ? '[HIDDEN]' : 'NOT SET'
  });
  
  try {
    const mailOptions = {
      from: EMAIL_USER || 'your-email@gmail.com',
      to,
      subject,
      html
    };
    
    console.log('Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    console.log('Full email response:', info);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return { success: false, error };
  }
};

// Generate order confirmation email content
const generateOrderConfirmationEmail = (order) => {
  const orderItems = order.items.map(item => {
    // Improved product name handling
    let productName = 'Unknown Product';
    
    // Check for all possible ways product name might be stored
    if (item.productName) {
      productName = item.productName;
    } else if (item.productId && typeof item.productId === 'object') {
      if (item.productId.name) {
        productName = item.productId.name;
      }
    } else if (item.product && item.product.name) {
      productName = item.product.name;
    }
    
    // Add any custom details if available
    if (item.customDetails && item.customDetails.itemType) {
      productName += ` (${item.customDetails.itemType})`;
    }
    
    // Add size if available
    if (item.size) {
      productName += ` - Size: ${item.size}`;
    }
    
    return `<tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${productName}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">Rs. ${item.price.toFixed(2)}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">Rs. ${(item.price * item.quantity).toFixed(2)}</td>
            </tr>`;
  }).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Confirmation</h2>
      
      <p>Dear ${order.fullName},</p>
      
      <p>Thank you for your order! We're pleased to confirm that we've received your order.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Order Summary</h3>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Order Status:</strong> ${order.status}</p>
        <p><strong>Shipping Address:</strong> ${order.address}</p>
      </div>
      
      <h3 style="color: #333;">Order Details</h3>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="text-align: right; padding: 10px;"><strong>Total:</strong></td>
            <td style="padding: 10px;"><strong>Rs. ${(order.total || order.totalAmount).toFixed(2)}</strong></td>
          </tr>
        </tfoot>
      </table>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p>If you have any questions about your order, please contact our customer service at <a href="mailto:support@istitch.com">support@istitch.com</a>.</p>
        <p>Thank you for shopping with iStitch!</p>
      </div>
    </div>
  `;
};

// Generate admin notification email content
const generateAdminOrderNotificationEmail = (order) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Order Notification</h2>
      
      <p>A new order has been placed on the iStitch store.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Order Details</h3>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Customer:</strong> ${order.fullName}</p>
        <p><strong>Contact:</strong> ${order.contactNumber}</p>
        <p><strong>Total Amount:</strong> Rs. ${(order.total || order.totalAmount).toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      </div>
      
      <p>Please log in to the admin dashboard to view and process this order.</p>
    </div>
  `;
};

module.exports = {
  sendEmail,
  generateOrderConfirmationEmail,
  generateAdminOrderNotificationEmail
};