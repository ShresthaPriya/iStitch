const Customer = require("../../models/UserSchema");
const Order = require("../../models/OrderSchema");
const Item = require("../../models/ItemSchema");

const getMetrics = async (req, res) => {
  try {
    const { range } = req.query; // e.g., '7d', '30d', etc.
    const now = new Date();
    let dateFilter = {};

    if (range === '7d') {
      dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
    } else if (range === '30d') {
      dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
    }

    // Basic counts
    const customerCount = await Customer.countDocuments();
    const pendingOrderCount = await Order.countDocuments({ status: "Pending" });
    const totalOrderCount = await Order.countDocuments();
    const totalItemCount = await Item.countDocuments();

    // Total Sales
    const totalSalesAgg = await Order.aggregate([
      {
        $match: {
          status: { $in: ["Completed", "Delivered"] },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    // Orders by status
    const statusCountsAgg = await Order.aggregate([
      { $match: { ...dateFilter } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const orderStatusCounts = statusCountsAgg.map((s) => ({
      name: s._id,
      count: s.count,
    }));

    // Orders over time (for chart)
    const ordersByDateAgg = await Order.aggregate([
      { $match: { ...dateFilter } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const ordersByDate = ordersByDateAgg.map((d) => ({
      date: d._id,
      count: d.count,
    }));

    // Top customers (by totalSpent)
    const topCustomersAgg = await Order.aggregate([
      { $match: { ...dateFilter } },
      {
        $group: {
          _id: "$customerId",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users", // adjust if your Customer model collection name is different
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $project: {
          _id: 0,
          name: "$customer.username", // adjust field as needed
          totalOrders: 1,
          totalSpent: 1,
        },
      },
    ]);

    // Best-selling items
    const bestSellingItemsAgg = await Order.aggregate([
      { $match: { ...dateFilter } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name", // assuming items is an array with name field
          totalSold: { $sum: "$items.quantity" }, // adjust if your item schema is different
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);
    const bestSellingItems = bestSellingItemsAgg.map((item) => ({
      item: item._id,
      sold: item.totalSold,
    }));

    // Send response
    res.status(200).json({
      success: true,
      metrics: {
        customerCount,
        pendingOrderCount,
        totalOrderCount,
        totalSales,
        totalItemCount,
        orderStatusCounts,
        ordersByDate,
        topCustomers: topCustomersAgg,
        bestSellers: bestSellingItems,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getMetrics };
