const express = require("express");

const router = express.Router();

const { addCart, getCart } = require("../controllers/cartController");

const authMiddleware = require("../Middleware/authMiddleware");

router.post("/cart", authMiddleware, addCart);
router.get("/cart", authMiddleware, getCart);

module.exports = router;

