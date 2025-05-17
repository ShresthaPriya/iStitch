const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/emailService');

// Route to test email functionality
router.get('/test', async (req, res) => {
  try {
    console.log('Testing email sending...');
    
    // Get admin email from env var or use a default
    const adminEmail = process.env.ADMIN_EMAIL || 'sugamdangal52@gmail.com';
    console.log(`Using admin email: ${adminEmail}`);
    
    const result = await sendEmail(
      adminEmail, // Use the admin email from environment variables
      'Email Test from iStitch',
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Test</h2>
        <p>This is a test email from the iStitch application.</p>
        <p>If you received this email, the email sending functionality is working correctly!</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
      </div>`
    );
    
    if (result.success) {
      console.log('Test email sent successfully!');
      return res.json({
        success: true,
        message: 'Test email sent successfully!',
        details: result
      });
    } else {
      console.error('Failed to send test email:', result.error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in test email endpoint:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Add a new test route that allows specifying an email
router.get('/test/:email', async (req, res) => {
  try {
    const testEmail = req.params.email;
    console.log(`Testing email sending to specific address: ${testEmail}`);
    
    const result = await sendEmail(
      testEmail,
      'Email Test from iStitch',
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Test</h2>
        <p>This is a test email from the iStitch application.</p>
        <p>If you received this email, the email sending functionality is working correctly!</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
      </div>`
    );
    
    if (result.success) {
      console.log(`Test email sent successfully to ${testEmail}!`);
      return res.json({
        success: true,
        message: `Test email sent successfully to ${testEmail}!`,
        details: result
      });
    } else {
      console.error(`Failed to send test email to ${testEmail}:`, result.error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in test email endpoint:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
