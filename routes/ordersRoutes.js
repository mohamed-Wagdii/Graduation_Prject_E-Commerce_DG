const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
} = require("../controllers/orderController");

const authMiddleware = require("../Middleware/authMiddleware");

router.post("/", authMiddleware, placeOrder);                        
router.get("/my-orders", authMiddleware, getMyOrders);              
router.get("/:id", authMiddleware, getOrderById);                    

router.get("/", authMiddleware, getAllOrders);       

module.exports = router;