const Customer = require("../../models/CustomerSchema");
const Order = require("../../models/OrderSchema");
const Item = require("../../models/ItemSchema");

const getMetrics = async (req, res) => {
    try {
        const customerCount = await Customer.countDocuments();
        const pendingOrderCount = await Order.countDocuments({ status: "pending" });
        const totalOrderCount = await Order.countDocuments();
        const totalSales = await Order.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalItemCount = await Item.countDocuments();

        res.status(200).json({
            success: true,
            metrics: {
                customerCount,
                pendingOrderCount,
                totalOrderCount,
                totalSales: totalSales[0]?.total || 0,
                totalItemCount
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { getMetrics };
