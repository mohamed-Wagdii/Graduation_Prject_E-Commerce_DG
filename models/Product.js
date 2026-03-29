// Require mongoose
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
