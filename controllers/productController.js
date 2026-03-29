const Product = require("../models/Product");
const User = require("../models/User");

const addProductSchema = require("./validation/productValidation");

const addProductController = async (req, res) => {
  try {
    const { error, value } = addProductSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        msg: error.details.map((err) => err.message),
      });
    }

    const { name, price, stock } = value;

    const userId = req.user.id;

    const checkAdmin = await User.findById(userId);

    if (!checkAdmin) return res.status(404).json({ msg: "User Not Found" });

    if (checkAdmin.role !== "admin") return res.json({ msg: "Access Denied" });

    if (req.file) value.image = req.file.path;
    const product = await Product.create(value);

    res.status(201).json({
      msg: "Done Create Product",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

const searchProductsController = async (req, res) => {
  try {
    const  id  = req.params.id; 

    if (!id) {
      return res.status(400).json({ msg: "Please provide product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({
      msg: `Product found`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};
module.exports = {
  searchProductsController,
  addProductController,
  getAllProductsController,
};