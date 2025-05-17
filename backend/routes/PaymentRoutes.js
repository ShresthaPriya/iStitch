const Order = require('../models/Order'); // Adjust the path to your Order model
const router = express.Router();

router.post('/khalti/verify', async (req, res) => {
    const { token, amount, orderId } = req.body;

    try {
        // Verify payment with Khalti
        const response = await axios.post(
            'https://khalti.com/api/v2/payment/verify/',
            { token, amount },
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                },
            }
        );

        if (response.data.state.name === 'Completed') {
            // Update order status in the database
            const order = await Order.findOneAndUpdate(
                { orderId },
                { status: 'Processing', paymentVerified: true },
                { new: true }
            );

            if (!order) {
                console.error(`Order with ID ${orderId} not found.`);
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            console.log(`Order ${orderId} updated successfully.`);
            return res.status(200).json({ success: true, message: 'Payment verified and order updated', order });
        } else {
            console.error('Payment verification failed:', response.data);
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Khalti verification error:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;