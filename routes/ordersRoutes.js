const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
} = require("../controllers/orderController");

const authMiddleware = require("../Middleware/authMiddleware");

router.post("/orders", authMiddleware, placeOrder);
router.get("/orders", authMiddleware, getAllOrders);
router.get("/orders/my-orders", authMiddleware, getMyOrders);
router.get("/orders/:id", authMiddleware, getOrderById);
router.put("/orders/:id/cancel", authMiddleware, cancelOrder);

module.exports = router;
