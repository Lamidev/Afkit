const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Product = require("../../models/products");
const paystackHelper = require("../../helpers/paystack")(process.env.PAYSTACK_SECRET_KEY);
const { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } = require("../../mailtrap/emails");

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
      calculatedTotal += product.price * item.quantity;
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
    
    // Enforcement: Orders under 15k MUST be paid in full
    const enforcedPaymentType = totalAmount < 15000 ? "full" : paymentType;
    const finalAmountToPay = enforcedPaymentType === "commitment" ? COMMITMENT_FEE : totalAmount;

    // 3. Initialize Paystack Transaction
    const callbackUrl = `${process.env.CLIENT_URL}/shop/paystack-return`;

    const paystackData = await paystackHelper.initializePayment({
      email: payerEmail,
      amount: finalAmountToPay * 100, // Paystack uses Kobo
      callback_url: callbackUrl,
      metadata: {
        userId,
        paymentType,
      },
    });

    if (!paystackData.status) {
      return res.status(400).json({
        success: false,
        message: "Paystack initialization failed",
      });
    }

    // 4. Create Order in DB (Pending)
    const orderId = `ORD-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

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
      await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });

      await order.save();

      // ── Send Emails (non-blocking, single send guard already handled above) ──
      // 1. Buyer confirmation email
      sendOrderConfirmationEmail(order).catch(err => {
        console.error("Order email error:", err.message);
      });

      // 2. Admin notification email
      sendAdminOrderNotificationEmail(order).catch(err => {
        console.error("Admin order notification email error:", err.message);
      });

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
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  deleteOrder,
};
