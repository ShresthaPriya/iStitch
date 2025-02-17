const express = require('express');
const router = express.Router();
const User = require('../models/UserSchema');
const { LoginAdmin } = require('../controller/user/admin');

// Admin login route
router.post('/login', LoginAdmin); // Admin login route

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