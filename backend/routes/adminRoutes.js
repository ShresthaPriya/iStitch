const express = require('express');
const router = express.Router();
const User = require('../models/UserSchema');
const { LoginAdmin } = require('../controller/user/admin');
const { adminLogin } = require('../controller/admin/adminAuthController');
const adminAuth = require('../middleware/adminAuth');

// Admin login route (no auth middleware here)
router.post('/login', adminLogin); // Admin login route
router.post('/admin-login', adminLogin);  // Alias for compatibility

// Protected admin routes
router.get('/profile', adminAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Fetch customer details
router.get('/customers', async (req, res) => {
    try {
        const customers = await User.find({ isAdmin: false }, 'email fullname');
        res.status(200).json({ success: true, customers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;