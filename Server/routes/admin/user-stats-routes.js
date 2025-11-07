
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const {
  getUserStats,
  getVerifiedUsersList, 
} = require("../../controllers/admin/user-stats-controller");

router.get("/", authMiddleware, getUserStats);
router.get("/verified-list", authMiddleware, getVerifiedUsersList); 

module.exports = router;