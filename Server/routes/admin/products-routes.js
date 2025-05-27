

const express = require("express");
const {
  handleImageUpload,
  handleMultipleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

// Single image upload (kept for backward compatibility)
router.post("/upload-image", upload.single("my_file"), handleImageUpload);

// Multiple image upload (new endpoint)
router.post("/upload-images", upload.array("my_files", 4), handleMultipleImageUpload);

// Product CRUD operations
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;