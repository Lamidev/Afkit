
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const {
  getUserStats,
  getVerifiedUsersList, // Import the new function
} = require("../../controllers/admin/user-stats-controller");

router.get("/", authMiddleware, getUserStats);
router.get("/verified-list", authMiddleware, getVerifiedUsersList); // New route

module.exports = router;