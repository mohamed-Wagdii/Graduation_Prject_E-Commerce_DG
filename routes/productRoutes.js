const express = require("express");

const router = express.Router();

const {
  addProductController,
  getAllProductsController,
  searchProductsController,
 
} = require("../controllers/productController");

const {
  getProductDetailsController,
} = require("../controllers/ProductDetails");

const authMiddleware = require("../Middleware/authMiddleware");

const uploadImageProduct = require("../Middleware/uploadImage");

router.post("/product",
  authMiddleware,
  uploadImageProduct,
  addProductController,
);
router.get("/product", getAllProductsController);
router.get("/details/:id", getProductDetailsController);
router.get("/search", searchProductsController);


module.exports = router;
