const express = require("express");
const {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require("../../controllers/common/notification-controller");

const router = express.Router();

router.get("/get/:userId", getUserNotifications);
router.put("/update/:notificationId", markNotificationAsRead);
router.delete("/delete/:notificationId", deleteNotification);

module.exports = router;
