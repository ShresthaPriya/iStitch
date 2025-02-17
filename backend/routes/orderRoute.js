const express = require("express");
const { getOrders, addOrder, updateOrder, deleteOrder } = require("../controller/order/orderDetails");

const router = express.Router();

router.get("/", getOrders);
router.post("/", addOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
