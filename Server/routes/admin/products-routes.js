
const express = require("express");
const {
  handleImageUpload,
  handleMultipleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
  hideProduct,
  unhideProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post(
  "/upload-images",
  upload.array("my_files", 4),
  handleMultipleImageUpload
);

router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.patch("/hide/:id", hideProduct);
router.patch("/unhide/:id", unhideProduct);
router.get("/get", fetchAllProducts);

module.exports = router;