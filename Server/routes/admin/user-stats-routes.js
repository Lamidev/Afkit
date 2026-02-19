
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const {
  getUserStats,
  getAllUsersList, 
  deleteVerifiedUser,
} = require("../../controllers/admin/user-stats-controller");

router.get("/", authMiddleware, getUserStats);
router.get("/users-list", authMiddleware, getAllUsersList); 
router.delete("/delete-user/:id", authMiddleware, deleteVerifiedUser);

module.exports = router;