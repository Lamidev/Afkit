const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    cartItems: [
      {
        productId: String,
        title: String,
        image: String,
        price: String,
        quantity: Number,
        condition: String,
      },
    ],
    addressInfo: {
      addressId: String,
      fullName: String,
      email: String,
      address: String,
      city: String,
      region: String,
      phone: String,
      backupPhone: String,
      notes: String,
      logisticsRoute: String,
      deliveryPreference: String,
      isGift: Boolean,
      isAssisted: Boolean,
      receiptName: String,
      recipientEmail: String,
      // Enhanced tracking for "Someone Else"
      receiptInfo: {
        name: String,
        address: String,
        phone: String,
        email: String,
        ownerType: String,
      },
      shippingInfo: {
        name: String,
        location: String,
        phone: String,
        backupPhone: String,
      },
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "rejected",
        "cancelled"
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "Paystack",
    },
    paymentType: {
      type: String,
      enum: ["full", "commitment"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partially_paid", "failed"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    balanceAmount: {
      type: Number,
      default: 0,
    },
    paymentId: String, // Paystack Reference
    payerEmail: String,
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderUpdateDate: {
      type: Date,
      default: Date.now,
    },
    isStockDeducted: {
      type: Boolean,
      default: false,
    },
    isEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
