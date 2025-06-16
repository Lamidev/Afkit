// const express = require("express");
// const router = express.Router();
// const { countVerifiedUsers } = require("../../controllers/admin/verified-user-controller");

// router.get("/", countVerifiedUsers);

// module.exports = router;

// Example for a protected route

const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { getUserStats } = require("../../controllers/admin/user-stats-controller");

// Add admin check if needed
router.get("/", authMiddleware, getUserStats);

module.exports = router;