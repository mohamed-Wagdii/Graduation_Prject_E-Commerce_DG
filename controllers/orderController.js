const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");


const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ msg: "Cart is empty" });

    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product)
        return res.status(404).json({ msg: `Product not found: ${item.product._id}` });

      if (item.quantity > product.stock)
        return res.status(400).json({ msg: `Insufficient stock for: ${product.name}` });

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price, 
      });
    }

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod: paymentMethod || "cash_on_delivery",
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    cart.items = [];
    await cart.save();

    res.status(201).json({ msg: "Order placed successfully", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price image")


    res.json({ data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};


const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name price image"
    );

    if (!order) return res.status(404).json({ msg: "Order Not Found" });

    if (order.user !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ msg: "Not Authorized" });

    res.json({ data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: "Order Not Found" });

    if (order.user !== req.user.id)
      return res.status(403).json({ msg: "Not Authorized" });
    
    if (order.status === "cancelled"){
      return res.status(400).json({ msg: "Order is already cancelled" });
}

    
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ msg: "Order cancelled", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")

    res.json({ data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
};