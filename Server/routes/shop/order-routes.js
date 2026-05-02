const express = require("express");
const {
  createOrder,
  payOrderBalance,
  capturePayment,
  captureBalancePayment,
  captureMonnifyPayment,
  paystackWebhook,
  monnifyWebhook,
  getAllOrdersByUser,
  getOrderDetails,
  deleteOrder,
} = require("../../controllers/shop/order-controller");

const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { orderRateLimiter } = require("../../middleware/rate-limiter");

const router = express.Router();

// Webhook routes - must NOT be protected by authMiddleware
router.post("/webhook", paystackWebhook);
router.post("/monnify-webhook", monnifyWebhook);

router.post("/create", authMiddleware, orderRateLimiter, createOrder);
router.post("/capture", authMiddleware, capturePayment);
router.post("/capture-monnify", authMiddleware, captureMonnifyPayment);
router.post("/pay-balance/:id", authMiddleware, payOrderBalance);
router.post("/capture-balance", authMiddleware, captureBalancePayment);
router.get("/list/:userId", authMiddleware, getAllOrdersByUser);
router.get("/details/:id", authMiddleware, getOrderDetails);
router.delete("/delete/:id", authMiddleware, deleteOrder);

module.exports = router;
