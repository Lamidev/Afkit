const Order = require("../../models/order");
const Product = require("../../models/products");
const Cart = require("../../models/cart");
const Notification = require("../../models/notification");
const { sendDeliveredNotifications } = require("../../mailtrap/emails");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    // Show all orders, including pending ones, so admin can see attempted payments
    const orders = await Order.find({ paymentStatus: { $in: ["paid", "partially_paid", "pending"] } }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching admin orders",
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, balanceAmount, amountPaid } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    // Once an order is delivered, it cannot be modified further (Locked state)
    if (order.orderStatus === "delivered") {
      return res.status(400).json({
        success: false,
        message: "This order has already been delivered and is now locked for modifications.",
      });
    }

    // Update fields if provided
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    // Balance update (In case admin collects cash on delivery)
    if (amountPaid !== undefined) {
        order.amountPaid = amountPaid;
        order.balanceAmount = order.totalAmount - amountPaid;
        if(order.balanceAmount <= 0) {
            order.paymentStatus = "paid";
        }
    }

    // Automatic Stock Deduction and Cart Clearing on Confirmation
    const confirmationStatuses = ["confirmed", "processing", "shipped", "delivered"];
    const paymentSuccessStatuses = ["paid", "partially_paid"];

    if (
      (confirmationStatuses.includes(order.orderStatus) || paymentSuccessStatuses.includes(order.paymentStatus)) &&
      !order.isStockDeducted
    ) {
      // 1. Deduct Stock
      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);
        if (product) {
          product.totalStock = Math.max(0, product.totalStock - item.quantity);
          await product.save();
        }
      }

      // 2. Clear Cart
      await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });

      // 3. Flag as Deducted
      order.isStockDeducted = true;
    }

    order.orderUpdateDate = new Date();
    await order.save();

    // 4. Trigger Notifications based on status
    const statusNotifications = {
      confirmed: {
        title: "Order Confirmed! ✅",
        message: `Your order ${order.orderId} has been confirmed. We are starting to prepare your gadgets!`,
      },
      processing: {
        title: "Order Processing ⚙️",
        message: `We're currently quality-checking and packing your order ${order.orderId}.`,
      },
      shipped: {
        title: "Order Shipped! 🚚",
        message: `Exciting news! Your order ${order.orderId} is on its way to you.`,
      },
      delivered: {
        title: "Order Delivered! 📦",
        message: `Great news! Your order ${order.orderId} has been delivered. Your 6-month warranty is now active.`,
      },
    };

    if (statusNotifications[order.orderStatus]) {
      const { title, message } = statusNotifications[order.orderStatus];
      const notification = new Notification({
        userId: order.userId,
        orderId: order._id,
        title,
        message,
      });
      await notification.save();

      // Special handling for delivery (Emails)
      if (order.orderStatus === "delivered") {
        sendDeliveredNotifications(order).catch(err => {
          console.error("Delivery notification email error:", err.message);
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error deleting order",
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  deleteOrder,
};
