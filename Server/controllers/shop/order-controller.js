const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Product = require("../../models/products");
const mongoose = require("mongoose");
const crypto = require("crypto");
const monnifyHelper = require("../../helpers/monnify")(
  process.env.MONNIFY_API_KEY,
  process.env.MONNIFY_SECRET_KEY,
  process.env.MONNIFY_BASE_URL
);
const { 
  sendAdminOrderNotificationEmail,
  sendDeliveredNotifications,
  sendOrderConfirmationEmail 
} = require("../../mailtrap/emails");
const { 
  sendAdminAlerts 
} = require("../../helpers/notifications");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      paymentType, // "full" or "commitment"
      orderDate,
      orderUpdateDate,
      payerEmail,
    } = req.body;

    // 1. Initial Stock and Price Check
    let calculatedTotal = 0;
    for (let item of cartItems) {
      let product = await Product.findById(item.productId);
      if (!product || product.totalStock < item.quantity) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.title} is out of stock or does not exist.`,
        });
      }
      // Use salePrice if it exists and is greater than 0, otherwise use regular price
      const effectivePrice = (product.salePrice && product.salePrice > 0) ? product.salePrice : product.price;
      calculatedTotal += effectivePrice * item.quantity;
    }

    // Security: Validate that the total amount sent by client matches the server calculation
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: "Order amount mismatch. Please refresh your cart and try again.",
      });
    }

    // 2. Determine Payment Amount
    // ₦10,000 commitment fee or Full Amount
    const COMMITMENT_FEE = 10000;
    
    // Enforcement: 
    // 1. Orders under ₦10,000 MUST be paid in full.
    // 2. Gifts / Purchases for someone else MUST be paid in full (Business Rule).
    const isGift = addressInfo?.isGift;
    const enforcedPaymentType = (totalAmount < 10000 || isGift) ? "full" : paymentType;
    const finalAmountToPay = enforcedPaymentType === "commitment" ? COMMITMENT_FEE : totalAmount;

    // 3. Generate Order ID Early
    const orderId = `ORD-${crypto.randomBytes(2).toString("hex").toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

    // 4. Initialize Payment Transaction
    let approvalURL = "";
    let paymentReference = "";

    const monnifyData = await monnifyHelper.initializeTransaction({
      amount: finalAmountToPay,
      customerName: addressInfo?.fullName || "Customer",
      customerEmail: payerEmail,
      paymentReference: orderId, // Use orderId as payment reference for Monnify
      paymentDescription: `Order ${orderId}`,
      currencyCode: "NGN",
      contractCode: (process.env.MONNIFY_CONTRACT_CODE || "").trim(),
      redirectUrl: `${(process.env.CLIENT_URL || "").trim()}/shop/monnify-return`,
      metaData: {
        userId,
        orderId,
        paymentType: enforcedPaymentType,
      },
      paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
    });

    if (!monnifyData.requestSuccessful) {
      console.error("Monnify Initialization Failed:", monnifyData);
      return res.status(400).json({
        success: false,
        message: monnifyData.responseMessage || "Monnify initialization failed",
      });
    }
    approvalURL = monnifyData.requestSuccessful ? monnifyData.responseBody.checkoutUrl : "";
    paymentReference = monnifyData.requestSuccessful ? monnifyData.responseBody.transactionReference : "";

    // 5. Create Order in DB (Pending)

    const newlyCreatedOrder = new Order({
      userId,
      orderId, // Unique shorter ID
      cartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod,
      paymentType: enforcedPaymentType,
      paymentStatus: "pending",
      totalAmount,
      amountPaid: 0, // Will be updated on capture
      balanceAmount: totalAmount, // Initial balance is total
      paymentId: paymentReference,
      payerEmail,
      orderDate,
      orderUpdateDate,
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      approvalURL: approvalURL,
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while creating order",
    });
  }
};

const payOrderBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus !== "partially_paid" || order.balanceAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "This order does not have a balance to pay.",
      });
    }

    const monnifyData = await monnifyHelper.initializeTransaction({
      amount: order.balanceAmount,
      customerName: order.addressInfo?.fullName || "Customer",
      customerEmail: order.payerEmail,
      paymentReference: `${order.orderId}-BAL`,
      paymentDescription: `Balance payment for Order ${order.orderId}`,
      currencyCode: "NGN",
      contractCode: (process.env.MONNIFY_CONTRACT_CODE || "").trim(),
      redirectUrl: `${(process.env.CLIENT_URL || "").trim()}/shop/monnify-return`,
      metaData: {
        orderId: order._id,
        paymentType: "balance_completion",
      },
      paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
    });

    if (!monnifyData.requestSuccessful) {
      console.error("Monnify Balance Initialization Failed:", monnifyData);
      return res.status(400).json({
        success: false,
        message: monnifyData.responseMessage || "Monnify initialization failed",
      });
    }
    const approvalURL = monnifyData.responseBody.checkoutUrl;

    res.status(200).json({
      success: true,
      approvalURL: approvalURL,
      orderId: order._id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error initializing balance payment",
    });
  }
};

const captureBalancePayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Idempotency: If already paid, just return success
    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Balance already paid",
        data: order,
      });
    }

    // Verification Logic
    let amountReceived = 0;
    let gatewayOrderId = "";

    // Try Monnify verification
    try {
      const monnifyData = await monnifyHelper.verifyTransaction(paymentId);
      if (monnifyData.requestSuccessful && monnifyData.responseBody?.paymentStatus === "PAID") {
        amountReceived = monnifyData.responseBody?.amountPaid || 0;
        gatewayOrderId = monnifyData.responseBody?.paymentReference; // We sent `${order.orderId}-BAL` or orderId
      }
    } catch (err) {
      console.error("Monnify Verification Error:", err.message);
    }

    if (amountReceived > 0) {
      // SECURITY CHECK: Ensure the payment was for this order
      // We accept matches against orderId, mongo _id, or the special balance ref
      const isValidRef = 
        gatewayOrderId === order.orderId || 
        gatewayOrderId === order._id.toString() || 
        gatewayOrderId === `${order.orderId}-BAL`;

      if (!isValidRef) {
         return res.status(400).json({
          success: false,
          message: "Payment reference mismatch. Security alert triggered.",
        });
      }

      await updateOrderOnPaymentSuccess(order, amountReceived, "balance_completion");

      res.status(200).json({
        success: true,
        message: "Balance payment captured successfully",
        data: order,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed or payment not successful",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error capturing balance payment",
    });
  }
};



const monnifyWebhook = async (req, res) => {
  try {
    const secret = process.env.MONNIFY_SECRET_KEY;
    const monnifySig = req.headers["monnify-signature"];

    if (!req.rawBody || !monnifySig) {
      return res.status(400).send("Missing data");
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.rawBody)
      .digest("hex");

    if (hash !== monnifySig) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    if (event.eventType === "SUCCESSFUL_TRANSACTION") {
      const transactionData = event.eventData;
      if (!transactionData) return res.status(400).send("Invalid event data");
      const paymentReference = transactionData.transactionReference;
      const orderIdFromRef = transactionData.paymentReference; // We used orderId as paymentReference
      const amountReceived = transactionData.amountPaid;
      const metadata = transactionData.metaData;

      let query = {
        $or: [
          { paymentId: paymentReference },
          { orderId: orderIdFromRef },
          { orderId: metadata?.orderId }
        ]
      };

      if (mongoose.Types.ObjectId.isValid(metadata?.orderId)) {
        query.$or.push({ _id: metadata.orderId });
      }

      let order = await Order.findOne(query);

      if (order) {
        // Shared logic for updating order
        await updateOrderOnPaymentSuccess(order, amountReceived, metadata?.paymentType || order.paymentType);
      }
    }
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("[MONNIFY WEBHOOK] ❌ Processing error:", error.message);
    res.status(500).send("Internal error");
  }
};

const captureMonnifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    let order = await Order.findById(orderId);
    if (!order) {
      // Fallback
      order = await Order.findOne({ paymentId });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.paymentStatus === "paid" || (order.paymentType === "commitment" && order.paymentStatus === "partially_paid")) {
       return res.status(200).json({ success: true, data: order });
    }

    const verificationData = await monnifyHelper.verifyTransaction(paymentId);

    if (verificationData.requestSuccessful && verificationData.responseBody?.paymentStatus === "PAID") {
      const amountReceived = verificationData.responseBody?.amountPaid || 0;
      const gatewayOrderId = verificationData.responseBody?.paymentReference; // We sent orderId as paymentReference

      // CRITICAL SECURITY CHECK: Ensure the payment was actually for THIS order
      if (gatewayOrderId !== order.orderId) {
        return res.status(400).json({
          success: false,
          message: "Payment reference mismatch. Security alert triggered.",
        });
      }

      const paymentType = verificationData.responseBody.metaData?.paymentType || order.paymentType;
      await updateOrderOnPaymentSuccess(order, amountReceived, paymentType);

      res.status(200).json({
        success: true,
        message: "Monnify payment verified",
        data: order,
      });
    } else {
      console.error("Monnify Verification Failed or Not Paid:", verificationData);
      res.status(400).json({ success: false, message: "Monnify payment not successful" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error capturing Monnify payment" });
  }
};

async function updateOrderOnPaymentSuccess(order, amountReceived, paymentType) {
  // If already processed, skip
  if (paymentType === "balance_completion") {
    if (order.paymentStatus === "paid") return;
    
    order.amountPaid += amountReceived;
    order.balanceAmount = Math.max(0, order.totalAmount - order.amountPaid);
    if (order.balanceAmount === 0) order.paymentStatus = "paid";
    order.orderUpdateDate = new Date();
    await order.save();

    if (order.orderStatus === "delivered") {
      sendDeliveredNotifications(order).catch(console.error);
    } else {
      sendOrderConfirmationEmail(order).catch(console.error);
      sendAdminOrderNotificationEmail(order).catch(console.error);
    }
    sendAdminAlerts(order, true).catch(console.error);
  } else {
    if (order.paymentStatus === "paid" || order.paymentStatus === "partially_paid") return;

    order.paymentStatus = order.paymentType === "commitment" ? "partially_paid" : "paid";
    order.orderStatus = "confirmed";
    order.amountPaid = amountReceived;
    order.balanceAmount = order.totalAmount - amountReceived;
    order.orderUpdateDate = new Date();

    if (!order.isStockDeducted) {
      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);
        if (product) {
          const deductQty = Math.min(item.quantity, product.totalStock);
          if (deductQty > 0) {
            product.totalStock = Math.max(0, product.totalStock - deductQty);
            await product.save();
          }
        }
      }
      order.isStockDeducted = true;
    }

    await Cart.findOneAndUpdate({ userId: order.userId }, { $set: { items: [] } });

    if (!order.isEmailSent) {
      order.isEmailSent = true;
      await order.save();
      sendOrderConfirmationEmail(order).catch(console.error);
      sendAdminOrderNotificationEmail(order).catch(console.error);
      sendAdminAlerts(order, false).catch(console.error);
    } else {
      await order.save();
    }
  }
}

const cleanupPendingOrders = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    // Find orders that are pending and older than 24 hours
    // CRITICAL: We only delete if there is NO paymentId (meaning it was never even sent to the gateway)
    const result = await Order.deleteMany({
      orderStatus: "pending",
      paymentStatus: "pending",
      paymentId: { $exists: false }, // Only delete if no payment attempt was made
      createdAt: { $lt: twentyFourHoursAgo }
    });
    
    if (result.deletedCount > 0) {
      console.log(`🧹 Cleaned up ${result.deletedCount} abandoned pending orders.`);
    }
  } catch (error) {
    console.error("Error cleaning up pending orders:", error.message);
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Valid User ID is required",
      });
    }

    // Only show orders to the user that have been confirmed or partially paid (deposit).
    // This prevents abandoned checkouts from cluttering their order history.
    const orders = await Order.find({ 
      userId, 
      paymentStatus: { $in: ["paid", "partially_paid"] } 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching orders",
    });
  }
};

const getOrderDetails = async (req, res) => {
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
      message: "Some error occurred while fetching order details",
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
  createOrder,
  payOrderBalance,
  captureBalancePayment,
  captureMonnifyPayment,
  monnifyWebhook,
  cleanupPendingOrders,
  getAllOrdersByUser,
  getOrderDetails,
  deleteOrder,
};
