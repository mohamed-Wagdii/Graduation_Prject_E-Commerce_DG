const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number,
     required: true,
      min: 1
     },
  priceAtPurchase: {
     type: Number,
     required: true
     }, 
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalPrice: { type: Number,
       required: true
       },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "credit_card", "paypal"],
      default: "cash_on_delivery",
    },
    isPaid: { type: Boolean,
       default: false
       },
    paidAt: { 
      type: Date

     },
    isDelivered: {
       type: Boolean,
       default: false 
      },
    deliveredAt: { 
      type: Date
     },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);