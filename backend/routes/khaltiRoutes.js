const express = require('express');
const router = express.Router();
const axios = require('axios');

// Khalti payment verification endpoint
router.post('/verify', async (req, res) => {
    try {
        const { token, amount } = req.body;
        
        if (!token || !amount) {
            return res.status(400).json({
                success: false,
                message: "Token and amount are required"
            });
        }
        
        // Khalti verification request
        const payload = {
            token: token,
            amount: amount
        };
        
        // Add Khalti secret key from environment variables or config
        const khaltiSecretKey = "46dddb5ea6fe4862928b7e6714683551"; // Use environment variable in production
        
        const response = await axios.post(
            "https://khalti.com/api/v2/payment/verify/", 
            payload,
            {
                headers: {
                    'Authorization': `Key ${khaltiSecretKey}`, // Correct format
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log("Khalti verification response:", response.data);
        
        // If successful, return success response
        res.json({
            success: true,
            data: response.data
        });
        
    } catch (err) {
        console.error("Error verifying Khalti payment:", err.response?.data || err.message);
        res.status(500).json({
            success: false,
            message: err.response?.data?.detail || "Payment verification failed"
        });
    }
});

module.exports = router;
