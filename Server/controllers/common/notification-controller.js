const Notification = require("../../models/notification");
const Order = require("../../models/order");
const Cart = require("../../models/cart");

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Cleanup "Ghost" Orders (Pending orders > 1 hour old)
    // This keeps the Admin Dashboard clean
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await Order.updateMany(
      {
        userId,
        orderStatus: "pending",
        paymentStatus: "pending",
        createdAt: { $lt: oneHourAgo },
      },
      { orderStatus: "cancelled" }
    );

    // 2. Check for Abandoned Carts (Items in cart, no update in 30 mins)
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    const userCart = await Cart.findOne({ userId });

    if (userCart && userCart.items.length > 0 && userCart.updatedAt < thirtyMinsAgo) {
      // Check if we've already sent a "Cart Recovery" notification recently
      const existingNotification = await Notification.findOne({
        userId,
        title: "Still thinking about it? 🛒",
        createdAt: { $gt: oneHourAgo } // Don't spam, only once an hour max
      });

      if (!existingNotification) {
        const recoveryNotification = new Notification({
          userId,
          title: "Still thinking about it? 🛒",
          message: `Your gadgets are safe in your cart, but stock is limited! Return to checkout to secure them.`,
        });
        await recoveryNotification.save();
      }
    }

    // 3. Fetch latest active notifications
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error updating notification",
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted permanently",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
    });
  }
};

module.exports = { getUserNotifications, markNotificationAsRead, deleteNotification };
