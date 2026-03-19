const express = require("express");
const {
  createOrder,
  capturePayment,
  paystackWebhook,
  getAllOrdersByUser,
  getOrderDetails,
  deleteOrder,
} = require("../../controllers/shop/order-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { orderRateLimiter } = require("../../middleware/rate-limiter");

const router = express.Router();

// Webhook route - must NOT be protected by authMiddleware
router.post("/webhook", paystackWebhook);

router.post("/create", authMiddleware, orderRateLimiter, createOrder);
router.post("/capture", authMiddleware, capturePayment);
router.get("/list/:userId", authMiddleware, getAllOrdersByUser);
router.get("/details/:id", authMiddleware, getOrderDetails);
router.delete("/delete/:id", authMiddleware, deleteOrder);

module.exports = router;
