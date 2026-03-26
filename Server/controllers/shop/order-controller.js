const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Product = require("../../models/products");
const crypto = require("crypto");
const paystackHelper = require("../../helpers/paystack")(process.env.PAYSTACK_SECRET_KEY);
const { 
  sendAdminOrderNotificationEmail,
  sendDeliveredNotifications 
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

    // 2. Determine Paystack Amount
    // ₦10,000 commitment fee or Full Amount
    const COMMITMENT_FEE = 10000;
    
    // Enforcement: 
    // 1. Orders under ₦10,000 MUST be paid in full.
    // 2. Gifts / Purchases for someone else MUST be paid in full (Business Rule).
    const isGift = addressInfo?.isGift;
    const enforcedPaymentType = (totalAmount < 10000 || isGift) ? "full" : paymentType;
    const finalAmountToPay = enforcedPaymentType === "commitment" ? COMMITMENT_FEE : totalAmount;

    // 3. Initialize Paystack Transaction
    const callbackUrl = `${process.env.CLIENT_URL}/shop/paystack-return`;

    const paystackData = await paystackHelper.initializePayment({
      email: payerEmail,
      amount: finalAmountToPay * 100, // Paystack uses Kobo
      callback_url: callbackUrl,
      metadata: {
        userId,
        paymentType: enforcedPaymentType,
      },
    });

    if (!paystackData.status) {
      return res.status(400).json({
        success: false,
        message: "Paystack initialization failed",
      });
    }

    // 4. Create Order in DB (Pending)
    const orderId = `ORD-${crypto.randomBytes(2).toString("hex").toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

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
      paymentId: paystackData.data.reference,
      payerEmail,
      orderDate,
      orderUpdateDate,
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      approvalURL: paystackData.data.authorization_url,
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

    const callbackUrl = `${process.env.CLIENT_URL}/shop/paystack-return`;

    const paystackData = await paystackHelper.initializePayment({
      email: order.payerEmail,
      amount: order.balanceAmount * 100,
      callback_url: callbackUrl,
      metadata: {
        orderId: order._id,
        paymentType: "balance_completion",
      },
    });

    if (!paystackData.status) {
      return res.status(400).json({
        success: false,
        message: "Paystack initialization failed",
      });
    }

    res.status(200).json({
      success: true,
      approvalURL: paystackData.data.authorization_url,
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

    const verificationData = await paystackHelper.verifyPayment(paymentId);

    if (verificationData.status && verificationData.data.status === "success") {
      const amountReceived = verificationData.data.amount / 100;

      order.amountPaid += amountReceived;
      order.balanceAmount = Math.max(0, order.totalAmount - order.amountPaid);
      if (order.balanceAmount === 0) {
        order.paymentStatus = "paid";
      }
      order.orderUpdateDate = new Date();

      await order.save();

      // Trigger Warranty Email / Receipt update
      if (order.orderStatus === "delivered") {
        sendDeliveredNotifications(order).catch(console.error);
      } else {
        sendOrderConfirmationEmail(order).catch(console.error);
        
        // Double Alerts for Admin (WhatsApp + SMS)
        sendAdminAlerts(order, true).catch(console.error);
      }

      res.status(200).json({
        success: true,
        message: "Balance payment captured successfully",
        data: order,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
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

const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // ── Idempotency Guard ───────────────────────────────────────────────────
    // If this order was already confirmed (e.g. page refresh, React double-invoke),
    // return success without re-processing to prevent duplicate emails & stock deduction.
    if (order.paymentStatus === "paid" || order.paymentStatus === "partially_paid") {
      // Even if already confirmed, try to ensure cart is cleared for this user
      await Cart.findOneAndUpdate({ userId: order.userId }, { $set: { items: [] } });
      
      return res.status(200).json({
        success: true,
        message: "Order already confirmed",
        data: order,
      });
    }

    // Verify with Paystack
    const verificationData = await paystackHelper.verifyPayment(paymentId);

    if (verificationData.status && verificationData.data.status === "success") {
      // Update Payment Info
      const amountReceived = verificationData.data.amount / 100; // Convert from Kobo
      
      order.paymentStatus = order.paymentType === "commitment" ? "partially_paid" : "paid";
      order.orderStatus = "confirmed";
      order.amountPaid = amountReceived;
      order.balanceAmount = order.totalAmount - amountReceived;
      order.orderUpdateDate = new Date();

      // Deduct Stock (only if not already deducted)
      if (!order.isStockDeducted) {
        for (let item of order.cartItems) {
          let product = await Product.findById(item.productId);
          if (product) {
            // Guard against going below 0 (race condition / double capture)
            const deductQty = Math.min(item.quantity, product.totalStock);
            if (deductQty > 0) {
              product.totalStock -= deductQty;
              await product.save();
            } else {
              console.warn(
                `Stock already at 0 for product ${product._id} (${product.title}). Skipping deduction.`
              );
            }
          }
        }
        order.isStockDeducted = true;
      }

      // Clear Cart
      await Cart.findOneAndUpdate({ userId: order.userId }, { $set: { items: [] } });

      // ── Send Emails (non-blocking, single send guard) ──
      // Use isEmailSent flag to prevent duplicate emails if capture fires twice
      if (!order.isEmailSent) {
        order.isEmailSent = true;
        await order.save(); // Save the status immediately to block other concurrent requests

        // 1. Buyer confirmation email
        sendOrderConfirmationEmail(order).catch(err => {
          console.error("Order email error:", err.message);
        });

        // 2. Admin notification email
        sendAdminOrderNotificationEmail(order).catch(err => {
          console.error("Admin order notification email error:", err.message);
        });

        // 3. Automated Admin Alerts (WhatsApp + SMS)
        sendAdminAlerts(order, false).catch(console.error);
      } else {
        await order.save();
      }

      res.status(200).json({
        success: true,
        message: "Order confirmed and payment verified",
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
      message: "Some error occurred while capturing payment",
    });
  }
};

const paystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.rawBody || JSON.stringify(req.body))
      .digest("hex");

    if (hash === req.headers["x-paystack-signature"]) {
      const event = req.body;

      if (event.event === "charge.success") {
        const paymentReference = event.data.reference;
        const amountReceived = event.data.amount / 100;
        const metadata = event.data.metadata;

        // Try to find the order by paymentId (for initial payments)
        // OR by orderId in metadata (for balance payments)
        let order = await Order.findOne({ 
          $or: [
            { paymentId: paymentReference },
            { _id: metadata?.orderId }
          ]
        });

        if (order) {
           // If it's a balance completion payment
           if (metadata?.paymentType === "balance_completion") {
             if (order.paymentStatus !== "paid") {
               order.amountPaid += amountReceived;
               order.balanceAmount = Math.max(0, order.totalAmount - order.amountPaid);
               if (order.balanceAmount === 0) order.paymentStatus = "paid";
               order.orderUpdateDate = new Date();
               await order.save();
               
               if (order.orderStatus === "delivered") {
                 sendDeliveredNotifications(order).catch(console.error);
               } else {
                 sendOrderConfirmationEmail(order).catch(console.error);
               }
                // 4. Balance Completion Alerts (WhatsApp + SMS)
                sendAdminAlerts(order, true).catch(console.error);
             }
           } 
           // Else it's an initial payment capture
           else if (order.paymentStatus !== "paid" && order.paymentStatus !== "partially_paid") {
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
              
              // 3. Automated Admin Alerts (WhatsApp + SMS)
              sendAdminAlerts(order, false).catch(console.error);
            } else {
              await order.save();
            }
          }
        }
      }
      res.status(200).send("Webhook received");
    } else {
      res.status(400).send("Invalid signature");
    }
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    res.status(500).send("Webhook endpoint error");
  }
};

const cleanupPendingOrders = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    // Find orders that are pending and older than 24 hours
    const result = await Order.deleteMany({
      orderStatus: "pending",
      paymentStatus: "pending",
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

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

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
  capturePayment,
  captureBalancePayment,
  paystackWebhook,
  cleanupPendingOrders,
  getAllOrdersByUser,
  getOrderDetails,
  deleteOrder,
};
