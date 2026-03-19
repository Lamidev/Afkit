const express = require("express");
const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  deleteOrder,
} = require("../../controllers/admin/order-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.get("/get", authMiddleware, getAllOrdersOfAllUsers);
router.get("/details/:id", authMiddleware, getOrderDetailsForAdmin);
router.put("/update/:id", authMiddleware, updateOrderStatus);
router.delete("/delete/:id", authMiddleware, deleteOrder);

module.exports = router;
