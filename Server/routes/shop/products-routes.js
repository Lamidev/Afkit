const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getProductsByBrand
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/brand", getProductsByBrand);

module.exports = router;
